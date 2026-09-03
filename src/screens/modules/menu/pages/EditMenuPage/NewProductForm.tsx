import { Form, Row, Select, Switch, Input } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from 'src/services/api';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Creators as ProductCreators } from 'src/store/modules/product/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { CurrencyInput } from 'src/stories/entry';
import { Modal } from 'src/stories/feedback/Modal';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import Space from 'src/stories/utils/Space';
import { getCurrency, notification } from 'src/utils/helpers';
import * as S from './styles';
import { Tag } from 'src/store/modules/menu/reducer';
import { ImageDataProps } from 'src/store/modules/product/reducer';
import type { Base64Props } from 'src/stories/entry/ImageUpload';

const { Option } = Select;
const { TextArea } = Input;

const rules = {
  titlePtBr: [
    {
      required: true,
      message: 'O título do item é obrigatório',
    },
  ],
  price: [
    {
      required: true,
      message: 'O preço do item é obrigatório',
    },
  ],
};

type Price = {
  price: number;
  origin_id: string;
};

type OnfinishValues = {
  imageBase64?: string;
  price?: number;
  titlePtBr: string;
  descriptionPtBr?: string;
  for_adults_only: boolean;
  active?: boolean;
  prices?: Array<Price> | Price;
  tags?: string[];
  portion?: number;
};

const currencyConfig = {
  locale: 'pt-BR',
  formats: {
    number: {
      BRL: {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    },
  },
};

const NewProductForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const {
    menu: { selectedMenuItem, tags },
    product: { isOpen, saving, editable },
    category: { currentCategory },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  const [disabled, setDisabled] = useState(true);
  const [imageData, setImageData] = useState<ImageDataProps | null | string>();
  const [price, setPrice] = useState<number>(0);
  const [forAdultsOnly, setForAdultsOny] = useState<boolean>(false);

  useEffect(() => {
    if (!saving) {
      handleResetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving]);

  const onFinish = (values: OnfinishValues) => {
    if (!currentCategory) {
      notification.error(
        'Erro ao adicionar um novo item',
        'É necessário ter uma categoria para adicionar um novo item'
      );
      return;
    }

    const data = {
      title: {
        'pt-br': values.titlePtBr ?? editable?.title['pt-br'],
      },
      description: {
        'pt-br': values.descriptionPtBr ?? editable?.description['pt-br'],
      },
      for_adults_only: forAdultsOnly,
      active: true,
      category_id: currentCategory?.id,
      price: (price ?? 0) * 100,
      portion: values.portion,
      tags: values.tags !== undefined ? values.tags.map((tag) => ({ tag_id: tag })) : [],
    };

    if (imageData && typeof imageData !== 'string' && imageData.name) {
      Object.defineProperty(data, 'imageBase64', {
        value: imageData,
        enumerable: true,
      });
    }

    if (editable) {
      dispatch(
        ProductCreators.editProductRequest({
          ...editable,
          ...data,
        })
      );

      return;
    } else {
      dispatch(ProductCreators.createProductRequest(data));
    }
  };

  const handleImage = (values: Base64Props, property: string) => {
    const extension = values.name.split('.').pop();

    const allowedExtensions = ['png', 'jpeg', 'jpg'];

    if (!allowedExtensions.find((item) => item === extension)) {
      notification.warning(
        'O formato da imagem inserida não é suportado!',
        'Somente os formatos png, jpeg e jpg são suportados!'
      );
      setDisabled(true);
      return;
    }

    setImageData({ ...values, property });
  };

  const handlePriceChange = (value: number) => {
    setPrice(value);
  };

  const handleResetForm = () => {
    form.resetFields();
    setImageData(null);
    setPrice(0);
    dispatch(ProductCreators.hideModal());
    setForAdultsOny(false);
    setDisabled(true);
    dispatch(ProductCreators.getProductFailed());
  };

  const closeModal = () => {
    handleResetForm();
    selectedMenuItem && dispatch(MenuCreators.resetFilteredMenuItems());
  };

  useEffect(() => {
    if (editable !== null) {
      let imagePath;

      if (editable?.images !== undefined && editable?.images?.length > 0) {
        imagePath = editable?.images[0].image;
      }

      setForAdultsOny(editable?.for_adults_only);

      setImageData({
        content: imagePath ?? '',
      });

      setPrice(getCurrency(editable.price));

      form.setFieldsValue({
        titlePtBr: editable.title['pt-br'],
        descriptionPtBr: editable.description['pt-br'],
        type: editable.type,
        price: getCurrency(editable.price),
        portion: editable.portion,
        tags: editable.tags !== undefined ? editable.tags?.map((tag: Tag) => tag.id) : [],
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable]);

  const handleDeleteProductImage = async () => {
    if (!editable) {
      setImageData(null);
      return;
    }

    try {
      const { status } = await api.delete(
        `/menu/v1/units/${unity !== null ? unity.id : ''}/items/${editable?.id}/images/${
          editable?.images !== undefined ? editable?.images[0].id : ''
        }`
      );

      if (status === 204) {
        setImageData(null);
      }
    } catch (error) {
      return;
    }
  };

  return (
    <Modal
      title={<Title level={3}>{editable ? 'Editar o item' : 'Adicionar novo item'}</Title>}
      open={!!isOpen}
      destroyOnClose
      centered
      footer={null}
      afterClose={closeModal}
      onCancel={closeModal}
    >
      <Form layout="vertical" onFinish={onFinish} onChange={() => setDisabled(false)} form={form}>
        <S.ImageWrapper>
          <S.ProductImageUpload
            imageSrc={typeof imageData !== 'string' ? imageData?.content : imageData}
            recommendedWidth={400}
            recommendedHeight={400}
            onDelete={() => handleDeleteProductImage()}
            onChangeCallback={(values: Base64Props) => handleImage(values, 'product_file_id')}
          />
        </S.ImageWrapper>
        <Form.Item rules={rules.titlePtBr} name={'titlePtBr'} label="Título">
          <Input size="large" />
        </Form.Item>
        <Form.Item name="descriptionPtBr" label="Descrição">
          <TextArea rows={5} />
        </Form.Item>
        <S.FormColum span="12">
          <Form.Item label="Preço" name="price">
            <CurrencyInput
              currency="BRL"
              value={price}
              config={currencyConfig}
              onChange={(_, value) => handlePriceChange(value ?? 0)}
            />
          </Form.Item>
        </S.FormColum>
        <Form.Item name="portion" label="Porção do prato para" initialValue={0}>
          <Select onChange={() => setDisabled(false)}>
            <Option value={0}>Não se aplica</Option>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((portion) => (
              <Option key={portion} value={portion}>
                {portion} pessoa{portion > 1 ? 's' : ''}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <S.SelectProductsWrapper>
          <Form.Item name="tags" label="Tags">
            <Select
              mode="multiple"
              optionFilterProp="children"
              onChange={() => setDisabled(false)}
              allowClear
              style={{ width: '100%', height: '100px' }}
            >
              {tags.map((tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.title['pt-br']}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </S.SelectProductsWrapper>
        <Space size={20}>
          <Row justify="space-between">
            <S.SwitchWrapper>
              <Space direction="horizontal">
                <Switch checked={forAdultsOnly} onChange={setForAdultsOny} />
                <span>Produto para maiores de 18 anos</span>
              </Space>
            </S.SwitchWrapper>
          </Row>
        </Space>
        <Row justify="end">
          <S.ProductActionButtonsWrapper>
            <Space direction="horizontal" size={5}>
              <Button htmlType="button" onClick={() => dispatch(ProductCreators.hideModal())} type="text">
                Cancelar
              </Button>

              <Button htmlType="submit" disabled={disabled} loading={saving}>
                Salvar
              </Button>
            </Space>
          </S.ProductActionButtonsWrapper>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewProductForm;

import { useEffect, useState } from 'react';
import { CloseO } from '@styled-icons/evil/CloseO';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Row, Switch } from 'antd';
import { Input, TextArea, CurrencyInput, Select } from 'src/stories/entry';
import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { Modal } from 'src/stories/feedback/Modal';
import { Add } from '@styled-icons/ionicons-outline/Add';
import Space from 'src/stories/utils/Space';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { Creators as OptionalCreators } from 'src/store/modules/optional/action';
import * as S from './styles';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import { Minus } from '@styled-icons/boxicons-regular/Minus';
import { Creators as ProductCreators } from 'src/store/modules/product/actions';
import { OptionItemProps } from 'src/store/modules/optional/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { getCurrency, notification } from 'src/utils/helpers';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

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

type SubmitValues = {
  type: number;
  titlePtBr: string;
  descriptionPtBr: string;
  items: Array<number>;
};

const NewCategoryForm = () => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);

  const [optionals, setOptionals] = useState<Array<OptionItemProps>>([]);
  const {
    product: { all },
    optional: { isOpen, loading, saving, editable },
  } = useSelector((state: RootType) => state);
  const [price, setPrice] = useState<number | undefined>(0);
  const [editingId, setEditingId] = useState<string | number | null>(null);

  const handleCloseModal = () => dispatch(OptionalCreators.hideModal());

  const rules = {
    title: [
      {
        required: true,
        message: 'O título do opcional é obrigatório',
      },
    ],
  };

  useEffect(() => {
    dispatch(ProductCreators.getProductsRequest());
  }, [dispatch]);

  const handleOptionChecked = (checked: boolean, index: number) => {
    setDisabled(false);
    setOptionals(
      optionals.map((option, i) => {
        if (i === index) {
          return {
            ...option,
            active: checked,
          };
        }

        return {
          ...option,
        };
      })
    );
  };

  useEffect(() => {
    setOptionals([]);
    form.resetFields();

    if (editable) {
      const { options } = editable;
      const item_id: string | number = '';
      let items: Array<string> = [];

      if (editable.options && editable.options.length > 0) {
        setPrice(getCurrency(editable.options[0].price));
      }

      if (editable.items) {
        items = editable.items.map((item: { item_id: string }) => item.item_id);
      }

      if (options) {
        setOptionals(
          options.map((option) => ({
            ...option,
            price: getCurrency(option.price),
          }))
        );

        setPrice(0);
      }

      form.setFieldsValue({
        ...editable,
        titlePtBr: editable.title['pt-br'],
        descriptionPtBr: editable.description['pt-br'],
        type: editable.type === 'single' ? 0 : 1,
        item_id,
        items,
      });
    }
  }, [editable, form]);

  const onFinish = (values: SubmitValues) => {
    const options = optionals.map((option) => {
      return {
        id: option.id,
        title: {
          'pt-br': option.title['pt-br'],
        },
        price: option.price * 100,
        active: option.active,
      };
    });

    const data = {
      title: {
        'pt-br': values.titlePtBr ?? editable?.title['pt-br'],
      },
      description: {
        'pt-br': values.descriptionPtBr ?? editable?.description['pt-br'] ?? '',
      },
      item_id: null,
      items: values.items
        ? values.items.map((item) => {
            if (editable && editable.items?.find((product) => product.item_id.toString() === item.toString())) {
              const product = editable.items?.find((product) => product.item_id.toString() === item.toString());
              return { id: product?.id, item_id: item };
            } else {
              return { item_id: item };
            }
          })
        : [],
      options,
    };

    if (options.length === 0) {
      notification.error('Não foi possível salvar o opcional.', 'Registre pelo menos uma opção.');

      return;
    }

    if (editable) {
      dispatch(
        OptionalCreators.editOptionalRequest({
          id: editable.id,
          ...data,
        })
      );
    } else {
      dispatch(OptionalCreators.createOptionalRequest(data));
    }
  };

  const resetForm = () => {
    setPrice(undefined);
    setEditingId(null);
    setOptionals([]);
    dispatch(OptionalCreators.resetEditableField());
    form.resetFields();
  };

  const handleCurrencyInput = (_?: InputEvent, value?: number) => {
    setPrice(value);
    setDisabled(false);
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (disabled) setDisabled(false);

    if (destination) {
      const newOrder = optionals;
      newOrder.splice(destination.index, 0, optionals.splice(source.index, 1)[0]);
      setOptionals(newOrder);
    }
  };

  const handleEditOptional = (index: number) => {
    setEditingId(index);

    const option = optionals[index];

    form.setFieldsValue({
      optionalNamePtBr: option.title['pt-br'],
    });

    setPrice(option.price);
  };

  const addOptional = () => {
    if (
      form.getFieldValue('optionalNamePtBr') === undefined ||
      form.getFieldValue('optionalNamePtBr').trim().length === 0
    ) {
      return document.getElementById('optionalNamePtBr')?.focus();
    }

    if (editingId === null) {
      setOptionals([
        ...optionals,
        {
          title: {
            'pt-br': form.getFieldValue('optionalNamePtBr'),
          },
          price: price ?? 0,
          active: true,
        },
      ]);
    } else {
      setOptionals(
        optionals.map((item, index) => {
          if (index === editingId) {
            return {
              id: item.id,
              title: {
                'pt-br': form.getFieldValue('optionalNamePtBr'),
              },
              price: price ?? 0,
              active: true,
            };
          }

          return item;
        })
      );

      setEditingId(null);
    }

    form.setFieldsValue({
      optionalNamePtBr: '',
    });

    setPrice(0);
  };

  const handleCloseOptionalEditing = () => {
    setEditingId(null);
    form.setFieldsValue({
      optionalNamePtBr: '',
    });
    setPrice(0);
  };

  const deleteOptional = (index: number) => setOptionals(optionals.filter((_, i) => i !== index));

  return (
    <Modal
      title={<Title level={3}>{editable ? 'Editar Opcional' : 'Adicionar Opcional'}</Title>}
      open={!!isOpen}
      width={1000}
      destroyOnClose
      centered
      afterClose={resetForm}
      footer={null}
      onCancel={handleCloseModal}
    >
      <Form layout="vertical" onFinish={onFinish} onChange={() => setDisabled(false)} form={form}>
        <Form.Item rules={rules.title} name={['titlePtBr']} label={'Título do opcional'}>
          <Input />
        </Form.Item>
        <Form.Item name={['descriptionPtBr']} label={'Descrição do opcional'}>
          <TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
        </Form.Item>
        <Title level={5}>Associar este opcional aos seguintes produtos:</Title>
        <S.SelectProductsWrapper>
          <Form.Item name="items">
            <Select
              mode="multiple"
              optionFilterProp="children"
              onChange={() => setDisabled(false)}
              allowClear
              style={{ width: '100%', height: '100px' }}
            >
              {all.map((product: { id?: string | number; title: { 'pt-br': string } }) => (
                <Option key={product.id} value={product.id!}>
                  {product.title['pt-br']}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </S.SelectProductsWrapper>
        <S.OptionsTitleWrapper>
          <Title level={4}>Lista de opções</Title>
        </S.OptionsTitleWrapper>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="optionals">
            {(provided) => (
              <S.MultipleOptionalsWrapper {...provided.droppableProps} ref={provided.innerRef}>
                {optionals.length ? (
                  optionals.map((optional, index) => (
                    <Draggable key={index} draggableId={String(index)} isDragDisabled={!!editingId} index={index}>
                      {(provided) => (
                        <S.OptionalCardWrapper
                          editing={index === editingId}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          key={index}
                        >
                          <Space direction="horizontal" size={10}>
                            <S.DragIconWrapperOptionals {...provided.dragHandleProps}>
                              <DragIndicator size={25} />
                            </S.DragIconWrapperOptionals>
                            <Switch checked={optional.active} onChange={(check) => handleOptionChecked(check, index)} />
                            <Title level={6}>
                              {(optional.title || null) !== null ? <>{optional.title['pt-br']} </> : ''}
                              {`${
                                optional.price > 0
                                  ? `- ${optional.price.toLocaleString('pt-br', {
                                      style: 'currency',
                                      currency: 'BRL',
                                    })}`
                                  : ''
                              }`}
                            </Title>
                          </Space>
                          <Space fullWidth={false} direction="horizontal" size={15}>
                            <span style={{ cursor: 'pointer' }}>
                              <Pencil onClick={() => handleEditOptional(index)} size={25} />
                            </span>
                            <Button
                              htmlType="button"
                              icon={<Minus size={25} />}
                              onClick={() => deleteOptional(index)}
                            />
                          </Space>
                        </S.OptionalCardWrapper>
                      )}
                    </Draggable>
                  ))
                ) : !optionals.length && loading ? (
                  <>
                    <S.CustomSkeletonOptionals active />
                    <S.CustomSkeletonOptionals active />
                    <S.CustomSkeletonOptionals active />
                    <S.CustomSkeletonOptionals active />
                  </>
                ) : (
                  <Row justify="center">
                    <Title level={4}>Nenhum opcional registrado.</Title>
                  </Row>
                )}
                {provided.placeholder}
              </S.MultipleOptionalsWrapper>
            )}
          </Droppable>
        </DragDropContext>
        {editingId === null ? (
          <S.NewOptionalWrapper>
            <Title level={4}>Adicionar opção</Title>
            <S.NameOptionalInputWrapper>
              <Form.Item name="optionalNamePtBr">
                <Input placeholder="Nome do opcional" id="optionalNamePtBr" />
              </Form.Item>
            </S.NameOptionalInputWrapper>
            <div className="footer">
              <S.PriceOptionalInputWrapper>
                <Form.Item>
                  <CurrencyInput value={price} currency="BRL" config={currencyConfig} onChange={handleCurrencyInput} />
                </Form.Item>
              </S.PriceOptionalInputWrapper>
              <Button htmlType="button" icon={<Add size={25} />} onClick={() => addOptional()} />
            </div>
          </S.NewOptionalWrapper>
        ) : (
          <S.NewOptionalWrapper editing={editingId !== null}>
            <Title level={4} icon={<CloseO size={25} onClick={handleCloseOptionalEditing} />}>
              Editar opção
            </Title>
            <S.TabListContentEditOptional>
              <S.NameOptionalInputWrapper>
                <Form.Item name="optionalNamePtBr">
                  <Input placeholder="Nome do opcional" id="optionalNamePtBr" />
                </Form.Item>
              </S.NameOptionalInputWrapper>
            </S.TabListContentEditOptional>
            <div className="footer">
              <S.PriceOptionalInputWrapper>
                <Form.Item>
                  <CurrencyInput value={price} currency="BRL" config={currencyConfig} onChange={handleCurrencyInput} />
                </Form.Item>
              </S.PriceOptionalInputWrapper>
              <S.AddOptional type="primary" htmlType="button" onClick={() => addOptional()}>
                <Add size={25} />
              </S.AddOptional>
            </div>
          </S.NewOptionalWrapper>
        )}
        <Row justify="end">
          <Space fullWidth={false} direction="horizontal" size={5}>
            <Button htmlType="button" onClick={() => dispatch(OptionalCreators.hideModal())} type="text">
              Cancelar
            </Button>

            <Button htmlType="submit" disabled={disabled || !!editingId} loading={saving}>
              Salvar
            </Button>
          </Space>
        </Row>
      </Form>
    </Modal>
  );
};

export default NewCategoryForm;

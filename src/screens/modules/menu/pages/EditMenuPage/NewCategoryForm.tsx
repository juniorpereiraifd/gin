import { Col, Form, List, Row } from 'antd';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Creators as CategoryCreators } from 'src/store/modules/category/actions';
import type { CategoryItemProps, CreateCategoryItemProps } from 'src/store/modules/category/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Input } from 'src/stories/entry';
import Loading from 'src/stories/feedback/Loading';
import { Modal } from 'src/stories/feedback/Modal';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import * as S from './styles';
import { notification } from 'src/utils/helpers';

const rules = {
  titlePtBr: [
    {
      required: true,
      message: 'O nome em português da categoria é obrigatório',
    },
  ],
  menuId: [
    {
      required: true,
      message: 'O nome da categoria é obrigatório',
    },
  ],
};

type FormValues = Omit<CreateCategoryItemProps, 'title'> & {
  titlePtBr: string;
};

type NewCategoryFormProps = {
  menuId: string;
};

const NewCategoryForm: FunctionComponent<NewCategoryFormProps> = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [showProducts, setShowProducts] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryItemProps | null>();

  const handleCloseModal = () => dispatch(CategoryCreators.hideModal());

  const {
    category: { isOpen, saving },
    product: { allProducts, allProductsLoading },
  } = useSelector((state: RootType) => state);

  const onFinish = (values: FormValues) => {
    if ((values.titlePtBr || null) === null) {
      return notification.error('O nome em português da categoria é obrigatório', '');
    }

    const data = {
      title: {
        'pt-br': values.titlePtBr,
      },
      active: true,
    };

    dispatch(CategoryCreators.createCategoryRequest(data));
    handleCloseModal();
    form.resetFields();
    setShowProducts(false);
  };

  const resetForm = () => {
    form.resetFields();
    setShowProducts(false);
    setCurrentCategory(null);
  };

  useEffect(() => {
    if (!saving) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving]);

  return (
    <Modal open={!!isOpen} destroyOnClose centered footer={null} afterClose={resetForm} onCancel={handleCloseModal}>
      <Row>
        <S.CategoryModalWrapper>
          <Col>
            <S.FormWrapper>
              <Title level={3}>Adicionar Categoria</Title>
              <Form layout="vertical" onFinish={onFinish} onChange={() => setDisabled(false)} form={form}>
                <Form.Item rules={rules.titlePtBr} name={['titlePtBr']} label="Nome da Categoria">
                  <Input />
                </Form.Item>
                <Row align="middle" justify="center">
                  <Button htmlType="submit" disabled={disabled} loading={saving}>
                    Criar Categoria
                  </Button>
                </Row>
              </Form>
            </S.FormWrapper>
          </Col>

          {showProducts && (
            <S.ProductColumnWrapper>
              <Row>
                <Title level={3}>
                  Itens na categoria &quot;{currentCategory?.title['pt-br']}
                  &quot;
                </Title>
              </Row>

              <S.ListProductsWrapper>
                {allProductsLoading ? (
                  <S.LoadProductsContainer>
                    <Loading />
                  </S.LoadProductsContainer>
                ) : (
                  <List
                    dataSource={allProducts}
                    renderItem={(item) => (
                      <S.ProductListItemWrapper>
                        <Title level={5}>{item.title['pt-br']}</Title>
                      </S.ProductListItemWrapper>
                    )}
                  />
                )}
              </S.ListProductsWrapper>
            </S.ProductColumnWrapper>
          )}
        </S.CategoryModalWrapper>
      </Row>
    </Modal>
  );
};

export default NewCategoryForm;

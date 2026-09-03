/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Add } from '@styled-icons/ionicons-outline/Add';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { PriceTag3 } from '@styled-icons/remix-line/PriceTag3';
import { Col, Form, Row, Skeleton, Switch } from 'antd';
import NewProductForm from './NewProductForm';
import { FunctionComponent, useCallback, useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import InfiniteScroll from 'react-infinite-scroller';
import { useDispatch, useSelector } from 'react-redux';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Creators as CategoryCreators } from 'src/store/modules/category/actions';
import type { CategoryItemProps } from 'src/store/modules/category/reducer';
import { Creators as ProductCreators } from 'src/store/modules/product/actions';
import type { ProductItemProps } from 'src/store/modules/product/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import ListItem from 'src/stories/display/ListItem';
import ProductList from 'src/stories/display/ProductList';
import { Input } from 'src/stories/entry';
import Loading from 'src/stories/feedback/Loading';
import Popconfirm from 'src/stories/feedback/Popconfirm';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import Small from 'src/stories/typography/Small';
import Space from 'src/stories/utils/Space';
import { Modal } from 'src/stories/feedback/Modal';
import { notification } from 'src/utils/helpers';
import NewCategoryForm from './NewCategoryForm';
import * as S from './styles';
import { useUpdateEffect } from 'react-use';
import { BoxContrasted } from 'src/components/BoxContrasted';

const rules = {
  titlePtBr: [
    {
      required: true,
      message: 'O nome da categoria é obrigatório',
    },
  ],
};

type FormValues = Omit<CategoryItemProps, 'title'> & {
  titlePtBr: string;
};

type EditMenuTabProps = {
  menuId: string;
};

const EditMenuTab: FunctionComponent<EditMenuTabProps> = (props) => {
  const { menuId } = props;
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [firstLoadProduct, setFirstLoadProduct] = useState(true);
  const [pageStart, setPageStart] = useState(1);
  const [productsList, setProductsList] = useState<Array<ProductItemProps>>([]);
  const [resetList, setResetList] = useState(true);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [visible, setVisible] = useState(false);

  const [categoriesList, setCategoriesList] = useState<Array<CategoryItemProps>>([]);

  const {
    menu: { selectedMenuItem },
    category: { loading, saving, data: categories, onDeleting, currentCategory, editable: categoryEditable },
    product: { loading: productLoading, hasMore, data: products, pagination, isOpen },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (loading) {
      setIsFirstFetch(false);
    }
  }, [loading]);

  useEffect(() => {
    if (productLoading) {
      setInitialLoading(false);
    }
  }, [products, productLoading]);

  useEffect(() => {
    if (productLoading) {
      setResetList(true);
    } else setResetList(false);
  }, [productLoading, pagination]);

  const handleInfiniteOnLoad = (page: number) => {
    if (pagination?.is_last_page) {
      dispatch(ProductCreators.loadedAllProducts());
      notification.success('Todos os produtos foram carregados!', '');
      return;
    }

    setIsLoadMore(true);
    dispatch(
      ProductCreators.getProductsFromCategory({
        category_id: currentCategory?.id,
        page,
      })
    );
  };

  useEffect(() => {
    if (!currentCategory && categories.length !== 0) {
      dispatch(CategoryCreators.setCurrentCategory(categories[0]));
    }
  }, [categories, currentCategory, dispatch]);

  useEffect(() => {
    dispatch(CategoryCreators.setCurrentCategory(currentCategory));
    if (unity && currentCategory && firstLoadProduct) {
      setFirstLoadProduct(false);
      dispatch(
        ProductCreators.getProductsFromCategory({
          category_id: currentCategory?.id,
          page: 1,
        })
      );
    }

    if (!currentCategory) {
      setInitialLoading(false);
    }
  }, [currentCategory, unity, dispatch, firstLoadProduct]);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(CategoryCreators.setCurrentCategory(null));
    }

    if (currentCategory)
      dispatch(
        CategoryCreators.setCurrentCategory(categories[categories.findIndex((item) => item.id === currentCategory?.id)])
      );
  }, [categories, currentCategory, dispatch]);

  useEffect(() => {
    setCategoriesList(categories);
  }, [categories]);

  useEffect(() => {
    if (products.length) setIsLoadMore(true);
    setResetList(true);
    setProductsList((oldProducts) => (pagination?.current_page === 1 ? products : [...oldProducts, ...products]));
  }, [products, pagination]);

  useEffect(() => {
    if (unity) {
      dispatch(CategoryCreators.getCategoriesRequest(menuId));
      dispatch(MenuCreators.getMenusTagsRequest());
    }
  }, [dispatch, unity, menuId]);

  const reorder = (list: Array<CategoryItemProps>, startIndex: number, endIndex: number, droppableId: string) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    if (droppableId === 'categories') {
      dispatch(
        CategoryCreators.reorderCategoryRequest({
          category_id: removed.id,
          old_position: startIndex,
          new_position: endIndex,
        })
      );
    } else {
      dispatch(
        ProductCreators.reorderProductsRequest({
          item_id: removed.id,
          old_position: startIndex,
          new_position: endIndex,
        })
      );
    }

    return result;
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (source.droppableId === 'categories') {
      const newCategoriesOrder = reorder(categoriesList, source.index, destination.index, source.droppableId);
      setCategoriesList(newCategoriesOrder);
    } else {
      const newProductsOrder = reorder(
        //@ts-ignore
        productsList,
        source.index,
        destination.index,
        source.droppableId
      );

      //@ts-ignore
      setProductsList(newProductsOrder);
    }
  };

  const handleCategoryClick = (values: CategoryItemProps) => {
    setInitialLoading(true);
    setIsLoadMore(false);
    setResetList(false);
    setPageStart(1);
    dispatch(ProductCreators.resetProductsFromCategory());
    dispatch(
      ProductCreators.getProductsFromCategory({
        category_id: values?.id,
        page: 1,
      })
    );

    if (values) {
      form.setFieldsValue({ title: values.title });
      // dispatch(CategoryCreators.editCategoryRequest(values));
      dispatch(CategoryCreators.setCurrentCategory(values));
    }
  };

  const onFinish = (values: FormValues) => {
    if (currentCategory) {
      const category = {
        ...currentCategory,
        title: {
          'pt-br': values.titlePtBr ?? currentCategory.title['pt-br'],
        },
      };

      dispatch(
        CategoryCreators.editCategoryRequest({
          category: category,
        })
      );
    }
  };

  useUpdateEffect(() => {
    if (!saving) setVisible(false);
  }, [saving]);

  const handleDeleteCategory = () => {
    if (currentCategory) {
      dispatch(CategoryCreators.deleteCategoryRequest(currentCategory.id));
      dispatch(ProductCreators.resetProductsFromCategory());

      if (categories.length > 1) {
        const nextCategory = categories.findIndex((category) => category.id !== currentCategory.id);
        dispatch(CategoryCreators.setCurrentCategory(categories[nextCategory]));
        dispatch(
          ProductCreators.getProductsFromCategory({
            category_id: categories[nextCategory]?.id,
            page: 1,
          })
        );
      }
    }
  };

  const handleEditItemFields = () => {
    setVisible(true);
    form.setFieldsValue({
      titlePtBr: currentCategory?.title['pt-br'],
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      titlePtBr: categoryEditable?.title['pt-br'],
    });
  }, [categoryEditable]);

  const handleActiveInCategory = (value: boolean, category: CategoryItemProps) => {
    const newCategoryStatus = {
      ...category,
      active: value,
    };

    dispatch(
      CategoryCreators.editCategoryRequest({
        category: newCategoryStatus,
      })
    );
  };

  const handleAddItem = () => {
    dispatch(ProductCreators.showModal());
  };

  useEffect(() => {
    if (selectedMenuItem) {
      dispatch(ProductCreators.getProductRequest(selectedMenuItem.id));

      if (!isOpen) dispatch(ProductCreators.showModal());
    }
  }, [selectedMenuItem, products, isOpen]);

  const resetForm = useCallback(() => {
    form.resetFields();
    setVisible(false);
    setDisabled(true);
  }, [form]);

  return (
    <BoxContrasted>
      <NewProductForm />
      <NewCategoryForm menuId={menuId} />
      <Row gutter={[24, 0]}>
        <S.CategoryColumn lg={6} xl={6} xxl={5}>
          <S.CategorySection>
            <S.CategorySectionTitle>
              <PriceTag3 size={20} />
              <span className="category-title">Categorias</span>
            </S.CategorySectionTitle>
            <S.CreateCategoryButtonWrapper>
              <Button onClick={() => dispatch(CategoryCreators.showModal())} icon={<Add size={20} />}>
                Nova Categoria
              </Button>
            </S.CreateCategoryButtonWrapper>
            {loading || isFirstFetch ? (
              <Row justify="center">
                <Loading />
              </Row>
            ) : categories.length !== 0 && !loading ? (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <S.DroppableAreaContainer {...provided.droppableProps} ref={provided.innerRef}>
                      {categoriesList.map((category: CategoryItemProps, index) => {
                        return (
                          <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                            {(provided) => (
                              <ListItem
                                innerRef={provided.innerRef}
                                {...provided.draggableProps}
                                key={category.id}
                                padding="none"
                                removeShadow
                                noActions
                                marginBottom={1.5}
                                leftText={
                                  <S.ListItemContentWrapper title={category.title['pt-br']}>
                                    <S.ListItemContentBox>
                                      <S.LeftCategoryItems>
                                        <S.DragIconWrapper {...provided.dragHandleProps}>
                                          <DragIndicator size={20} />
                                        </S.DragIconWrapper>
                                        <S.CategoryTitle onClick={() => handleCategoryClick(category)}>
                                          {category.title['pt-br'] || '---'}
                                        </S.CategoryTitle>
                                      </S.LeftCategoryItems>
                                      <S.SwitchCategoryWrapper>
                                        <Switch
                                          size="small"
                                          loading={saving}
                                          checked={category.active}
                                          onChange={(value) => handleActiveInCategory(value, category)}
                                        />
                                      </S.SwitchCategoryWrapper>
                                    </S.ListItemContentBox>
                                  </S.ListItemContentWrapper>
                                }
                              />
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </S.DroppableAreaContainer>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <S.EmptyCategoriesMessageWrapper>
                <Small>Nenhuma categoria cadastrada</Small>
              </S.EmptyCategoriesMessageWrapper>
            )}
          </S.CategorySection>
        </S.CategoryColumn>
        <Col lg={18} xl={18} xxl={19}>
          <Space size={40} direction="vertical">
            <S.MainHeader>
              {currentCategory ? (
                <Row align="middle" justify="space-between" gutter={[5, 0]}>
                  <div>
                    <Space size={2}>
                      <Title level={2}>{currentCategory.title['pt-br']}</Title>

                      <S.SmallText color="lightSecondary" onClick={handleEditItemFields}>
                        Editar ou Excluir
                      </S.SmallText>
                    </Space>
                  </div>
                  <Modal
                    title={<Title level={3}>Editar ou Excluir</Title>}
                    open={visible}
                    centered
                    afterClose={resetForm}
                    footer={null}
                    width="25%"
                    onCancel={() => setVisible(false)}
                  >
                    <Form
                      layout="vertical"
                      onFinish={onFinish}
                      onChange={() => setDisabled(false)}
                      initialValues={{
                        title: currentCategory?.title['pt-br'],
                      }}
                      form={form}
                    >
                      <Row>
                        <Col xl={24} sm={24} md={12}>
                          <Form.Item rules={rules.titlePtBr} name={'titlePtBr'}>
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row align="middle" justify="space-between">
                        <Form.Item>
                          <Popconfirm
                            title="Tem certeza de que deseja excluir esta categoria?"
                            okText="Confirmar"
                            cancelText="Cancelar"
                            onConfirm={handleDeleteCategory}
                            placement="top"
                          >
                            <Button loading={onDeleting} htmlType="button" color="danger">
                              Excluir Categoria
                            </Button>
                          </Popconfirm>
                        </Form.Item>
                        <Form.Item>
                          <Button htmlType="submit" disabled={disabled} loading={saving}>
                            Salvar
                          </Button>
                        </Form.Item>
                      </Row>
                    </Form>
                  </Modal>
                </Row>
              ) : !currentCategory && !loading ? (
                <Row />
              ) : (
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space size={10} direction="horizontal">
                      <Skeleton.Input active style={{ width: 200 }} />
                      <Skeleton.Button active />
                    </Space>
                  </Col>
                  <Col>
                    <Skeleton.Input active style={{ width: 100 }} />
                  </Col>
                </Row>
              )}
            </S.MainHeader>

            <Row>
              <S.ProductContainer>
                <S.ProductHeader>
                  <Row justify="space-between" align="middle">
                    {initialLoading && !productLoading ? (
                      <Skeleton.Button active />
                    ) : (
                      <S.SmallText noUnderline noPointer>
                        Mostrando {productsList.length} de {pagination ? pagination?.total : 0} Itens
                      </S.SmallText>
                    )}

                    <Button onClick={handleAddItem} icon={<Add size={20} />}>
                      Adicionar item
                    </Button>
                  </Row>
                </S.ProductHeader>
                <S.ProductContentWrapper>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="products">
                      {(provided) => (
                        <S.DroppableAreaContainer {...provided.droppableProps} ref={provided.innerRef}>
                          {resetList && (
                            <InfiniteScroll
                              initialLoad={false}
                              pageStart={pageStart}
                              loadMore={(page) => handleInfiniteOnLoad(page)}
                              hasMore={hasMore && !productLoading}
                              useWindow={false}
                            >
                              {(products || null) !== null && products.length > 0 ? (
                                productsList.map((product: ProductItemProps, index) => {
                                  return (
                                    <Draggable
                                      key={product.id}
                                      draggableId={(product?.id ?? '').toString()}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <ProductList
                                          product={product}
                                          dragHandleProps={provided.dragHandleProps}
                                          {...provided.draggableProps}
                                          innerRef={provided.innerRef}
                                          key={product.id}
                                          title={product.title['pt-br']}
                                          description={product.description['pt-br']}
                                          optionals={product.optionals}
                                          price={product.price / 100}
                                          imageUrl={product.images && product.images[0] && product.images[0].image}
                                          onEdit={() => {
                                            dispatch(ProductCreators.getProductRequest(product.item_id));
                                            dispatch(ProductCreators.showModal());
                                            dispatch(MenuCreators.getMenusTagsRequest());
                                          }}
                                          onDelete={() => dispatch(ProductCreators.deleteProductRequest(product.id))}
                                        />
                                      )}
                                    </Draggable>
                                  );
                                })
                              ) : (productLoading || initialLoading) && products.length === 0 ? (
                                <>
                                  <Skeleton active />
                                  <Skeleton active />
                                  <Skeleton active />
                                </>
                              ) : (
                                <Row justify="center">
                                  <S.NoProductsWrapper>
                                    <span>Não há itens</span>
                                  </S.NoProductsWrapper>
                                </Row>
                              )}
                              {productLoading && hasMore && isLoadMore && (
                                <S.LoadingProductContainer>
                                  <Loading />
                                </S.LoadingProductContainer>
                              )}
                              {provided.placeholder}
                            </InfiniteScroll>
                          )}
                        </S.DroppableAreaContainer>
                      )}
                    </Droppable>
                  </DragDropContext>
                </S.ProductContentWrapper>
              </S.ProductContainer>
            </Row>
          </Space>
        </Col>
      </Row>
    </BoxContrasted>
  );
};

export default EditMenuTab;

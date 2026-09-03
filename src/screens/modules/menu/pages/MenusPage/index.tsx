import { Link2Outline } from '@styled-icons/evaicons-outline/Link2Outline';
import { Copy } from '@styled-icons/feather/Copy';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { App, Avatar, Col, Form, Input, List, Popover, Row, Switch, Tabs as AntdTabs, Tooltip } from 'antd';
import debounce from 'lodash/debounce';
import { Key, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import api from 'src/services/api';
import { Creators as AuthCreators } from 'src/store/modules/auth/actions';
import { Creators as CategoryCreators } from 'src/store/modules/category/actions';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { MenuCreators } from 'src/store/modules/menu/actions';
import type { ItemFromMenu, MenuItemProps } from 'src/store/modules/menu/reducer';
import { Creators as ProductCreators } from 'src/store/modules/product/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { DraggableTable, OnDragEndProps } from 'src/stories/display/DraggableTable';
import { Tabs } from 'src/stories/display/Tabs';
import { Modal } from 'src/stories/feedback/Modal';
import { Title } from 'src/stories/typography';
import { notification } from 'src/utils/helpers';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import ImageUpload, { type Base64Props } from 'src/stories/entry/ImageUpload';
import { LinkedUnitsDrawer, type LinkedUnit } from 'src/screens/components/LinkedUnitsDrawer';
import { BookOpen, Download, Loader2, QrCode, Search, Share2, Unlink } from 'lucide-react';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Button } from 'src/stories/general/Button';

const { TabPane } = AntdTabs;

type MenuTableItem = MenuItemProps & { key: string };

type ImageDataProps = {
  name: string;
  content: string;
};

export type MenuFormProps = {
  title: string;
};

const rules = {
  name: [
    {
      required: true,
      message: 'O nome do cardápio é obrigatório',
    },
  ],
};

type FormValues = Omit<MenuItemProps, 'title'> & {
  titlePtBr: string;
};

export const MenusPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { modal } = App.useApp();

  const {
    menu: { loading, saving, data: menus, filteredMenuItems },
    hall: { unity },
    auth: { user, adminDetails },
  } = useSelector((state: RootType) => state);

  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);

  const [menusList, setMenusList] = useState<Array<MenuItemProps>>([]);
  const [isFirstFetch, setIsFirstFetch] = useState(true);
  const [editable, setEditable] = useState<MenuItemProps | null>(null);
  const [loadingQrCode, setLoadingQrCode] = useState(false);
  const [loadingDisplay, setLoadingDisplay] = useState(false);
  const [searchedMenuItem, setSearchedMenuItem] = useState<string>('');
  const [showSearchedMenuItems, setShowSearchedMenuItems] = useState<boolean>(false);
  const [imageData, setImageData] = useState<ImageDataProps | null>(null);
  const [linkedUnitsDrawerOpen, setLinkedUnitsDrawerOpen] = useState(false);
  const [selectedMenuForUnits, setSelectedMenuForUnits] = useState<MenuItemProps | null>(null);

  const searchWrapperRef = useRef<HTMLDivElement>(null);

  const searchMenuItemsDebounced = useMemo(
    () =>
      debounce((menuItem: string) => {
        return dispatch(MenuCreators.getFilteredMenuItemsRequest({ menuItem }));
      }, 500),
    [dispatch],
  );

  const resetSearchedMenuItems = () => {
    setShowSearchedMenuItems(false);
    dispatch(MenuCreators.resetFilteredMenuItems());
  };

  const redirectToEditSelectedMenuItem = (item: ItemFromMenu) => {
    if (!item.menu.length) {
      notification.warning(
        'Este item não está vinculado há um cardápio!',
        'É necessário estar vinculado há um cardápio para poder visualizá-lo/alterá-lo.',
      );
      return;
    }
    dispatch(MenuCreators.setSelectedMenuItem(item));
    navigate(`/units/${unity?.id}/menus/${item.menu[0].id}/edit`);
  };

  useEffect(() => {
    if (searchedMenuItem.length >= 3 && !filteredMenuItems.length) searchMenuItemsDebounced(searchedMenuItem);
  }, [searchedMenuItem]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!!filteredMenuItems.length && searchedMenuItem.length >= 3) setShowSearchedMenuItems(true);
  }, [filteredMenuItems.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showSearchedMenuItems) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target as Node)) {
        resetSearchedMenuItems();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchedMenuItems]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (loading) setIsFirstFetch(false);
  }, [loading]);

  useEffect(() => {
    setMenusList(menus);
  }, [menus]);

  useEffect(() => {
    if (unity) {
      dispatch(MenuCreators.getMenusRequest());
      dispatch(MenuCreators.getMenusTagsRequest());
    }
  }, [dispatch, unity]);

  useEffect(() => {
    if (unity?.id && user && user.master !== true) {
      dispatch(AuthCreators.getAdminDetailsRequest({ unitId: unity.id }));
    }
  }, [dispatch, unity?.id, user?.id, user?.master]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = useCallback(() => {
    setEditable(null);
    form.resetFields();
    setVisible(false);
    setImageData(null);
  }, [form]);

  useEffect(() => {
    if (!saving) {
      resetForm();
    }
  }, [saving, resetForm]);

  const onFinish = (values: FormValues) => {
    if (editable) {
      const { icon, ...restEditable } = editable;

      const editedMenuData = {
        ...restEditable,
        title: {
          'pt-br': values.titlePtBr ?? editable.title['pt-br'],
        },
      };

      if (
        (imageData?.content !== undefined && imageData?.content !== '' && imageData.name !== '') ||
        imageData === null
      ) {
        Object.defineProperty(editedMenuData, 'icon', {
          value: imageData,
          enumerable: true,
        });
      }

      dispatch(MenuCreators.editMenuRequest({ menu: editedMenuData }));
    } else {
      const valuesFormatted = {
        title: {
          'pt-br': values.titlePtBr,
        },
        icon: imageData,
      };

      dispatch(MenuCreators.createMenuRequest({ menu: valuesFormatted }));
    }
  };

  const handleDragEnd = ({ to, movedItem, updatedList }: OnDragEndProps<MenuTableItem>) => {
    const oldPosition = menusList.findIndex((menu) => menu.id === movedItem.id);

    if (oldPosition === -1 || oldPosition === to) {
      return;
    }

    dispatch(
      MenuCreators.reorderMenuRequest({
        id: movedItem.id,
        old_position: oldPosition,
        new_position: to,
      }),
    );

    setMenusList(updatedList);
  };

  const handleEditMenu = (id: Key) => {
    dispatch(ProductCreators.resetProductsFromCategory());
    dispatch(CategoryCreators.getCategoriesRequest(id));
    dispatch(CategoryCreators.setCurrentCategory(null));
    navigate(`/units/${unity?.id}/menus/${id}/edit`);
  };

  const setEditableMenu = (menu: MenuItemProps) => {
    setEditable(menu);
    setVisible(true);
  };

  useEffect(() => {
    if (editable) {
      if (editable?.icon !== undefined) {
        setImageData({
          content: editable?.icon,
          name: '',
        });
      }

      form.setFieldsValue({
        titlePtBr: editable.title['pt-br'],
      });
    }
  }, [visible, editable, form]);

  const generateQrCodes = async () => {
    setLoadingQrCode(true);

    try {
      const { data: response, status } = await api.get(`menu/v1/units/${unity?.id}/downloads/qrcodes?from=1&to=1`, {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/zip',
        },
      });

      if (status === 200) {
        const blob = new Blob([response], {
          type: 'application/zip',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${unity?.name}.zip`;
        link.click();
        link.remove();
      }
    } catch (error) {
      notification.error('Erro ao gerar Qr Codes!', 'Excedeu o limite máximo de 120 QRCodes gerados por vez.');
    }

    setLoadingQrCode(false);
  };

  const generateDisplay = async () => {
    setLoadingDisplay(true);

    try {
      const { data: response, status } = await api.get(`menu/v1/units/${unity?.id}/downloads/displays?from=1&to=1`, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
      });

      if (status === 200) {
        const blob = new Blob([response], {
          type: 'application/pdf',
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${unity?.name}.pdf`;
        link.click();
        link.remove();
      }
    } catch (error) {
      notification.error('Erro ao gerar Display!', 'Excedeu o limite máximo de 120 Displays gerados por vez.');
    }

    setLoadingDisplay(false);
  };
  const handleImage = (values: Base64Props) => {
    const extension = values.name.split('.').pop();

    const allowedExtensions = ['png', 'jpeg', 'jpg'];

    if (!allowedExtensions.find((item) => item === extension)) {
      notification.warning(
        'O formato da imagem inserida não é suportado!',
        'Somente os formatos png, jpeg e jpg são suportados!',
      );
      setDisabled(true);
      return;
    }

    setImageData({ ...values });
  };

  const handleCopyLinkShare = async () => {
    try {
      await navigator.clipboard.writeText(`${import.meta.env.VITE_MENU_BASE_URL}/pt-br/${unity?.id}`);
      notification.success('Sucesso', 'O link do cardápio foi copiado com sucesso!');
    } catch (error) {
      notification.error('Houve um erro ao copiar o link', 'Atualize a página e tente novamente!');
    }
  };

  const handleCopyHashId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      notification.success('Sucesso', 'O Hash ID foi copiado com sucesso!');
    } catch (error) {
      notification.error('Houve um erro ao copiar o Hash ID', 'Atualize a página e tente novamente!');
    }
  };

  const canAccessOwnerUnit = (menu: MenuItemProps) =>
    user?.master === true || (adminDetails?.units ?? []).some((unit) => String(unit.id) === String(menu.unit_id));

  const confirmRedirectToOwnerUnit = (menu: MenuItemProps) => {
    modal.confirm({
      title: 'Redirecionar para outra unidade',
      content:
        'Este cardápio pertence a outra unidade. Você será redirecionado para a unidade dona do cardápio para acessá-lo.',
      okText: 'Continuar',
      cancelText: 'Cancelar',
      onOk: () => {
        dispatch(HallCreators.resetHall());
        navigate(`/units/${menu.unit_id}/menus/${menu.id}/edit`);
      },
    });
  };

  const confirmUnlinkUnit = (menu: MenuItemProps) => {
    modal.confirm({
      title: 'Desvincular cardápio',
      content:
        'Tem certeza que deseja desvincular este cardápio da unidade atual? Ele deixará de aparecer na listagem desta unidade.',
      okText: 'Desvincular',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: () => dispatch(MenuCreators.unlinkMenuUnitRequest({ menuId: menu.id })),
    });
  };

  return (
    <PageContainer sideColumn>
      <PageTitle>Cardápios</PageTitle>

      <DraggableTable<MenuTableItem>
        bordered
        loading={loading || isFirstFetch}
        className="shadow-sm row-start-2 col-start-1 [&_.ant-pagination]:px-4 h-fit"
        pagination={false}
        locale={{
          emptyText: (
            <div className="p-4">
              <span className="text-gray-500 text-sm font-normal">Nenhum cárdapio encontrado</span>
            </div>
          ),
        }}
        onDragEnd={handleDragEnd}
        isDraggable={(menu) => menu.unit_id === unity?.id}
        data={menusList.map((menu) => ({ key: menu.id, ...menu }))}
        title={() => (
          <div className="w-full flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div ref={searchWrapperRef} className="relative">
                <Popover
                  open={showSearchedMenuItems}
                  trigger={[]}
                  placement="bottomLeft"
                  arrow={false}
                  getPopupContainer={(node) => node.parentElement ?? document.body}
                  overlayInnerStyle={{ padding: 4 }}
                  content={
                    <List
                      className="w-96 max-w-[80vw] max-h-72 overflow-y-auto"
                      dataSource={filteredMenuItems}
                      renderItem={(item) => (
                        <List.Item
                          className="!px-2 !py-2 rounded-md cursor-pointer transition-colors hover:bg-gray-50"
                          onClick={() => redirectToEditSelectedMenuItem(item)}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                shape="square"
                                size={40}
                                src={item.images[0]?.image}
                                alt={`${item.title['pt-br']} ${item.description}`}
                              />
                            }
                            title={<span className="text-sm font-semibold">{item.title['pt-br']}</span>}
                            description={
                              <span className="flex items-center gap-2 text-xs">
                                <BookOpen size={14} className="shrink-0" />
                                {`${item.menu[0]?.title['pt-br']} > ${item.categories.map(
                                  (category) => category.title['pt-br'],
                                )}`}
                              </span>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  }
                >
                  <div className="max-w-md">
                    <Input
                      value={searchedMenuItem}
                      onChange={({ target: { value } }) => {
                        setSearchedMenuItem(value.trim());
                        if (value.length < 3) resetSearchedMenuItems();
                      }}
                      prefix={<Search size={14} />}
                      placeholder="Buscar item"
                    />
                  </div>
                </Popover>
              </div>

              {saving && (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin text-gray-500" size={14} />{' '}
                  <span className="text-xs whitespace-nowrap text-gray-500">Salvando</span>
                </div>
              )}
            </div>

            <Button icon={<Add size={20} />} onClick={() => setVisible(true)}>
              Adicionar cardápio
            </Button>
          </div>
        )}
        actions={{
          custom: [
            {
              key: 'link-units',
              content: (
                <span className="flex items-center gap-2">
                  <Link2Outline size={14} /> Vincular unidades
                </span>
              ),
              onClick: (menu) => {
                setSelectedMenuForUnits(menu);
                setLinkedUnitsDrawerOpen(true);
              },
              isVisible: (menu) => menu.unit_id === unity?.id,
            },
            {
              key: 'unlink-unit',
              content: (
                <span className="flex items-center gap-2">
                  <Unlink size={14} /> Desvincular unidade
                </span>
              ),
              onClick: (menu) => confirmUnlinkUnit(menu),
              isVisible: (menu) => menu.unit_id !== unity?.id && canAccessOwnerUnit(menu),
            },
          ],
          edit: {
            onClick: (menu) => setEditableMenu(menu),
            isVisible: (menu) => menu.unit_id === unity?.id,
          },
          delete: {
            onClick: (menu) => dispatch(MenuCreators.deleteMenuRequest(menu.id)),
            isVisible: (menu) => menu.unit_id === unity?.id,
          },
          isVisible: (menu) => canAccessOwnerUnit(menu),
        }}
        columns={[
          {
            title: 'Ativo',
            dataIndex: 'active',
            width: 80,
            render: (active: boolean, menu) =>
              menu.unit_id === unity?.id ? (
                <div className="w-full flex justify-center">
                  <Switch
                    checked={active}
                    onChange={(checked) =>
                      dispatch(MenuCreators.editMenuRequest({ menu: { id: menu.id, active: checked } }))
                    }
                  />
                </div>
              ) : null,
          },
          {
            title: 'Nome',
            dataIndex: 'title',
            render: (_, menu) => {
              const isForeignMenu = menu.unit_id !== unity?.id;

              if (isForeignMenu) {
                if (canAccessOwnerUnit(menu)) {
                  return (
                    <button
                      type="button"
                      onClick={() => confirmRedirectToOwnerUnit(menu)}
                      className="cursor-pointer w-fit text-blue-900 bg-transparent border-0 p-0 text-left"
                    >
                      {menu.title['pt-br']}
                    </button>
                  );
                }

                return <span className="w-fit text-gray-700">{menu.title['pt-br']}</span>;
              }

              return (
                <Link to={`/units/${unity?.id}/menus/${menu.id}/edit`} className="cursor-pointer w-fit text-blue-900">
                  {menu.title['pt-br']}
                </Link>
              );
            },
          },
          ...(user?.master === true
            ? [
                {
                  title: '',
                  dataIndex: 'id',
                  render: (id: string) => (
                    <Button
                      size="small"
                      variant="outlined"
                      icon={<Copy size={14} />}
                      onClick={() => handleCopyHashId(id)}
                      className="text-xs inline-flex items-center justify-center leading-none"
                    >
                      <div className="flex h-full items-center gap-2">
                        <span>Copiar Hash ID</span>
                      </div>
                    </Button>
                  ),
                },
              ]
            : []),
        ]}
      />

      <div className="col-start-2 row-start-2 h-fit flex flex-col gap-4">
        <BoxContrasted>
          <div className="flex items-center gap-2">
            <Share2 size={14} />
            <span className="text-base text-gray-700 font-semibold">Compartilhar</span>
          </div>
          <div className="flex items-center gap-4 justify-between border border-gray-200 rounded-md py-3 px-4 mt-4">
            <a
              href={`${import.meta.env.VITE_MENU_BASE_URL}/pt-br/${unity?.id}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-800 text-xs underline truncate"
            >
              {`${import.meta.env.VITE_MENU_BASE_URL}/pt-br/${unity?.id}`}
            </a>
            <Tooltip title="Copiar link do cardápio" placement="bottom">
              <Button
                className="shrink-0"
                size="small"
                variant="outlined"
                icon={<Copy size={14} />}
                onClick={handleCopyLinkShare}
              />
            </Tooltip>
          </div>
        </BoxContrasted>
        <BoxContrasted>
          <div className="flex items-center gap-2 mb-2">
            <QrCode size={14} />
            <span className="text-base text-gray-700 font-semibold">QR Code</span>
          </div>
          <p className="text-xs text-gray-500">
            Divulgue seus cardápios usando o QR Code. Você também pode usar nosso modelo para gerar um display de mesa.
          </p>
          <div className="flex items-center justify-between mt-4">
            <Button onClick={generateQrCodes} loading={loadingQrCode} variant="outlined" icon={<Download size={14} />}>
              QR Code
            </Button>
            <Button onClick={generateDisplay} loading={loadingDisplay} variant="outlined" icon={<Download size={14} />}>
              Display
            </Button>
          </div>
        </BoxContrasted>
      </div>
      <Modal
        title={<Title level={3}>{editable ? 'Editar Cardápio' : 'Adicionar Cardápio'}</Title>}
        open={visible}
        centered
        afterClose={resetForm}
        footer={null}
        width="30%"
        onCancel={() => setVisible(false)}
      >
        <Form layout="vertical" onFinish={onFinish} onChange={() => setDisabled(false)} form={form}>
          <Row>
            <Col xl={24} sm={24} md={12}>
              <div className="flex items-center justify-center mb-5">
                <ImageUpload
                  className="w-[200px] [&_.ant-upload]:!h-[100px]"
                  imageSrc={imageData?.content}
                  recommendedWidth={400}
                  recommendedHeight={200}
                  onDelete={() => setImageData(null)}
                  onChangeCallback={handleImage}
                />
              </div>
              <Form.Item rules={rules.name} name={['titlePtBr']} label="Nome do Cardápio">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Button htmlType="submit" disabled={disabled} loading={saving}>
              {editable ? 'Editar Cardápio' : 'Criar Cardápio'}
            </Button>
          </Row>
        </Form>
      </Modal>
      <LinkedUnitsDrawer
        open={linkedUnitsDrawerOpen}
        setOpen={setLinkedUnitsDrawerOpen}
        linkedUnits={selectedMenuForUnits?.units ?? []}
        searchHelp="Selecione uma unidade para vincular ao cardápio"
        onSave={(units: LinkedUnit[]) => {
          if (selectedMenuForUnits) {
            dispatch(MenuCreators.linkMenuUnitsRequest({ menuId: selectedMenuForUnits.id, units }));
          }
        }}
      />
    </PageContainer>
  );
};

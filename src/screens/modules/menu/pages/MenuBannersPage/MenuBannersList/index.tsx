import { FunctionComponent, useEffect } from 'react';
import { MenuCreators } from 'src/store/modules/menu/actions';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { Form } from 'antd';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';
import * as S from './styles';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import { notification } from 'src/utils/helpers';
import { UploadFile } from 'antd/lib/upload/interface';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { BannerBase, BannerPayload, BannerPayloadIdentified, BannerResponse } from 'src/store/modules/menu/reducer';
import { MenuBannerCard } from './MenuBannerCard';

export type ParamProps = {
  unity: string;
};

type MenuBannersListProps = {
  banners: BannerResponse[];
  type: BannerBase['type'];
};

export const MenuBannersList: FunctionComponent<MenuBannersListProps> = ({ banners, type }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {
    menu: { savingBanners },
    hall: { unity },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unity) {
      dispatch(MenuCreators.getMenuBannersRequest({ type: type }));
    }
  }, [unity]);

  useEffect(() => {
    form.setFieldsValue({
      bannerList: banners.map((banner) => ({
        id: banner.id,
        image: {
          content: banner.image,
          name: '',
        },
        active: banner.active,
        link: banner.link,
      })),
    });
  }, [form, banners]);

  const handleChange = (info: UploadChangeParam<UploadFile>, fieldKey: number) => {
    if (info.file.status === 'uploading') {
      getBase64(info.file.originFileObj as RcFile, (url) => {
        const values = form.getFieldsValue();

        form.setFieldsValue({
          bannerList: (values.bannerList ?? []).map((item: any, index: number) => {
            if (index === fieldKey) {
              return {
                ...item,
                image: {
                  content: url,
                  name: info.file.name,
                },
              };
            }

            return item;
          }),
        });
      });

      return;
    }
  };

  const getPayload = (fieldKey: number) => {
    const values = form.getFieldsValue();

    const bannerValue = values.bannerList[fieldKey];

    const bannerInitialValues = banners.find((banner) => banner.id === bannerValue.id);

    if (bannerInitialValues !== undefined) {
      const payload = {};

      Object.keys(bannerInitialValues).forEach((key) => {
        if (key === 'image' && bannerValue[key].content !== bannerInitialValues[key as keyof BannerResponse]) {
          Object.defineProperty(payload, key, {
            value: bannerValue[key],
            enumerable: true,
          });
        } else if (
          key !== 'image' &&
          bannerValue[key] !== bannerInitialValues[key as keyof BannerResponse] &&
          bannerValue[key] !== undefined &&
          bannerValue[key] !== null
        ) {
          Object.defineProperty(payload, key, {
            value: bannerValue[key],
            enumerable: true,
          });
        }
      });

      return {
        ...payload,
        id: bannerInitialValues.id,
        type: type,
      } as BannerPayloadIdentified;
    } else {
      const payload = {};

      Object.keys(bannerValue).forEach((key) => {
        if (key === 'image' && (bannerValue[key] || undefined) !== undefined) {
          Object.defineProperty(payload, key, {
            value: {
              content: bannerValue[key].content,
              name: bannerValue[key].name,
            },
            enumerable: true,
          });

          return;
        }

        if (key !== 'image' && (bannerValue[key] || undefined) !== undefined) {
          Object.defineProperty(payload, key, {
            value: bannerValue[key],
            enumerable: true,
          });
        }
      });

      return payload as BannerPayload;
    }
  };

  const handleSaveBanner = (fieldKey: number) => {
    const values = form.getFieldsValue();

    const payload = getPayload(fieldKey);

    const bannerValue = values.bannerList[fieldKey];

    if (bannerValue.id === undefined) {
      dispatch(
        MenuCreators.createMenuBannerRequest({
          ...payload,
          type: type,
        })
      );

      return;
    }

    dispatch(MenuCreators.editMenuBannerRequest({ ...payload }));
  };

  const handleRemoveBanner = (fieldKey: number) => {
    const values = form.getFieldsValue();

    const bannerValue = values.bannerList[fieldKey];

    if (bannerValue.id !== undefined) {
      dispatch(MenuCreators.deleteMenuBannerRequest({ id: bannerValue.id, type: type }));
    }
  };

  const handleChangeGridDnd = (_: string, sourceIndex: number, targetIndex: number) => {
    const values = form.getFieldsValue();

    const banners = swap(values.bannerList, sourceIndex, targetIndex);

    form.setFieldsValue({
      bannerList: banners,
    });

    dispatch(
      MenuCreators.updateListMenuBanner({
        banners: (banners as BannerPayloadIdentified[]).map((banner) => ({
          ...banner,
          image: banner.image.content,
        })),
        type: type,
      })
    );

    const payload = getPayload(targetIndex);

    if (payload !== null) {
      dispatch(
        MenuCreators.editMenuBannerRequest({
          ...payload,
          priority: targetIndex,
        })
      );
    }
  };

  return (
    <S.Wrapper>
      <Form form={form} name="bannerForm" autoComplete="off" layout="vertical">
        <Form.List name="bannerList">
          {(fields, { add, remove }) => (
            <>
              <S.Tooltip
                title={
                  form.getFieldValue('bannerList')?.some((item: any) => item === undefined || item.id === undefined)
                    ? 'Finalize as alterações pendentes nos outros banners para adicionar outro.'
                    : ''
                }
              >
                <S.AddBannerFieldsButton
                  type="primary"
                  onClick={() => add()}
                  block
                  icon={<Add size={20} />}
                  disabled={
                    form
                      .getFieldValue('bannerList')
                      ?.some((item: any) => item === undefined || item.id === undefined) || savingBanners
                  }
                >
                  Adicionar banner
                </S.AddBannerFieldsButton>
              </S.Tooltip>
              <GridContextProvider onChange={handleChangeGridDnd}>
                <div className="provider-container">
                  <GridDropZone
                    id="banners"
                    className="dropzone"
                    boxesPerRow={type === 'home' ? 4 : 3}
                    rowHeight={type === 'home' ? 548 : 328}
                  >
                    {fields.map(({ key, name, ...restField }) => (
                      <GridItem key={key}>
                        <div className="grid-item">
                          <MenuBannerCard
                            id={name}
                            saving={savingBanners}
                            form={form}
                            restField={restField}
                            type={type}
                            handleRemoveBanner={handleRemoveBanner}
                            remove={remove}
                            beforeUpload={beforeUpload}
                            handleChange={handleChange}
                            handleSaveBanner={handleSaveBanner}
                          />
                        </div>
                      </GridItem>
                    ))}
                  </GridDropZone>
                </div>
              </GridContextProvider>
            </>
          )}
        </Form.List>
      </Form>
    </S.Wrapper>
  );
};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

  if (!isJpgOrPng) {
    notification.warning('Tipo de arquivo não suportado', 'O arquivo deve ser um arquivo jpeg ou png.');
  }

  const isLessthan2M = file.size / 1024 / 1024 < 2;

  if (!isLessthan2M) {
    notification.warning(
      'Tamanho de imagem não suportado',
      'Infelizmente excedeu o tamanho máximo permitido. Por favor, insira imagens de até 1.8MB.'
    );
  }

  return isJpgOrPng && isLessthan2M;
};

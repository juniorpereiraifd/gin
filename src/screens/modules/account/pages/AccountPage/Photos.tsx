import React, { useEffect, useRef } from 'react';
import { List } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Title } from 'src/stories/typography';
import Space from 'src/stories/utils/Space';
import { Button } from 'src/stories/general/Button';
import ImageUpload, { type Base64Props } from 'src/stories/entry/ImageUpload';
import * as S from './styles';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Creators as PhotoCreators } from 'src/store/modules/photo/actions';
import { PhotoItemProps } from 'src/store/modules/photo/reducer';
import { getBase64 } from 'src/stories/entry/ImageUpload';
import { notification } from 'src/utils/helpers';
import { LIMIT_1_8_MB } from 'src/utils/constants';
import { BoxContrasted } from 'src/components/BoxContrasted';

const grid = {
  gutter: 30,
  xl: 3,
  xxl: 3,
  md: 2,
};

const Photos = () => {
  const dispatch = useDispatch();
  const {
    hall: { unity },
    photo: { data, loading },
  } = useSelector((state: RootType) => state);
  const inputRef = useRef(null);

  useEffect(() => {
    if (unity?.id) dispatch(PhotoCreators.getPhotosRequest());
  }, [dispatch, unity]);

  const handleDeleteImage = (property: string) =>
    dispatch(
      UnityCreators.editUnityLogoRequest({
        id: unity?.id,
        [property]: null,
      })
    );

  const handleImage = (values: Base64Props, property: string) =>
    dispatch(
      UnityCreators.editUnityLogoRequest({
        id: unity?.id,
        [property]: values,
      })
    );

  return (
    <BoxContrasted>
      <Title icon={<S.Camera size={35} />}>Fotos</Title>
      <S.UnityImages>
        <S.LogoWrapper>
          <Space size={5} direction="vertical">
            <Title level={2}>Logo</Title>
            <S.Logo
              imageSrc={unity?.profile_image}
              onDelete={() => handleDeleteImage('profile_image')}
              onChangeCallback={(values: Base64Props) => handleImage(values, 'profile_image')}
            />
          </Space>
        </S.LogoWrapper>
        <S.CoverWrapper>
          <Space size={5} direction="vertical">
            <Title level={2}>Foto de capa</Title>
            <ImageUpload
              imageSrc={unity?.cover_image}
              onChangeCallback={(values: Base64Props) => handleImage(values, 'cover_image')}
              onDelete={() => handleDeleteImage('cover_image')}
            />
          </Space>
        </S.CoverWrapper>
      </S.UnityImages>
      <S.UnityImages>
        <Title icon={<S.Image size={35} />}>Álbum de fotos</Title>
        {data.length < 6 && (
          /* @ts-ignore */
          <Button onClick={() => inputRef?.current?.click()}>Adicionar Foto</Button>
        )}
      </S.UnityImages>
      <input
        type="file"
        accept="image/jpg, image/jpeg, image/png"
        hidden
        ref={inputRef}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target) {
            /* @ts-ignore */
            const file = e?.target?.files[0];
            if (file.size > LIMIT_1_8_MB) {
              notification.warning(
                'Tamanho de imagem não suportado',
                'Infelizmente essa imagem é muito pesada. Por favor, insira imagens de até 1.8MB.'
              );
              return;
            }

            getBase64(file, (image: string) =>
              dispatch(
                PhotoCreators.createPhotoRequest({
                  name: file.name,
                  content: image,
                })
              )
            );
          }
        }}
      />
      <List
        grid={grid}
        loading={loading}
        dataSource={data}
        locale={{
          emptyText: 'Nenhuma foto encontrada',
        }}
        renderItem={(image: PhotoItemProps) => (
          <List.Item>
            <S.ImageWrapper>
              <ImageUpload
                imageSrc={image.image}
                onChangeCallback={() => null}
                onDelete={() => dispatch(PhotoCreators.deletePhotoRequest(image))}
              />
            </S.ImageWrapper>
          </List.Item>
        )}
      />
    </BoxContrasted>
  );
};

export default Photos;

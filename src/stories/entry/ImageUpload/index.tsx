import { Fragment, useEffect, useState, type FunctionComponent } from 'react';
import { Upload, type UploadFile, type UploadProps } from 'antd';
import type { UploadChangeParam } from 'antd/lib/upload';
import { Camera, Trash } from 'lucide-react';
import Delete from 'src/components/Delete';
import { notification } from 'src/utils/helpers';
import { IMAGE_TYPE, LIMIT_1_8_MB } from 'src/utils/constants';
import { Button } from 'src/stories/general/Button';
import { cn } from 'src/lib/utils';

export function getBase64(img: any, callback: any) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

export type Base64Props = {
  name: string;
  content: string;
};

type ImageUploadProps = UploadProps & {
  imageSrc?: string;
  onChangeCallback: (file: Base64Props) => void;
  onDelete?: () => void;
  recommendedWidth?: number;
  recommendedHeight?: number;
  className?: string;
};

const ImageUpload: FunctionComponent<ImageUploadProps> = (props) => {
  const { imageSrc, onChangeCallback, className, recommendedWidth, recommendedHeight, onDelete } = props;
  const [image, setImage] = useState(imageSrc);

  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file === undefined) {
      notification.warning('Houve um erro ao carregar a sua imagem, tente novamente!', '');
      return;
    }

    if (info.file.type?.match(IMAGE_TYPE)) {
      if (info.file.size !== undefined && info.file.size > LIMIT_1_8_MB) {
        notification.warning(
          'Tamanho de imagem não suportado',
          'Infelizmente essa imagem é muito pesada. Por favor, insira imagens de até 1.8MB.'
        );

        return;
      }

      if (info.file.status === 'uploading') {
        getBase64(info.file.originFileObj, (imageUrl: any) => {
          setImage(imageUrl);
          onChangeCallback({ name: info.file.name, content: imageUrl });
        });
      }
    } else {
      notification.warning('O arquivo deve ser uma imagem!', '');
    }
  };

  const handleDeleteImage = () => {
    onDelete?.();
    setImage(undefined);
  };

  useEffect(() => {
    setImage(imageSrc);
  }, [imageSrc]);

  return (
    <div className="relative">
      <Upload
        listType="picture-card"
        showUploadList={false}
        customRequest={() => null}
        {...props}
        className={cn(
          '!relative [&_.ant-upload]:!w-full [&_.ant-upload]:!h-52 [&_.ant-upload]:!flex [&_.ant-upload]:!items-center [&_.ant-upload]:!justify-center [&_.ant-upload]:!overflow-hidden',
          className
        )}
        onChange={handleChange}
      >
        <div className="group flex items-center justify-center w-full h-full overflow-hidden">
          {image ? (
            <Fragment>
              <div className="absolute rounded-md top-0 left-0 w-full h-full opacity-0 bg-gray-800 group-hover:opacity-50 transition-opacity duration-300 ease-in-out" />
              <img src={image} alt="avatar" />
            </Fragment>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center">
              <Camera size={25} className="text-gray-400" />
              {recommendedWidth !== undefined && recommendedHeight !== undefined && (
                <span className="text-xs text-gray-400 font-medium">
                  {recommendedWidth} x {recommendedHeight} px
                </span>
              )}
            </div>
          )}
        </div>
      </Upload>
      {image && (
        <Delete onDelete={handleDeleteImage}>
          <Button
            variant="outlined"
            icon={<Trash size={20} className="text-gray-600" />}
            className="absolute right-5 bottom-5 bg-gray-200"
          />
        </Delete>
      )}
    </div>
  );
};

export default ImageUpload;

import { Fragment, useRef, useState, type FunctionComponent, type ReactNode } from 'react';
import { Upload as BaseUpload, UploadProps as BaseUploadProps, Image, message, type UploadFile } from 'antd';
import { FileImage, FileUpIcon } from 'lucide-react';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile } from 'antd/lib/upload';

export type UploadValueField = UploadFile<RcFile>[];

type UploadProps = BaseUploadProps & {
  typeUpload: 'image' | 'document';
  title?: string;
  description?: string;
  details?: string[];
  maxSizeMB?: number;
};

export const Upload: FunctionComponent<UploadProps> = (props) => {
  const {
    typeUpload = 'image',
    title = 'Carregar imagem',
    description = 'Arraste e solte ou clique para selecionar',
    details,
    maxSizeMB,
    beforeUpload,
    customRequest,
  } = props;
  const accept = typeUpload === 'image' ? 'image/png,image/jpeg,image/jpg' : 'application/pdf';
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const revokeRef = useRef<null | (() => void)>(null);

  const openPreview = (file: UploadFile) => {
    if (typeUpload !== 'image') {
      return;
    }

    revokeRef.current?.();
    revokeRef.current = null;

    const { src, revoke } = getFullSrc(file);

    if (!src) {
      return;
    }

    revokeRef.current = revoke ?? null;

    setPreviewSrc(src);
    setPreviewOpen(true);
  };

  const handleVisibleChange = (visible: boolean) => {
    setPreviewOpen(visible);

    if (!visible) {
      revokeRef.current?.();
      revokeRef.current = null;

      setPreviewSrc('');
    }
  };

  const handleBeforeUpload: BaseUploadProps['beforeUpload'] = (file) => {
    if (maxSizeMB && file.size / 1024 / 1024 > maxSizeMB) {
      message.error(`Arquivo deve ter até ${maxSizeMB} MB`);

      return BaseUpload.LIST_IGNORE;
    }

    return true;
  };

  return (
    <Fragment>
      <BaseUpload.Dragger
        accept={accept}
        beforeUpload={beforeUpload || handleBeforeUpload}
        showUploadList={{ showPreviewIcon: false }}
        onPreview={openPreview}
        customRequest={customRequest}
        {...props}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            {icon(typeUpload)}
          </div>
          <p className="mb-1.5 text-sm font-medium">{title}</p>
          <p className="text-muted-foreground text-gray-500 mb-2 text-xs">{description}</p>
          <div className="text-muted-foreground/70 text-gray-500 flex flex-wrap justify-center gap-1 text-xs">
            {details
              ? details.map((detail, index) => (
                  <Fragment key={detail}>
                    <span key={index}>{detail}</span>
                    {index < details.length - 1 && <span>∙</span>}
                  </Fragment>
                ))
              : null}
          </div>
        </div>
      </BaseUpload.Dragger>
      <Image
        style={{ display: 'none' }}
        src={previewSrc || undefined}
        preview={{
          visible: previewOpen,
          src: previewSrc,
          onVisibleChange: handleVisibleChange,
        }}
      />
    </Fragment>
  );
};

export const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }

  return e?.fileList ?? undefined;
};

function getFullSrc(file: UploadFile): { src: string; revoke?: () => void } {
  if (file.originFileObj) {
    const objectUrl = URL.createObjectURL(file.originFileObj as File);

    return { src: objectUrl, revoke: () => URL.revokeObjectURL(objectUrl) };
  }

  if (file.url) {
    return { src: file.url };
  }

  if (file.thumbUrl) {
    return { src: file.thumbUrl };
  }

  return { src: '' };
}

const icon = (typeUpload: 'image' | 'document'): ReactNode => {
  switch (typeUpload) {
    case 'image':
      return <FileImage className="size-4 opacity-60" />;
    case 'document':
      return <FileUpIcon className="size-4 opacity-60" />;
    default:
      return null;
  }
};

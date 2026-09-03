import { Col, Divider, Dropdown, message, Radio, Row, Skeleton, Tag } from 'antd';
import { EllipsisVertical, RefreshCw, Trash } from 'lucide-react';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useEffect, type FunctionComponent, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxContrasted } from 'src/components/BoxContrasted';
import api from 'src/services/api';
import * as Response from 'src/utils/response';
import { PaymentCreators } from 'src/store/modules/payment/actions';
import type { SellerDocumentStatus, SellerProps } from 'src/store/modules/payment/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Form, useForm, useWatch } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { normFile, Upload } from 'src/stories/entry/Upload';
import { Button } from 'src/stories/general/Button';
import { fileToBase64, getFileNameFromUrl, urlToUploadFile } from 'src/utils/file';

type DocumentsSectionProps = {
  loading?: boolean;
  editable?: SellerProps;
};

export const DocumentsSection: FunctionComponent<DocumentsSectionProps> = (props) => {
  const { loading, editable } = props;
  const dispatch = useDispatch();
  const {
    payment: { refreshingStatus },
  } = useSelector((state: RootType) => state);
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleRefreshStatus = () => {
    if (editable) {
      dispatch(PaymentCreators.refreshSellerStatusRequest({ sellerId: editable.id }));
    }
  };
  const selfValue = useWatch('self', form);
  const documentType = useWatch('document_type', form);
  const cnhFrontValue = useWatch('cnh_front', form);
  const cnhBackValue = useWatch('cnh_back', form);
  const cnhFullValue = useWatch('cnh_full', form);
  const rgFrontValue = useWatch('rg_front', form);
  const rgBackValue = useWatch('rg_back', form);

  useEffect(() => {
    if (editable && editable.documents.length > 0) {
      const documents = {
        self: editable.documents.find((doc) => doc.category === 'SELFIE'),
        document_type: editable.documents.some((doc) => doc.category === 'CNH_FRONT' || doc.category === 'CNH_BACK')
          ? 'cnh'
          : editable.documents.some((doc) => doc.category === 'CNH_FULL')
          ? 'cnh_full'
          : 'rg',
        cnh_front: editable.documents.find((doc) => doc.category === 'CNH_FRONT'),
        cnh_back: editable.documents.find((doc) => doc.category === 'CNH_BACK'),
        cnh_full: editable.documents.find((doc) => doc.category === 'CNH_FULL'),
        rg_front: editable.documents.find((doc) => doc.category === 'RG_FRONT'),
        rg_back: editable.documents.find((doc) => doc.category === 'RG_BACK'),
      };

      form.setFieldsValue({
        self: [
          {
            ...urlToUploadFile(
              documents.self?.file_path || '',
              getFileNameFromUrl(documents.self?.file_path || '') || 'self.jpg',
              `image/${documents.self?.file_path.split('.').pop() || 'jpg'}`,
              documents.self?.id,
            ),
            response: {
              id: documents.self?.id,
              image: documents.self?.file_path,
              status: documents.self?.status,
            },
          },
        ],
        document_type: documents.document_type,
        ...(documents.cnh_front && {
          cnh_front: [
            {
              ...urlToUploadFile(
                documents.cnh_front.file_path,
                getFileNameFromUrl(documents.cnh_front.file_path || '') || 'cnh-front.jpg',
                `image/${documents.cnh_front.file_path.split('.').pop() || 'jpg'}`,
                documents.cnh_front.id,
              ),
              response: {
                id: documents.cnh_front.id,
                image: documents.cnh_front.file_path,
                status: documents.cnh_front.status,
              },
            },
          ],
        }),
        ...(documents.cnh_back && {
          cnh_back: [
            {
              ...urlToUploadFile(
                documents.cnh_back.file_path,
                getFileNameFromUrl(documents.cnh_back.file_path || '') || 'cnh-back.jpg',
                `image/${documents.cnh_back.file_path.split('.').pop() || 'jpg'}`,
                documents.cnh_back.id,
              ),
              response: {
                id: documents.cnh_back.id,
                image: documents.cnh_back.file_path,
                status: documents.cnh_back.status,
              },
            },
          ],
        }),
        ...(documents.cnh_full && {
          cnh_full: [
            {
              ...urlToUploadFile(
                documents.cnh_full.file_path,
                getFileNameFromUrl(documents.cnh_full.file_path || '') || 'cnh-completa.pdf',
                `application/pdf`,
                documents.cnh_full.id,
              ),
              response: {
                id: documents.cnh_full.id,
                image: documents.cnh_full.file_path,
                status: documents.cnh_full.status,
              },
            },
          ],
        }),
        ...(documents.rg_front && {
          rg_front: [
            {
              ...urlToUploadFile(
                documents.rg_front.file_path,
                getFileNameFromUrl(documents.rg_front.file_path || '') || 'rg-front.jpg',
                `image/${documents.rg_front.file_path.split('.').pop() || 'jpg'}`,
                documents.rg_front.id,
              ),
              response: {
                id: documents.rg_front.id,
                image: documents.rg_front.file_path,
                status: documents.rg_front.status,
              },
            },
          ],
        }),
        ...(documents.rg_back && {
          rg_back: [
            {
              ...urlToUploadFile(
                documents.rg_back.file_path,
                getFileNameFromUrl(documents.rg_back.file_path || '') || 'rg-back.jpg',
                `image/${documents.rg_back.file_path.split('.').pop() || 'jpg'}`,
                documents.rg_back.id,
              ),
              response: {
                id: documents.rg_back.id,
                image: `${import.meta.env.VITE_API_STORAGE_BASE_URL}/${documents.rg_back.file_path}`,
                status: documents.rg_back.status,
              },
            },
          ],
        }),
      });
    }
  }, [editable]);

  const handleUploadDocument = async (options: UploadRequestOption<any> & { category: string }) => {
    const { file, category, onSuccess, onError } = options;

    try {
      const base64 = await fileToBase64(file as File);

      if (!base64) {
        throw new Error('Houve um erro ao converter o arquivo.');
      }

      const { data: response, status } = await api.post('/payment/v1/seller-credentialing/documents', {
        seller_credentialing_id: editable?.id,
        category: category,
        file: { name: (file as File).name, content: base64 },
      });

      const { id, file_path, status: documentStatus } = response.data;

      if (status === Response.HTTP_CREATED) {
        onSuccess?.({ id, file_path, status: documentStatus }, file as File);
      }
    } catch (e) {
      onError?.(new Error('Houve um erro ao enviar o arquivo. Remova a imagem com erro e tente novamente.'));
    }
  };

  const handleRemoveFile = (fieldName: string, currentValue: any[], file: any) => {
    const clearFileValue = () => {
      form.setFieldValue(
        fieldName,
        currentValue.filter((f: any) => f.uid !== file.uid),
      );
    };

    if (file.status === 'error') {
      clearFileValue();
      return;
    }

    handleRemoveDocument(file.response.id, clearFileValue);
  };

  const handleRemoveDocument = async (documentId: number, onSuccess?: () => void) => {
    const key = `remove-doc-${documentId}`;

    messageApi.open({
      key,
      type: 'loading',
      content: 'Removendo documento...',
      duration: 0,
    });

    try {
      const { status } = await api.delete(`/payment/v1/seller-credentialing/documents/${documentId}`);

      if (status === Response.NO_CONTENT) {
        onSuccess?.();
        messageApi.open({
          key,
          type: 'success',
          content: 'Documento removido com sucesso.',
          duration: 2,
        });
      }
    } catch {
      messageApi.open({
        key,
        type: 'error',
        content: 'Houve um erro ao remover o documento. Tente novamente.',
        duration: 3,
      });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}
      <div className="flex w-full items-center justify-center">
        <BoxContrasted className="w-full max-w-3xl">
          <Form layout="vertical" form={form} initialValues={{ document_type: 'cnh' }}>
            {editable && (
              <Row gutter={16}>
                <Col span={24}>
                  <div className="w-full flex items-center justify-end">
                    <Button
                      variant="outlined"
                      icon={<RefreshCw size={14} />}
                      loading={refreshingStatus}
                      onClick={handleRefreshStatus}
                    >
                      Atualizar status dos documentos
                    </Button>
                  </div>
                </Col>
                <Divider />
              </Row>
            )}
            <FormItem
              label="Selfie do titular"
              name="self"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={rules.self}
            >
              <Upload
                disabled={loading}
                customRequest={(options) => handleUploadDocument({ ...options, category: 'SELFIE' })}
                onChange={({ file }) => {
                  if (file.status === 'done') {
                    message.success(`${file.name} enviado com sucesso.`);
                  }
                  if (file.status === 'error') {
                    message.error(`${file.name} falhou ao enviar.`);
                  }
                }}
                typeUpload="image"
                details={['PNG ou JPG', 'Até 500 KB']}
                maxSizeMB={0.5}
                listType="picture"
                multiple={false}
                aria-label="Selfie do titular"
                className="[&_.ant-upload-list-item-name]:relative [&_.ant-upload-list-item-name]:block [&_.ant-upload-list-item-name]:!pr-32 [&_.ant-upload-list-item-name]:!py-2 [&_.ant-upload-list-item-name]:overflow-hidden [&_.ant-upload-list-item-name]:text-ellipsis [&_.ant-upload-list-item-name]:whitespace-nowrap [&_.ant-upload-list-item-extra]:absolute [&_.ant-upload-list-item-extra]:right-0 [&_.ant-upload-list-item-extra]:top-1/2 [&_.ant-upload-list-item-extra]:-translate-y-1/2 [&_.ant-upload-list-item-extra]:shrink-0"
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false,
                  extra: (file) => (
                    <div className="flex items-center gap-2">
                      {refreshingStatus ? (
                        <Skeleton.Button active size="small" className="!w-[70px] !h-[22px]" />
                      ) : (
                        DocumentStatusTag[file.response?.status as SellerDocumentStatus] || null
                      )}
                      {file.response?.status !== 'approved' && (
                        <Dropdown
                          disabled={loading}
                          menu={{
                            items: [
                              {
                                label: 'Remover imagem',
                                key: 'remove',
                                icon: <Trash size={14} className="text-slate-600" />,
                                onClick: (e) => {
                                  e.domEvent.stopPropagation();
                                  handleRemoveFile('self', selfValue, file);
                                },
                              },
                            ],
                          }}
                          trigger={['click']}
                        >
                          <Button
                            variant="outlined"
                            size="small"
                            icon={<EllipsisVertical size={14} className="text-slate-500" />}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </Dropdown>
                      )}
                    </div>
                  ),
                }}
              />
            </FormItem>
            <Divider />
            <FormItem
              label="Escolha o tipo de documento"
              name="document_type"
              rules={rules.document_type}
              className="[&_.ant-form-item-extra]:text-xs [&_.ant-form-item-extra]:mt-2"
              tooltip="Só é possível enviar um tipo de documento. Se desejar mudar o tipo de documento, remova os arquivos enviados e escolha o novo tipo."
            >
              <Radio.Group
                block
                options={[
                  { label: 'CNH Frente/Verso', value: 'cnh' },
                  { label: 'CNH Completa', value: 'cnh_full' },
                  { label: 'RG Frente/Verso', value: 'rg' },
                ]}
                disabled={
                  loading ||
                  cnhFrontValue?.length > 0 ||
                  cnhBackValue?.length > 0 ||
                  cnhFullValue?.length > 0 ||
                  rgFrontValue?.length > 0 ||
                  rgBackValue?.length > 0
                }
                defaultValue="cnh"
                optionType="button"
              />
            </FormItem>
            {documentType === 'cnh_full' ? (
              <FormItem
                label="CNH Completa"
                name="cnh_full"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                rules={rules.cnh_full}
              >
                <Upload
                  disabled={loading}
                  customRequest={(options) => handleUploadDocument({ ...options, category: 'CNH_FULL' })}
                  onChange={({ file }) => {
                    if (file.status === 'done') {
                      message.success(`${file.name} enviado com sucesso.`);
                    }
                    if (file.status === 'error') {
                      message.error(`${file.name} falhou ao enviar.`);
                    }
                  }}
                  typeUpload="document"
                  details={['PDF', 'Até 2 MB']}
                  maxSizeMB={2}
                  listType="picture"
                  multiple={false}
                  aria-label="CNH Completa"
                  className="[&_.ant-upload-list-item-name]:relative [&_.ant-upload-list-item-name]:block [&_.ant-upload-list-item-name]:!pr-32 [&_.ant-upload-list-item-name]:!py-2 [&_.ant-upload-list-item-name]:overflow-hidden [&_.ant-upload-list-item-name]:text-ellipsis [&_.ant-upload-list-item-name]:whitespace-nowrap [&_.ant-upload-list-item-extra]:absolute [&_.ant-upload-list-item-extra]:right-0 [&_.ant-upload-list-item-extra]:top-1/2 [&_.ant-upload-list-item-extra]:-translate-y-1/2 [&_.ant-upload-list-item-extra]:shrink-0"
                  showUploadList={{
                    showPreviewIcon: false,
                    showRemoveIcon: false,
                    extra: (file) => (
                      <div className="flex items-center gap-2">
                        {refreshingStatus ? (
                          <Skeleton.Button active size="small" className="!w-[70px] !h-[22px]" />
                        ) : (
                          DocumentStatusTag[file.response?.status as SellerDocumentStatus] || null
                        )}
                        {file.response?.status !== 'approved' && (
                          <Dropdown
                            disabled={loading}
                            menu={{
                              items: [
                                {
                                  label: 'Remover arquivo',
                                  key: 'remove',
                                  icon: <Trash size={14} className="text-slate-600" />,
                                  onClick: (e) => {
                                    e.domEvent.stopPropagation();
                                    handleRemoveFile('cnh_full', cnhFullValue, file);
                                  },
                                },
                              ],
                            }}
                            trigger={['click']}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              icon={<EllipsisVertical size={14} className="text-slate-500" />}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Dropdown>
                        )}
                      </div>
                    ),
                  }}
                />
              </FormItem>
            ) : (
            <Row gutter={16}>
              <Col span={12}>
                <FormItem
                  label="Frente"
                  name={`${documentType === 'cnh' ? 'cnh_front' : 'rg_front'}`}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={rules.front}
                >
                  <Upload
                    disabled={loading}
                    customRequest={(options) =>
                      handleUploadDocument({ ...options, category: documentType === 'cnh' ? 'CNH_FRONT' : 'RG_FRONT' })
                    }
                    onChange={({ file }) => {
                      if (file.status === 'done') {
                        message.success(`${file.name} enviado com sucesso.`);
                      }
                      if (file.status === 'error') {
                        message.error(`${file.name} falhou ao enviar.`);
                      }
                    }}
                    typeUpload="image"
                    details={['PNG ou JPG', 'Até 500 KB']}
                    maxSizeMB={1.8}
                    listType="picture"
                    multiple={false}
                    aria-label="Frente do documento"
                    className="[&_.ant-upload-list-item-name]:relative [&_.ant-upload-list-item-name]:block [&_.ant-upload-list-item-name]:!pr-32 [&_.ant-upload-list-item-name]:!py-2 [&_.ant-upload-list-item-name]:overflow-hidden [&_.ant-upload-list-item-name]:text-ellipsis [&_.ant-upload-list-item-name]:whitespace-nowrap [&_.ant-upload-list-item-extra]:absolute [&_.ant-upload-list-item-extra]:right-0 [&_.ant-upload-list-item-extra]:top-1/2 [&_.ant-upload-list-item-extra]:-translate-y-1/2 [&_.ant-upload-list-item-extra]:shrink-0"
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: false,
                      extra: (file) => (
                        <div className="flex items-center gap-2 ml-4">
                          {refreshingStatus ? (
                            <Skeleton.Button active size="small" className="!w-[70px] !h-[22px]" />
                          ) : (
                            DocumentStatusTag[file.response?.status as SellerDocumentStatus] || null
                          )}
                          {file.response?.status !== 'approved' && (
                            <Dropdown
                              disabled={loading}
                              menu={{
                                items: [
                                  {
                                    label: 'Remover imagem',
                                    key: 'remove',
                                    icon: <Trash size={14} className="text-slate-600" />,
                                    onClick: (e) => {
                                      e.domEvent.stopPropagation();
                                      handleRemoveFile(
                                        documentType === 'cnh' ? 'cnh_front' : 'rg_front',
                                        documentType === 'cnh' ? cnhFrontValue : rgFrontValue,
                                        file,
                                      );
                                    },
                                  },
                                ],
                              }}
                              trigger={['click']}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                icon={<EllipsisVertical size={14} className="text-slate-500" />}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Dropdown>
                          )}
                        </div>
                      ),
                    }}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem
                  label="Verso"
                  name={`${documentType === 'cnh' ? 'cnh_back' : 'rg_back'}`}
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                  rules={rules.back}
                >
                  <Upload
                    disabled={loading}
                    customRequest={(options) =>
                      handleUploadDocument({ ...options, category: documentType === 'cnh' ? 'CNH_BACK' : 'RG_BACK' })
                    }
                    onChange={({ file }) => {
                      if (file.status === 'done') {
                        message.success(`${file.name} enviado com sucesso.`);
                      }
                      if (file.status === 'error') {
                        message.error(`${file.name} falhou ao enviar.`);
                      }
                    }}
                    typeUpload="image"
                    details={['PNG ou JPG', 'Até 500 KB']}
                    maxSizeMB={1.8}
                    listType="picture"
                    multiple={false}
                    aria-label="Verso do documento"
                    className="[&_.ant-upload-list-item-name]:relative [&_.ant-upload-list-item-name]:block [&_.ant-upload-list-item-name]:!pr-32 [&_.ant-upload-list-item-name]:!py-2 [&_.ant-upload-list-item-name]:overflow-hidden [&_.ant-upload-list-item-name]:text-ellipsis [&_.ant-upload-list-item-name]:whitespace-nowrap [&_.ant-upload-list-item-extra]:absolute [&_.ant-upload-list-item-extra]:right-0 [&_.ant-upload-list-item-extra]:top-1/2 [&_.ant-upload-list-item-extra]:-translate-y-1/2 [&_.ant-upload-list-item-extra]:shrink-0"
                    showUploadList={{
                      showPreviewIcon: false,
                      showRemoveIcon: false,
                      extra: (file) => (
                        <div className="flex items-center gap-2">
                          {refreshingStatus ? (
                            <Skeleton.Button active size="small" className="!w-[70px] !h-[22px]" />
                          ) : (
                            DocumentStatusTag[file.response?.status as SellerDocumentStatus] || null
                          )}
                          {file.response?.status !== 'approved' && (
                            <Dropdown
                              disabled={loading || file.response?.status === 'approved'}
                              menu={{
                                items: [
                                  {
                                    label: 'Remover imagem',
                                    key: 'remove',
                                    icon: <Trash size={14} className="text-slate-600" />,
                                    onClick: (e) => {
                                      e.domEvent.stopPropagation();
                                      handleRemoveFile(
                                        documentType === 'cnh' ? 'cnh_back' : 'rg_back',
                                        documentType === 'cnh' ? cnhBackValue : rgBackValue,
                                        file,
                                      );
                                    },
                                  },
                                ],
                              }}
                              trigger={['click']}
                            >
                              <Button
                                variant="outlined"
                                size="small"
                                icon={<EllipsisVertical size={14} className="text-slate-500" />}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Dropdown>
                          )}
                        </div>
                      ),
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
            )}
          </Form>
        </BoxContrasted>
      </div>
    </div>
  );
};

const DocumentStatusTag: Record<SellerDocumentStatus, ReactNode> = {
  pending: <Tag color="gold">Pendente</Tag>,
  approved: <Tag color="green">Aprovado</Tag>,
  rejected: <Tag color="red">Rejeitado</Tag>,
};

const rules = {
  self: [{ required: true, message: 'Campo obrigatório' }],
  document_type: [{ required: true, message: 'Campo obrigatório' }],
  front: [{ required: true, message: 'Campo obrigatório' }],
  back: [{ required: true, message: 'Campo obrigatório' }],
  cnh_full: [{ required: true, message: 'Campo obrigatório' }],
};

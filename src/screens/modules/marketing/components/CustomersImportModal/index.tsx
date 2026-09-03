import { useEffect, useState, useRef, FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  message,
  Modal,
  ModalProps,
  Steps,
  Table,
  TableProps,
  Upload,
  UploadFile,
  UploadProps,
} from 'antd';
import dayjs from 'dayjs';
import { FileSpreadsheet, FileUp, Inbox, Loader2 } from 'lucide-react';
import { Download } from 'styled-icons/boxicons-regular';
import { RootType } from 'src/store/modules/rootReducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { ImportType } from 'src/store/modules/marketing/reducer';
import { notification } from 'src/utils/helpers';
import { Button } from 'src/ui/Button';
import { Label } from 'src/ui/Label';
import { Input } from 'src/ui/Input';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { Badge } from 'src/ui/Badge';

const { Dragger } = Upload;

type CustomersImportModalProps = ModalProps;

export const CustomersImportModal: FunctionComponent<
  CustomersImportModalProps
> = (props) => {
  const dispatch = useDispatch();
  const {
    hall: { unity },
    marketing: { importCsv, lists },
  } = useSelector((state: RootType) => state);
  const downloadExampleCsvRef = useRef<HTMLAnchorElement | null>(null);
  const downloadErrorsCsvRef = useRef<HTMLAnchorElement | null>(null);
  const currentDate = dayjs().format('DD.MM.YYYY');
  const [importData, setImportData] = useState<ImportType>({
    name: '',
    file: '',
  });

  const columns: TableProps['columns'] = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Aniversário',
      dataIndex: 'birthdate',
      key: 'birthdate',
    },
    {
      title: 'Erro no campo de nome',
      dataIndex: ['error', 'name_required'],
      key: 'error.name_required',
    },
    {
      title: 'Erro no campo de telefone',
      dataIndex: ['error', 'mobile_required'],
      key: 'error.mobile_required',
    },
    {
      title: 'Erro no campo de aniversário',
      dataIndex: ['error', 'mobile_format'],
      key: 'error.mobile_format',
    },
    {
      title: 'Erro no campo de email',
      dataIndex: ['error', 'email_format'],
      key: 'error.email_format',
    },
    {
      title: 'Erro no campo de aniversário',
      dataIndex: ['error', 'birthdate_format'],
      key: 'error.birthdate_format',
    },
  ];

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: 'text/csv',
    customRequest: ({ file, onProgress, onSuccess }) => {
      handleInputFile(file, onProgress, onSuccess);
    },
    maxCount: 1,
    onChange(info) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`Arquivo ${info.file.name} carregado com sucesso.`);
      } else if (status === 'error') {
        message.error(`Carregamento do arquivo ${info.file.name} falhou.`);
      }
    },
  };

  const handleSecondStep = () => {
    if (lists.filter((list) => list.name === importData.name).length) {
      notification.warning(
        'Atenção!',
        'Já existe uma listagem cadastrada com esse nome'
      );
      return;
    }

    dispatch(MarketingCreators.importCustomersRequest(importData));
    dispatch(MarketingCreators.setStepCustomersImport(3));
  };

  const handleInputFile = (
    file: UploadRequestOption['file'],
    onProgress: UploadRequestOption['onProgress'],
    onSuccess: UploadRequestOption['onSuccess']
  ) => {
    const fileProcessed = file as UploadFile;

    if (fileProcessed?.type !== 'text/csv') {
      notification.warning(
        'Tipo de arquivo inválido!',
        `O tipo de arquivo suportado é text/csv`
      );

      return;
    }

    setImportData((state) => {
      return { ...state, file: fileProcessed as unknown as File };
    });

    onProgress?.({ percent: 100 }, file);
    onSuccess?.({}, file);
  };

  const handleDownloadExampleCsv = () => {
    if (!unity?.id) return;
    dispatch(MarketingCreators.getCsvCustomersExampleRequest());
  };

  const handleExportCsvErrors = () => {
    if (!unity?.id || !importCsv?.importedList?.id) return;
    dispatch(
      MarketingCreators.getCsvImportCustomersErrorsRequest({
        listId: importCsv.importedList.id,
      })
    );
  };

  useEffect(() => {
    if (importCsv?.example === null) {
      return;
    }
    const downloadLink = downloadExampleCsvRef.current;
    const url = window.URL.createObjectURL(importCsv.example);

    if (downloadLink !== null) {
      downloadLink.href = url;
      downloadLink.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        dispatch(MarketingCreators.setStepCustomersImport(2));
      }, 500);
    }
  }, [importCsv?.example]);

  useEffect(() => {
    if (!importCsv?.errors?.csv) return;
    downloadErrorsCsvRef.current?.click();
  }, [importCsv?.errors?.csv]);

  useEffect(() => {
    setTimeout(() => {
      if (!importCsv?.importedList?.id || importCsv?.step !== 4) return;

      dispatch(
        MarketingCreators.getDetailsListRequest({
          listId: importCsv?.importedList?.id,
        })
      );
    }, 2000);
  }, [importCsv?.step, importCsv?.importedList?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      !importCsv?.importedList?.id ||
      importCsv?.step !== 4 ||
      importCsv?.details?.activities_total == 0
    )
      return;

    dispatch(
      MarketingCreators.getImportCustomersErrorsRequest({
        listId: importCsv?.importedList?.id,
      })
    );
  }, [importCsv?.details?.activities_total]);

  return (
    <Modal
      open={props.open}
      footer={null}
      onCancel={props.onCancel}
      width={importCsv?.step === 4 ? 800 : 520}
    >
      <div className="flex flex-col gap-6 pt-6">
        <Steps
          direction="horizontal"
          current={importCsv?.step - 1}
          items={[
            {
              title: '',
            },
            {
              title: '',
            },
            {
              title: '',
              status:
                importCsv?.step < 3
                  ? 'wait'
                  : importCsv?.step === 3
                  ? 'process'
                  : 'finish',
              icon:
                importCsv?.step === 3 ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  ''
                ),
            },
            {
              title: '',
            },
          ]}
        />

        {importCsv?.step === 1 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-700 text-lg font-semibold">
              Baixe a planilha modelo
            </h4>
            <p className="text-slate-600 font-medium">
              Faça o download da planilha base.
            </p>
            <div className="flex items-center justify-end mt-4">
              {importCsv?.example && (
                <a
                  ref={downloadExampleCsvRef}
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                  download={`lista-de-exemplo-de-importacao-${currentDate}.csv`}
                  hidden
                />
              )}
              <Button
                variant="outline"
                disabled={!!importCsv?.example || importCsv?.isLoading === true}
                onClick={handleDownloadExampleCsv}
              >
                {importCsv?.isLoading === true ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileSpreadsheet size={16} />
                )}{' '}
                Baixar planilha modelo
              </Button>
            </div>
          </div>
        )}

        {importCsv?.step === 2 && (
          <div className="flex flex-col gap-4">
            <h4 className="text-slate-700 text-lg font-semibold">
              Importe a planilha com o seus contatos
            </h4>
            <p className="text-slate-600 font-medium">
              IMPORTANTE: a importação deverá ser efetuada apenas através da
              planilha modelo.
              <br />
              <br />É importante que a planilha a ser importada fique no exato
              formato da planilha modelo.
            </p>
            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label
                htmlFor="email"
                className="before:content-['*'] before:mr-1 before:text-red-500"
              >
                Nome da lista
              </Label>
              <Input
                value={importData?.name}
                type="name"
                id="name"
                placeholder="Nome da lista de contato"
                onChange={({ target: { value } }) =>
                  setImportData((state) => {
                    return { ...state, name: value };
                  })
                }
              />
            </div>
            <Dragger {...uploadProps} className="my-4">
              <div className="w-full flex flex-col gap-4 items-center">
                <Inbox size={24} className="text-brand-700" />
                Clique ou arraste a planilha que deseja importar
              </div>
            </Dragger>
            <Button
              disabled={!importData?.name || !importData?.file}
              onClick={handleSecondStep}
            >
              <FileUp size={16} /> Importar contatos
            </Button>
          </div>
        )}

        {importCsv?.step === 3 && (
          <div className="flex flex-col gap-4">
            <p className="text-slate-600 font-medium">
              Seus contatos estão sendo importados agora. Aguarde a importação
              ser concluída.
              <br />
              <br />O processo de importação está sendo efetuado e deve ser
              concluido em instantes.
            </p>
          </div>
        )}

        {importCsv?.step === 4 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4 mb-3">
              <h4 className="text-slate-700 text-lg font-semibold">
                Revisão dos dados importados
              </h4>
              <Badge variant="secondary" className="text-sm">
                {importData?.name}
              </Badge>
            </div>
            {(importCsv?.details?.activities_total ?? null) !== null && (
              <div className="flex flex-col gap-2">
                <span className="text-base font-semibold text-slate-700">
                  Contatos inseridos
                </span>
                <p className="text-slate-600 font-medium">
                  {importCsv?.details?.activities_total! > 1
                    ? `Foram processados ${importCsv?.details?.activities_total} contatos com sucesso!`
                    : `Foi processado ${importCsv?.details?.activities_total} contato com sucesso!`}
                </p>
              </div>
            )}
            {importCsv?.isLoading === true && (
              <div className="flex items-center justify-center gap-4">
                <span className="text-slate-700">Processando dados</span>{' '}
                <Loader2 className="animate-spin" size={14} />
              </div>
            )}

            {(importCsv?.errors?.pagination?.total || 0) !== 0 && (
              <>
                <div className="flex flex-col gap-2 mb-4">
                  <span className="text-base font-semibold text-slate-700">
                    Contatos não inseridos
                  </span>
                  <p className="text-slate-600 font-medium">
                    {importCsv?.errors?.pagination?.total !== undefined &&
                    importCsv?.errors?.pagination?.total > 1
                      ? `Houve erro no processamento de ${importCsv?.errors?.pagination?.total} contatos.`
                      : `Houve erro no processamento de ${importCsv?.errors?.pagination?.total} contato.`}{' '}
                    Verifique os detalhes na listagem abaixo:
                  </p>
                </div>
                <Table
                  bordered
                  pagination={false}
                  columns={columns}
                  dataSource={importCsv?.errors?.data}
                  scroll={{ x: 'max-content' }}
                  title={() => (
                    <div className="w-full flex items-center gap-4 justify-end">
                      <Button
                        onClick={handleExportCsvErrors}
                        disabled={!importCsv?.errors?.data.length}
                      >
                        <Download /> Baixar planilha de erros
                      </Button>
                      {importCsv?.errors?.csv && (
                        <a
                          ref={downloadErrorsCsvRef}
                          href={window.URL.createObjectURL(
                            importCsv?.errors?.csv
                          )}
                          target="_blank"
                          rel="noreferrer"
                          download={`erros-lista-${importData?.name}-${currentDate}.csv`}
                          hidden
                        />
                      )}
                    </div>
                  )}
                />
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

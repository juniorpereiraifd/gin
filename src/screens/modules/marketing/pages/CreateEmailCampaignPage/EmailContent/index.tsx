import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { Input, Select, Form, Upload, UploadProps, message, UploadFile } from 'antd';
import { Switch } from 'src/stories/entry/Switch';
import { ChevronLeft, Inbox } from 'lucide-react';
import { EmailTemplate, SlugsEmailButton } from 'src/store/modules/marketing/reducer';
import { Button } from 'src/stories/general/Button';
import type { Base64 } from 'src/types';
import { Event, getDeviceType, notification } from 'src/utils/helpers';
import { PreviewEmail } from './PreviewEmail';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, convertFromHTML, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';
import { UploadRequestOption } from 'rc-upload/lib/interface';
import { RcFile } from 'antd/es/upload';

type EmailContentProps = {
  unitId: string;
  handleChangeTab: () => void;
  emailContent: {
    value: EmailTemplate;
    setValue: Dispatch<SetStateAction<EmailTemplate>>;
  };
};

type TEmailModels = {
  label: string;
  value: 'classic';
};

type ButtonNames = 'Fazer uma reserva' | 'Ver cardápio' | 'Ver restaurante' | 'Link personalizado' | '';

type TCustomButtonMessages = {
  label: ButtonNames;
  value: SlugsEmailButton | '';
};

export const EmailContent: FunctionComponent<EmailContentProps> = (props) => {
  const { unitId, handleChangeTab, emailContent } = props;
  const [form] = Form.useForm();

  const emailModels: TEmailModels[] = [{ label: 'Email padrão', value: 'classic' }];

  const customButtonMessages: TCustomButtonMessages[] = [
    {
      label: 'Fazer uma reserva',
      value: 'make-reservation',
    },
    {
      label: 'Ver cardápio',
      value: 'see-menu',
    },
    {
      label: 'Ver restaurante',
      value: 'see-restaurant',
    },
    {
      label: 'Link personalizado',
      value: 'custom-link',
    },
  ];

  const [selectedCustomButton, setSelectedCustomButton] = useState<TCustomButtonMessages | undefined>({
    label: (emailContent.value.button_name as ButtonNames) || '',
    value: emailContent.value.slug_button_name || '',
  });

  const validImage = {
    minWidth: 345,
    minHeight: 178,
  };

  const validCustomButton =
    (emailContent.value.personalized_button &&
      ((selectedCustomButton?.value === 'custom-link' &&
        !!emailContent.value.link &&
        !!emailContent.value.button_name) ||
        (!!emailContent.value.button_name && selectedCustomButton?.value !== 'custom-link'))) ||
    !emailContent.value.personalized_button;

  const hasValidEmailContentValues =
    !!emailContent.value.model &&
    !!emailContent.value.image &&
    !!emailContent.value.subject &&
    !!emailContent.value.title &&
    !!emailContent.value.body &&
    validCustomButton;

  const changeInputFile = (
    file: UploadRequestOption['file'],
    onProgress: UploadRequestOption['onProgress'],
    onSuccess: UploadRequestOption['onSuccess'],
    onError: UploadRequestOption['onError']
  ) => {
    const fileProcessed = file as UploadFile;

    if (fileProcessed.type && !fileProcessed.type.includes('image')) {
      notification.warning('O arquivo deve ser uma imagem!', '');
      onError?.(new Error('O arquivo deve ser uma imagem!'));

      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file as RcFile);
    reader.addEventListener('load', (event) => {
      const _loadedImageUrl = event.target?.result;
      const image = new Image();
      image.src = _loadedImageUrl as string;

      image.addEventListener('load', () => {
        const { width, height } = image;

        if (width < validImage.minWidth || height < validImage.minHeight) {
          onError?.(new Error('Dimensões de imagem inválidas.'));

          return notification.warning(
            'Dimensões de imagem inválidas',
            `A imagem enviada possui dimensões de ${width}x${height}px, e precisa ser de no mínimo ${validImage.minWidth}x${validImage.minHeight}px.`,
            {
              duration: 5,
            }
          );
        }

        emailContent.setValue((state) => {
          return {
            ...state,
            image: {
              name: fileProcessed.name,
              content: reader.result as Base64,
            },
          };
        });

        onProgress?.({ percent: 100 }, file);
        onSuccess?.({}, file);
      });
    });

    reader.addEventListener('error', (error) => {
      onError?.(error);

      emailContent.setValue((state) => {
        return {
          ...state,
          image: null,
        };
      });

      return notification.error('Erro ao carregar a imagem', 'Tente novamente mais tarde.');
    });
  };

  const blurEvent = (value: string | { name: string; content: string | Base64 } | undefined | null, event: string) => {
    value &&
      Event.push(event, {
        unit_id: unitId,
        device_type: getDeviceType(),
      });
  };

  const saveEmail = () => {
    Event.push('admin_crm_campaign_email_save_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
    });
    handleChangeTab();
  };

  useEffect(() => {
    emailContent.setValue((state) => {
      return {
        ...state,
        button_name: selectedCustomButton?.label ?? '',
        slug_button_name: selectedCustomButton?.value ?? '',
      };
    });
  }, [selectedCustomButton]); // eslint-disable-line react-hooks/exhaustive-deps

  const blocksFromHTML = convertFromHTML(emailContent?.value?.body);
  const state = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.jpeg, .png, .svg, .gif',
    customRequest: ({ file, onProgress, onSuccess, onError }) => {
      changeInputFile(file, onProgress, onSuccess, onError);
    },
    onChange(info) {
      const { status } = info.file;

      if (status === 'done') {
        message.success(`Imagem ${info.file.name} carregada com sucesso.`);
      }
    },
    onRemove() {
      emailContent.setValue((state) => {
        return {
          ...state,
          image: null,
        };
      });
    },
  };

  return (
    <PageContainer className="grid-cols-5 grid-row-2 gap-4 h-fit items-start">
      <Button className="row-start-1 text-slate-600 w-fit" variant="filled" onClick={handleChangeTab}>
        <ChevronLeft size={14} />
        Voltar
      </Button>
      <BoxContrasted className="col-span-3 row-start-2">
        <div className="flex flex-col gap-1 mb-6">
          <Heading level="4" className="text-lg">
            Conteúdo do e-mail
          </Heading>
          <p className="text-sm text-slate-500">
            Preencha todos os campos e salve o e-mail para incluí-lo a sua campanha.
          </p>
        </div>
        <Form
          form={form}
          onFinish={console.log}
          layout="vertical"
          className="[&_.ant-form-item-extra]:text-xs [&_.ant-form-item-extra]:mt-1"
        >
          <Form.Item label="Modelo" name="model" required>
            <Select
              maxTagCount="responsive"
              allowClear
              showSearch
              placeholder="Email padrão"
              value={emailContent.value.model ?? undefined}
              onChange={(value) =>
                emailContent.setValue((state) => {
                  return { ...state, model: (value as string) ?? '' };
                })
              }
              onBlur={() => {
                blurEvent(emailContent.value.model, 'admin_crm_campaign_template_select');
              }}
            >
              {emailModels.map((model) => (
                <Select.Option value={model.value} key={model.value}>
                  {model.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Imagem" required>
            <Upload.Dragger {...uploadProps}>
              <div className="w-full flex flex-col gap-4 items-center">
                <Inbox size={24} className="text-slate-700" />
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm text-slate-600">Clique ou arraste a imagem que deseja importar</p>
                  <p className="text-xs text-slate-500">Arquivos suportados: jpeg, png, svg ou gif.</p>
                </div>
              </div>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="Assunto do e-mail" extra="O que aparece na caixa de entrada do e-mail." required>
            <Input
              placeholder="Temos um presente para você"
              value={emailContent.value.subject}
              onChange={({ target: { value } }) =>
                emailContent.setValue((state) => {
                  return { ...state, subject: value };
                })
              }
              onBlur={({ target: { value } }) => blurEvent(value, 'admin_crm_campaign_email_subject_enter')}
            />
          </Form.Item>
          <Form.Item label="Titulo do e-mail" extra="O título que começa a mensagem do seu e-mail." required>
            <Input
              placeholder="Seu aniversário está chegando!"
              value={emailContent.value.title}
              onChange={({ target: { value } }) =>
                emailContent.setValue((state) => {
                  return { ...state, title: value };
                })
              }
              onBlur={({ target: { value } }) => {
                blurEvent(value, 'admin_crm_campaign_email_title_enter');
              }}
            />
          </Form.Item>
          <Form.Item
            label="Mensagem"
            required
            className={
              '[&_.editor]:h-80 [&_.editor]:text-slate-700 [&_.editor]:border [&_.editor]:border-gray-300' +
              ' [&_.editor]:rounded-md [&_.editor]:px-2 [&_.editor]:overflow-auto [&_.editor]:focus-within:border-gray-400' +
              ' [&_.editor]:focus-within:shadow-sm [&_.editor]:focus-within:ring-1 [&_.editor]:focus-within:ring-blue-200' +
              ' [&_.editor]:focus-within:ring-opacity-50 [&_.editor-toolbar]:border [&_.editor-toolbar]:border-gray-300' +
              ' [&_.editor-toolbar]:rounded-md [&_.editor-toolbar]:text-slate-600'
            }
          >
            <Editor
              placeholder="Para comemorar este dia especial, estamos te
            presenteando com qualquer uma das nossas
            sobremesas! Faça agora sua reserva e venha
            comemorar este dia tão especial! "
              onBlur={() => {
                blurEvent(emailContent.value.body, 'admin_crm_campaign_email_message_enter');
              }}
              defaultEditorState={EditorState.createWithContent(state)}
              onEditorStateChange={(editorState) => {
                emailContent.setValue((state) => {
                  return {
                    ...state,
                    body: stateToHTML(editorState.getCurrentContent()),
                  };
                });
              }}
              editorClassName="editor"
              toolbarClassName="editor-toolbar"
              toolbar={{
                options: ['inline', 'blockType'],
                inline: {
                  inDropdown: false,
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                  options: ['bold', 'italic', 'underline', 'strikethrough'],
                },
                blockType: {
                  inDropdown: true,
                  options: ['Normal', 'H1', 'H2', 'H3', 'H4'],
                  className: undefined,
                  component: undefined,
                  dropdownClassName: undefined,
                },
              }}
            />
          </Form.Item>
          <div className="flex flex-col">
            <div className="mb-4">
              <Switch
                title="Ativar/Inativar"
                label="Botão personalizado"
                size="default"
                checked={emailContent.value.personalized_button}
                onChange={(value: boolean) => {
                  Event.push('admin_crm_campaign_email_button_click', {
                    unit_id: unitId,
                    device_type: getDeviceType(),
                  });
                  emailContent.setValue((state) => {
                    return {
                      ...state,
                      personalized_button: value,
                    };
                  });
                }}
              />
            </div>
            {emailContent.value.personalized_button && (
              <>
                <Form.Item label="Nome do botão" required className="w-full">
                  <Select
                    maxTagCount="responsive"
                    allowClear
                    showSearch
                    placeholder="ex: Instagram do restaurante"
                    value={emailContent.value.slug_button_name}
                    onChange={(value) => {
                      setSelectedCustomButton(
                        customButtonMessages.find((button) => button.value === value) ?? undefined
                      );
                    }}
                    onBlur={() =>
                      emailContent.value.personalized_button &&
                      Event.push('admin_crm_campaign_email_button_type_select', {
                        unit_id: unitId,
                        device_type: getDeviceType(),
                        type_selected: emailContent.value.button_name,
                      })
                    }
                  >
                    {customButtonMessages.map((message) => (
                      <Select.Option value={message.value} key={message.value}>
                        {message.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {selectedCustomButton?.value === 'custom-link' && (
                  <div className="w-full grid grid-cols-2 gap-4">
                    <Form.Item
                      label="Texto do botão"
                      extra="O texto que será exibido no seu botão com link personalizado"
                      required
                      className="w-full"
                    >
                      <Input
                        placeholder="Visitar site"
                        value={emailContent.value.button_name}
                        onChange={({ target: { value } }) =>
                          emailContent.setValue((state) => {
                            return {
                              ...state,
                              button_name: value,
                            };
                          })
                        }
                      />
                    </Form.Item>
                    <Form.Item label="Link para o botão" extra="O link que será destinado ao clicar no botão." required>
                      <Input
                        placeholder="ex: instagram.com/restaurante"
                        value={emailContent.value.link}
                        onChange={({ target: { value } }) =>
                          emailContent.setValue((state) => {
                            return {
                              ...state,
                              link: value,
                            };
                          })
                        }
                        onBlur={({ target: { value } }) =>
                          value &&
                          Event.push('admin_crm_campaign_email_button_link_enter', {
                            unit_id: unitId,
                            device_type: getDeviceType(),
                            link_content: value,
                          })
                        }
                      />
                    </Form.Item>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="flex justify-end">
            <Button disabled={!hasValidEmailContentValues} onClick={saveEmail}>
              Salvar e-mail
            </Button>
          </div>
        </Form>
      </BoxContrasted>
      <BoxContrasted className="h-fit min-h-2/3 col-span-2 row-start-2">
        <section className="h-full flex flex-col gap-6">
          <Heading level="4" className="text-lg">
            Pré-visualização do e-mail
          </Heading>
          <PreviewEmail emailContent={emailContent.value} size="lg" />
        </section>
      </BoxContrasted>
    </PageContainer>
  );
};

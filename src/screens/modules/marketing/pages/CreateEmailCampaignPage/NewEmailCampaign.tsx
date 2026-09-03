import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import { DatePicker, Form, Input, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import api from 'src/services/api';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { EmailTemplate, Segmentation } from 'src/store/modules/marketing/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { Select } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Event, getDeviceType, notification } from 'src/utils/helpers';
import { TEN_MINUTES_FROM_NOW } from 'src/utils/constants';
import { EmailCampaign } from '.';
import { PreviewEmail } from './EmailContent/PreviewEmail';
import { EmailTestModal } from './EmailTestModal/EmailTestModal';
import { Heading } from 'src/ui/Typograph';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Pencil, Plus, Send } from 'lucide-react';

type NewCampaignProps = {
  emailContent: EmailTemplate;
  handleChangeTab: () => void;
  unitId: string;
  campaignId?: string;
  newCampaign: {
    value: EmailCampaign;
    setValue: Dispatch<SetStateAction<EmailCampaign>>;
  };
};

export const NewEmailCampaign: FunctionComponent<NewCampaignProps> = (props) => {
  const { unitId, campaignId, newCampaign, emailContent, handleChangeTab } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isEditing = !!campaignId;
  const [form] = Form.useForm();

  const {
    marketing: { isLoading, lists },
  } = useSelector((state: RootType) => state);

  const dispatch = useDispatch();

  const today = dayjs().startOf('day');

  const hasValidEmailContentValues =
    !!emailContent.model &&
    !!emailContent.image &&
    !!emailContent.subject &&
    !!emailContent.title &&
    !!emailContent.body;

  const hasValidCampaignValues =
    !!newCampaign.value.name &&
    !!newCampaign.value.shipping_at_date &&
    !!newCampaign.value.shipping_at_time &&
    !!newCampaign.value.segmentation;

  const isInvalidTime = (date: Dayjs) =>
    (date.isBefore(TEN_MINUTES_FROM_NOW) && newCampaign.value.shipping_at_date?.isBefore(TEN_MINUTES_FROM_NOW)) ||
    false;

  const createEmailContent = () => {
    Event.push('admin_crm_campaign_create_email_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
    });
    handleChangeTab();
  };

  const sendEvent = (
    value: string,
    event: string,
    props?: {
      [key: string]: unknown;
    }
  ) => {
    value &&
      Event.push(event, {
        unit_id: unitId,
        device_type: getDeviceType(),
        ...props,
      });
  };

  const sendCampaign = () => {
    Event.push('admin_crm_campaign_email_send_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
    });

    const dateValue = dayjs(newCampaign.value.shipping_at_date, 'YYYY-MM-DD');
    const timeValue = dayjs(newCampaign.value.shipping_at_time, 'HH:mm');

    const dateAndTimeMerged = dateValue.set('hour', timeValue.hour()).set('minute', timeValue.minute());

    if (dateAndTimeMerged.isBefore(TEN_MINUTES_FROM_NOW)) {
      notification.error('Horário inválido', 'Os minutos devem ser no mínimo 10 minutos a partir de agora.');

      return;
    }

    let body = {
      campaign: {
        ...newCampaign.value,
        shipping_at_date: dayjs(newCampaign.value.shipping_at_date).format('YYYY-MM-DD'),
        shipping_at_time: dayjs(newCampaign.value.shipping_at_time).format('HH:mm'),
      },
      template: emailContent,
    };

    if (campaignId) {
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        template: { image, link, ...template },
        ...rest
      } = body;

      body = {
        ...rest,
        template: {
          image,
          ...template,
        },
      };

      if (!emailContent.image?.content) {
        body = {
          ...rest,
          template: {
            ...template,
          },
        };
      }

      if (template.slug_button_name === 'custom-link') {
        body = {
          ...body,
          template: {
            ...body.template,
            link,
          },
        };
      }

      dispatch(
        MarketingCreators.updateEmailCampaignRequest({
          id: campaignId,
          payload: body,
        })
      );
    } else {
      dispatch(
        MarketingCreators.createEmailCampaignRequest({
          ...body,
          segmentation: newCampaign.value.segmentation,
        })
      );
    }
  };

  const sendEmailTest = async (email: string) => {
    const { status } = await api.post(`/marketing/v1/units/${unitId}/campaigns/email/preview`, {
      address: email,
      template: {
        ...emailContent,
      },
    });

    if (status === 204) {
      notification.success('E-mail enviado com sucesso!', `O e-mail de teste foi enviado com sucesso para ${email}.`);
      setIsModalVisible(false);
    }
  };

  useEffect(() => {
    if (newCampaign?.value?.shipping_at_date?.isBefore(today) && newCampaign?.value?.shipping_at_time?.isBefore(today))
      newCampaign.setValue((state) => {
        return { ...state, shipping_at_time: null };
      });
  }, [newCampaign?.value?.shipping_at_date]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!unitId) return;
    dispatch(MarketingCreators.getListsRequest());
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContainer className="grid-cols-5 grid-row-2 gap-4 h-fit items-start">
      <BoxContrasted className="col-span-3 row-start-2 flex flex-col justify-between">
        <div>
          <div className="flex flex-col gap-1 mb-6">
            <Heading level="4" className="text-lg">
              {isEditing ? 'Editar' : 'Criar'} campanha de e-mail
            </Heading>
            <p className="text-sm text-slate-500">
              {isEditing ? 'Editar a' : 'Crie uma nova'} campanha de e-mail preenchendo os campos abaixo.
            </p>
          </div>
          <Form
            form={form}
            layout="vertical"
            className="[&_.ant-form-item-extra]:text-xs [&_.ant-form-item-extra]:mt-1"
          >
            <Form.Item
              label="Nome da campanha"
              extra="Defina um nome para sua campanha, ele não será exibido para seus clientes."
              required
            >
              <Input
                placeholder="Email de aniversário"
                value={newCampaign.value.name}
                onChange={({ target: { value } }) =>
                  newCampaign.setValue((state) => {
                    return { ...state, name: value };
                  })
                }
                onBlur={({ target: { value } }) => sendEvent(value, 'admin_crm_campaign_name_enter')}
              />
            </Form.Item>
            <Form.Item label="Selecionar público" extra="Defina para quem será enviada a mensagem." required>
              <Select
                showSearch
                placeholder="Selecionar público"
                value={newCampaign.value.segmentation.name ?? undefined}
                disabled={isEditing}
                onChange={(value) => {
                  newCampaign.setValue((state) => {
                    return {
                      ...state,
                      segmentation: lists.find((list) => list.name === value) as Segmentation,
                    };
                  });
                }}
                onBlur={() => {
                  sendEvent(newCampaign.value.segmentation.name, 'admin_crm_campaign_audience_select');
                }}
                maxTagCount="responsive"
                allowClear
              >
                {lists.map((list) => (
                  <Select.Option value={list.name} key={list.name}>
                    {list.name === 'all'
                      ? 'Todos os clientes'
                      : list.name === 'dont_come_back_thirty'
                      ? 'Pessoas que não voltaram dentro de 30 dias'
                      : list.name === 'dont_come_back_sixty'
                      ? 'Pessoas que não voltaram dentro de 60 dias'
                      : list.name === 'dont_come_back_ninety'
                      ? 'Pessoas que não voltaram dentro de 90 dias'
                      : list.name === 'birthdays'
                      ? 'Aniversariantes do mês'
                      : list.name === 'reservation_noshow'
                      ? 'No-show reserva'
                      : list.name === 'canceled'
                      ? 'Cancelados'
                      : list.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <div className="w-full grid grid-cols-2 gap-4">
              <Form.Item label="Data de envio" extra="Escolha em qual data o email será enviado." required>
                <DatePicker
                  placeholder="00/00/00"
                  className="w-full"
                  format="DD/MM/YYYY"
                  disabledDate={(date) => date.isBefore(today)}
                  value={newCampaign.value.shipping_at_date}
                  showNow={false}
                  onChange={(value) =>
                    newCampaign.setValue((state) => {
                      return { ...state, shipping_at_date: value };
                    })
                  }
                  onBlur={({ target: { value } }) => {
                    sendEvent(value, 'admin_crm_campaign_hour_enter', {
                      date: value,
                    });
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Horário de envio"
                extra="Escolha em qual horário o email será enviado (24h)."
                tooltip={
                  'Só é possível selecionar um horário que seja pelo menos' +
                  ' 10 minutos posterior ao momento atual, por exemplo,' +
                  ' se agora são 14:30, o próximo horário disponível seria 14:40.'
                }
                required
              >
                <TimePicker
                  placeholder="00:00"
                  className="w-full"
                  format="HH:mm"
                  showNow={false}
                  minuteStep={30}
                  disabledDate={isInvalidTime}
                  value={newCampaign.value.shipping_at_time}
                  onChange={(value) =>
                    newCampaign.setValue((state) => {
                      return { ...state, shipping_at_time: value };
                    })
                  }
                  onBlur={({ target: { value } }) => {
                    sendEvent(value, 'admin_crm_campaign_date_enter', {
                      hour: value,
                    });
                  }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="text-base font-semibold">Atenção!</span>
            <p className="text-sm text-slate-500">
              Revise todos os campos preenchidos e clique em &quot;Salvar e enviar&quot; para disparar/agendar sua
              campanha de email.
            </p>
          </div>
          <Button
            loading={isLoading}
            className="w-fit self-end"
            type="primary"
            disabled={!hasValidEmailContentValues || !hasValidCampaignValues}
            onClick={sendCampaign}
          >
            Salvar e enviar
          </Button>
        </div>
        <EmailTestModal
          isVisible={isModalVisible}
          setIsVisible={setIsModalVisible}
          handleSendEmailTest={(email) => sendEmailTest(email)}
        />{' '}
      </BoxContrasted>
      <BoxContrasted className="h-fit min-h-2/3 col-span-2 row-start-2">
        <Heading level="4" className="text-lg">
          Conteúdo do e-mail
        </Heading>
        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outlined"
              disabled={undefined}
              onClick={hasValidEmailContentValues ? handleChangeTab : createEmailContent}
            >
              {hasValidEmailContentValues ? <Pencil size={14} /> : <Plus size={14} />}
              {hasValidEmailContentValues ? 'Editar' : 'Criar'} e-mail
            </Button>
            <Button variant="outlined" disabled={!hasValidEmailContentValues} onClick={() => setIsModalVisible(true)}>
              <Send size={14} />
              Enviar e-mail de teste
            </Button>
          </div>
          {hasValidEmailContentValues ? (
            <PreviewEmail emailContent={emailContent} size="sm" />
          ) : (
            <div className="flex flex-col items-center gap-2 my-6">
              <span className="text-base font-semibold text-stone-600">E-mail ainda não criado.</span>
              <p className="text-xs text-stone-500">Para criar um e-mail, clique em ”Criar e-mail”.</p>
            </div>
          )}
        </div>
      </BoxContrasted>
    </PageContainer>
  );
};

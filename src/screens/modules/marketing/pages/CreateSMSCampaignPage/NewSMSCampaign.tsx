import { DatePicker, Form, Input, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import type { NewSMSCampaignData, Segmentation } from 'src/store/modules/marketing/reducer';
import { RootType } from 'src/store/modules/rootReducer';
import { Select } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Event, getDeviceType, notification } from 'src/utils/helpers';
import { TEN_MINUTES_FROM_NOW } from 'src/utils/constants';
import { SMSEditor } from '../../components/SMSEditor';
import * as S from './styles';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Heading } from 'src/ui/Typograph';
import { Send } from 'lucide-react';

export type SMSCampaign = {
  name: string;
  shipping_at_date: Dayjs | null;
  shipping_at_time: Dayjs | null;
  segmentation: Segmentation;
  smsText: string;
  textSize: number;
};

type NewSMSCampaignProps = {
  unitId: string;
  campaignId?: string;
};

export const NewSMSCampaign: FunctionComponent<NewSMSCampaignProps> = (props) => {
  const { unitId, campaignId } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const isEditing = !!campaignId;

  const {
    marketing: { isLoading, smsCampaigns, lists },
  } = useSelector((state: RootType) => state);

  const campaign = isEditing ? smsCampaigns.data.find((sms) => sms.id === campaignId) : null;

  const today = dayjs().startOf('day');

  const [SMSTestModalIsVisible, setSMSTestModalIsVisible] = useState(false);

  const [smsCampaign, setSMSCampaign] = useState<SMSCampaign>({
    name: campaign?.name || '',
    shipping_at_date: dayjs(campaign?.shipping_at_date),
    shipping_at_time: campaign ? dayjs(campaign.shipping_at_time, 'HH:mm') : null,
    segmentation: campaign
      ? {
          id: '',
          name: campaign?.segmentation || '',
        }
      : lists[0],
    smsText: campaign?.template.body || '',
    textSize: 0,
  });

  const hasValidCampaignValues =
    !!smsCampaign.name &&
    !!smsCampaign.shipping_at_date &&
    !!smsCampaign.shipping_at_time &&
    !!smsCampaign.segmentation &&
    !!smsCampaign.smsText &&
    smsCampaign.textSize <= 150;

  const isInvalidTime = (date: Dayjs) =>
    (date.isBefore(TEN_MINUTES_FROM_NOW) && smsCampaign.shipping_at_date?.isBefore(TEN_MINUTES_FROM_NOW)) || false;

  const sendCampaign = () => {
    Event.push('admin_crm_campaign_email_send_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
    });

    const dateValue = dayjs(smsCampaign.shipping_at_date, 'YYYY-MM-DD');
    const timeValue = dayjs(smsCampaign.shipping_at_time, 'HH:mm');

    const dateAndTimeMerged = dateValue.set('hour', timeValue.hour()).set('minute', timeValue.minute());

    if (dateAndTimeMerged.isBefore(TEN_MINUTES_FROM_NOW)) {
      notification.error('Horário inválido', 'Os minutos devem ser no mínimo 10 minutos a partir de agora.');

      return;
    }

    const newSMSCampaign: NewSMSCampaignData = {
      campaign: {
        name: smsCampaign.name,
        segmentation: smsCampaign.segmentation,
        shipping_at_date: dayjs(smsCampaign.shipping_at_date).format('YYYY-MM-DD'),
        shipping_at_time: dayjs(smsCampaign.shipping_at_time).format('HH:mm'),
      },
      template: { body: smsCampaign.smsText },
    };

    if (campaign) {
      dispatch(
        MarketingCreators.updateSMSCampaignRequest({
          id: campaign.id,
          payload: newSMSCampaign,
        })
      );
    } else {
      dispatch(
        MarketingCreators.createSMSCampaignRequest({
          ...newSMSCampaign,
          segmentation: smsCampaign.segmentation,
        })
      );
    }
  };

  useEffect(() => {
    if (unitId) dispatch(MarketingCreators.getSMSVariablesRequest());
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!unitId) return;
    dispatch(MarketingCreators.getListsRequest());
  }, [unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BoxContrasted>
      <div className="flex flex-col gap-1 mb-6">
        <Heading level="4" className="text-lg">
          {isEditing ? 'Editar' : 'Criar'} campanha de SMS
        </Heading>
        <p className="text-sm text-slate-500">
          {isEditing ? 'Edite a' : 'Crie uma nova'} campanha de SMS preenchendo os campos abaixo.
        </p>
      </div>
      <Form form={form} layout="vertical" className="[&_.ant-form-item-extra]:text-xs [&_.ant-form-item-extra]:mt-1">
        <Form.Item
          label="Nome da campanha"
          extra="Defina um nome para sua campanha, ele não será exibido para seus clientes."
          required
        >
          <Input
            value={smsCampaign.name}
            onChange={({ target: { value } }) =>
              setSMSCampaign((state) => {
                return { ...state, name: value };
              })
            }
          />
        </Form.Item>
        <Form.Item label="Selecionar público" extra="Defina para quem será enviada a mensagem." required>
          <S.Select
            showSearch
            placeholder="Selecionar público"
            disabled={isEditing}
            value={campaign?.segmentation}
            onChange={(value) =>
              setSMSCampaign((state) => {
                return {
                  ...state,
                  segmentation: lists.find((list) => list.name === value) as Segmentation,
                };
              })
            }
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
          </S.Select>
        </Form.Item>
        <div className="w-full grid grid-cols-2 gap-4">
          <Form.Item label="Data de envio" extra="Escolha em qual data o sms será enviado.">
            <DatePicker
              className="w-full"
              placeholder="00/00/00"
              format="DD/MM/YYYY"
              disabledDate={(date) => date.isBefore(today)}
              value={smsCampaign.shipping_at_date}
              showNow={false}
              onChange={(value) =>
                setSMSCampaign((state) => {
                  return { ...state, shipping_at_date: value };
                })
              }
            />
          </Form.Item>
          <Form.Item
            label="Horário de envio"
            extra="Escolha em qual horário o sms será enviado (24h)."
            tooltip={
              'Só é possível selecionar um horário que seja pelo menos' +
              ' 10 minutos posterior ao momento atual, por exemplo,' +
              ' se agora são 14:30, o próximo horário disponível seria 14:40.'
            }
          >
            <TimePicker
              className="w-full"
              placeholder="00:00"
              format="HH:mm"
              showNow={false}
              minuteStep={30}
              inputReadOnly
              disabledDate={isInvalidTime}
              value={smsCampaign.shipping_at_time}
              onChange={(value) => {
                setSMSCampaign((state) => {
                  return { ...state, shipping_at_time: value };
                });
              }}
            />
          </Form.Item>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-semibold">Conteúdo do SMS</span>
          <Button
            variant="outlined"
            onClick={() => setSMSTestModalIsVisible(true)}
            disabled={smsCampaign.textSize > 150}
          >
            <Send size={14} />
            Enviar SMS teste
          </Button>
        </div>
        <SMSEditor
          campaign={campaign}
          variables={smsCampaigns.variables}
          handleChangeSMSValue={(smsText) => setSMSCampaign((state) => ({ ...state, smsText }))}
          handleChangeSMSTextSize={(textSize) => setSMSCampaign((state) => ({ ...state, textSize }))}
          smsTestModal={{
            value: SMSTestModalIsVisible,
            setValue: setSMSTestModalIsVisible,
          }}
        />
        <div className="w-full flex items-center justify-end mt-6">
          <Button loading={isLoading} disabled={!hasValidCampaignValues} onClick={sendCampaign}>
            Salvar e enviar
          </Button>
        </div>
      </Form>
    </BoxContrasted>
  );
};

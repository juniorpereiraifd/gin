import { Tooltip } from 'antd';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Lock } from '@styled-icons/boxicons-solid/Lock';
import api from 'src/services/api';
import { Creators as ComunicationCreators } from 'src/store/modules/comunication/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Tabs } from 'src/stories/display/Tabs';
import Loading from 'src/stories/feedback/Loading';
import { getPhoneNumberWithNationalCode, getStringIgnoringAccents, notification } from 'src/utils/helpers';
import * as Response from 'src/utils/response';
import { GETIN_WHATSAPP_CONTACT } from 'src/utils/constants';
import { MessageEdit, SubmitValues } from 'src/components/Comunication/MessageEdit';
import { ComunicationSettingsSection } from 'src/components/Comunication/CommunicationSettingsSection';
import { ComunicationSettingsSwitches } from 'src/components/Comunication/CommunicationSettingsSwitches';
import { ComunicationContactModal } from 'src/components/Comunication/ComunicationContactModal';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import * as S from './styles';

const TabKeysComunication = {
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  COMMUNICATION_SETTINGS: 'communication_settings',
};

export const ComunicationLinePage = () => {
  const dispatch = useDispatch();
  const {
    comunication: { smsMessageData, settings, loading },
  } = useSelector((state: RootType) => state);
  const { unitId } = useParams<'line.comunication'>();

  const [modalContactIsVisible, setModalContactIsVisible] = useState(false);
  const [tab, setTab] = useState(
    settings?.custom_sms_enabled ? TabKeysComunication.SMS : TabKeysComunication.COMMUNICATION_SETTINGS
  );

  useEffect(() => {
    dispatch(
      ComunicationCreators.getSmsMessageDataRequest({
        service: 'line',
        unitId,
      })
    );
    dispatch(
      ComunicationCreators.getSettingsMessageRequest({
        unitId,
      })
    );
    setTimeout(() => {
      dispatch(
        ComunicationCreators.getSmsMessageDataRequest({
          service: 'reservation',
          unitId,
        })
      );
    }, 1000);
  }, [dispatch]);

  const handleCustomMessage = (values: SubmitValues) => {
    notification.warning('Solicitação de configuração de mensagem em andamento', '');
    const customSmsValues: { [key: string]: { [key: string]: string } } = {};

    if (Object.keys(customSmsValues).indexOf(values.type) >= 0) {
      Object.defineProperty(customSmsValues[values.type], values.key, {
        enumerable: true,
        configurable: true,
        value: values.value,
      });
    } else {
      Object.defineProperty(customSmsValues, values.type, {
        enumerable: true,
        value: {},
      });

      Object.defineProperty(customSmsValues[values.type], values.key, {
        enumerable: true,
        configurable: true,
        value: values.value,
      });
    }

    if (settings) {
      if (Object.keys(settings?.custom_sms).indexOf(values.type) >= 0) {
        const keysThatNotChanged = Object.keys(settings?.custom_sms[values.type]).filter((key) => key !== values.key);

        keysThatNotChanged.forEach((key) => {
          Object.defineProperty(customSmsValues[values.type], key, {
            enumerable: true,
            value: settings?.custom_sms[values.type][key],
          });
        });
      }

      const messageDefault = smsMessageData['line'].filter((item) => item.type === values.key)[0].default;

      if (values.value.toLowerCase() === getStringIgnoringAccents(messageDefault)) {
        delete customSmsValues[values.type][values.key];
      }

      return dispatch(
        ComunicationCreators.editSettingsMessageRequest({
          customSmsData: customSmsValues,
          unitId,
          settingId: settings.id,
        })
      );
    }

    return notification.error(
      'Erro ao editar as configurações',
      'Tente novamente e caso o problema persista entre em contato com o nosso suporte.'
    );
  };

  const handleSendSmsTest = async (phone: string, type: string, messageType: string, message: string) => {
    const body: {
      mobile: string;
      custom_sms: { [key: string]: { [key: string]: string } };
    } = {
      mobile: getPhoneNumberWithNationalCode(phone),
      custom_sms: {},
    };

    Object.defineProperty(body.custom_sms, type, {
      enumerable: true,
      value: {},
    });
    if (body.custom_sms[type]) {
      Object.defineProperty(body.custom_sms[type], messageType, {
        enumerable: true,
        value: message,
      });
    }

    const { status } = await api.post(`/message/v1/units/${unitId}/sms/preview`, body);

    if (status === Response.NO_CONTENT) {
      notification.success('Mensagem teste enviada com sucesso!', '');
    } else {
      notification.success(
        'Houve algum problema no envio do sms!',
        'Tente enviar novamente e caso o problema persista entre em contato com o nosso suporte.'
      );
    }
  };

  const customSmsPanel = () => (
    <S.Pane
      key={TabKeysComunication.SMS}
      disabled={settings?.custom_sms_enabled === false}
      tab={
        settings?.custom_sms_enabled === false ? (
          <Tooltip
            placement="right"
            title="Esta funcionalidade está desabilitada para a sua conta. Clique no cadeado para solicitar o contato com a nossa equipe comercial."
          >
            <S.TabTitle onClick={() => setModalContactIsVisible(true)}>
              <Lock size={16} /> Customização de SMS
            </S.TabTitle>
          </Tooltip>
        ) : (
          'Customização de SMS'
        )
      }
    >
      <S.WrapperSms>
        <S.Title level={3}>Customização de SMS</S.Title>
        <p className="description">
          Personalize as mensagens de texto para criar uma experiência única para seus clientes. Ajuste o conteúdo dos
          SMS de acordo com as preferências do seu restaurante.
        </p>
        <MessageEdit
          experienceType="line"
          type="sms"
          defaultMessage={smsMessageData.line.length ? smsMessageData.line[0].type : ''}
          listMessages={smsMessageData.line}
          listMessagesUpdated={
            settings?.custom_sms && Object.keys(settings?.custom_sms).indexOf('line') >= 0
              ? settings?.custom_sms['line']
              : {}
          }
          handleSubmit={handleCustomMessage}
          handleSendSmsTest={handleSendSmsTest}
        />
      </S.WrapperSms>
    </S.Pane>
  );

  const settingsPanel = () => (
    <S.Pane tab="Configurações" key={TabKeysComunication.COMMUNICATION_SETTINGS}>
      <ComunicationSettingsSection>
        <ComunicationSettingsSwitches
          title="Fila"
          service="line"
          unitId={unitId}
          whatsapp={{
            enabled: true,
            price: import.meta.env.VITE_WHATSAPP_COMMUNICATION_LINE_PRICE,
          }}
        />
      </ComunicationSettingsSection>
    </S.Pane>
  );

  const getCorrectSequencePanel = () => {
    if (settings?.custom_sms_enabled === true) {
      return (
        <Fragment>
          {customSmsPanel()}
          {settingsPanel()}
        </Fragment>
      );
    }

    return (
      <Fragment>
        {settingsPanel()}
        {customSmsPanel()}
      </Fragment>
    );
  };

  return (
    <PageContainer>
      <PageTitle>Comunicação</PageTitle>
      <S.Wrapper>
        {loading ? (
          <S.LoadingWrapper>
            <Loading size={35} />
          </S.LoadingWrapper>
        ) : (
          <Tabs onTabClick={(tab: string) => setTab(tab)} defaultActiveKey={tab}>
            {getCorrectSequencePanel()}
          </Tabs>
        )}
      </S.Wrapper>
      <ComunicationContactModal
        type="line"
        isModalContactVisible={modalContactIsVisible}
        setModalContactIsVisible={setModalContactIsVisible}
        primaryAction={() => window.open(GETIN_WHATSAPP_CONTACT, '_blank')}
        secondaryAction={() => setModalContactIsVisible(false)}
      />
    </PageContainer>
  );
};

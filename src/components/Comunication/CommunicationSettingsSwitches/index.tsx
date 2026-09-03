import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as ComunicationCreators } from 'src/store/modules/comunication/actions';
import { CommunicationService } from 'src/store/modules/comunication/reducer';
import { SettingsMessageProps } from 'src/store/modules/comunication/reducer';
import { Switch } from 'src/stories/entry/Switch';
import * as S from './styles';

export type ParamProps = {
  unity: string;
};

type HandleUpdateCommunicationSettingsProps = {
  value: boolean;
  channel: 'sms' | 'email' | 'push' | 'whatsapp';
};

type WhatsAppConfig = {
  enabled: boolean;
  price: string;
};

type ComunicationSettingsSwitchesProps = {
  title: string;
  service: CommunicationService;
  unitId: string;
  disabled?: boolean;
  whatsapp?: WhatsAppConfig;
};

export const ComunicationSettingsSwitches: FunctionComponent<ComunicationSettingsSwitchesProps> = ({
  title,
  service,
  unitId,
  disabled,
  whatsapp,
}) => {
  const dispatch = useDispatch();
  const {
    comunication: { settings },
  } = useSelector((state: RootType) => state);
  const { user } = useSelector((state: RootType) => state.auth);
  const isAdmin = user?.master === true;
  const [communicationValues, setCommunicationValues] = useState({
    sms: false,
    email: false,
    whatsapp: false,
  });

  useEffect(() => {
    if (settings !== null) {
      const { defaultCheckedSms, defaultCheckedEmail, defaultCheckedWhatsapp } = getDefaultChecked(settings, service);

      setCommunicationValues({
        sms: defaultCheckedSms,
        email: defaultCheckedEmail,
        whatsapp: defaultCheckedWhatsapp,
      });
    }
  }, [settings]);

  const handleUpdateCommunicationSettings = ({ value, channel }: HandleUpdateCommunicationSettingsProps) => {
    dispatch(
      ComunicationCreators.updateMessageSendingRequest({
        unitId: unitId,
        channel: channel,
        service: service,
        value: value,
      }),
    );
  };

  return (
    <S.Sector>
      <span className="title">{title}</span>
      <S.WrapperSwitch>
        <Switch
          align="top"
          value={communicationValues.sms}
          disabled={disabled}
          onChange={(value) => {
            setCommunicationValues({
              ...communicationValues,
              sms: value,
            });
            handleUpdateCommunicationSettings({
              value: value,
              channel: 'sms',
            });
          }}
          label={
            <S.SwitchLabelDetail>
              <span>Habilitar o envio de SMS</span>
              <span className="label-description">R$ 0,10 por SMS adicional ao pacote contratado.</span>
            </S.SwitchLabelDetail>
          }
        />
        <Switch
          align="top"
          value={communicationValues.email}
          disabled={disabled}
          onChange={(value) => {
            setCommunicationValues({
              ...communicationValues,
              email: value,
            });
            handleUpdateCommunicationSettings({
              value: value,
              channel: 'email',
            });
          }}
          label={
            <S.SwitchLabelDetail>
              <span>Habilitar o envio de email</span>
              <span className="label-description">
                R$ 25 a cada 5.000 e-mails enviados adicionais ao pacote contratado.
              </span>
            </S.SwitchLabelDetail>
          }
        />
        {whatsapp?.enabled && (
          <Switch
            align="top"
            value={communicationValues.whatsapp}
            disabled={disabled || !isAdmin}
            onChange={(value) => {
              setCommunicationValues({
                ...communicationValues,
                whatsapp: value,
              });
              handleUpdateCommunicationSettings({
                value: value,
                channel: 'whatsapp',
              });
            }}
            label={
              <S.SwitchLabelDetail>
                <span>Habilitar o envio de Whatsapp</span>
                <span className="label-description">
                  {whatsapp.price} por Whatsapp adicional ao pacote contratado.
                  {!communicationValues.whatsapp && !isAdmin && (
                    <>
                      <br />
                      <br />
                      BETA: Caso tenha interesse na funcionalidade entre em contato com seu gerente de conta.
                    </>
                  )}
                </span>
              </S.SwitchLabelDetail>
            }
          />
        )}
      </S.WrapperSwitch>
    </S.Sector>
  );
};

const getDefaultChecked = (settings: SettingsMessageProps | null, service: CommunicationService) => {
  let defaultCheckedSms = false;
  let defaultCheckedEmail = false;
  let defaultCheckedWhatsapp = false;

  if (settings !== null && 'channels' in settings) {
    if (settings.channels.sms && service in settings.channels.sms) {
      defaultCheckedSms = settings.channels.sms[service];
    }

    if (settings.channels.email && service in settings.channels.email) {
      defaultCheckedEmail = settings.channels.email[service];
    }

    if (settings.channels.whatsapp && service in settings.channels.whatsapp) {
      defaultCheckedWhatsapp = settings.channels.whatsapp[service];
    }
  }

  return { defaultCheckedSms, defaultCheckedEmail, defaultCheckedWhatsapp };
};

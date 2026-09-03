import { Form, Switch } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as VouchersCreators } from 'src/store/modules/voucher/actions';
import { VoucherCommunicationService } from 'src/store/modules/voucher/reducer';
import { Creators as ComunicationCreators } from 'src/store/modules/comunication/actions';
import { ComunicationSettingsSection } from 'src/components/Comunication/CommunicationSettingsSection';
import { ComunicationSettingsSwitches } from 'src/components/Comunication/CommunicationSettingsSwitches';
import * as S from './styles';
import Loading from 'src/stories/feedback/Loading';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';

export const VoucherCommunicationPage = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'voucher.comunication'>();
  const {
    hall: { unity },
    comunication: { loading: loadingComunication },
    voucher: { loadingSettings, settings },
  } = useSelector((state: RootType) => state);
  const isLoadingCommunicationSettings = loadingSettings === true || loadingComunication === true;

  useEffect(() => {
    if (unity) dispatch(VouchersCreators.getVoucherSettingsRequest());
  }, [unity]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(
      ComunicationCreators.getSettingsMessageRequest({
        unitId,
      })
    );
  }, [dispatch]);

  const handleChange = (value: boolean, service: VoucherCommunicationService) => {
    if (unity !== null && settings !== null) {
      dispatch(
        VouchersCreators.updateVoucherSettingsRequest({
          [`giftback_${service}_enabled`]: value,
        })
      );
    }
  };

  return (
    <>
      {isLoadingCommunicationSettings === true ? (
        <PageContainer>
          <S.LoadingWrapper>
            <Loading size={35} />
          </S.LoadingWrapper>
        </PageContainer>
      ) : (
        <PageContainer>
          <PageTitle>Comunicação</PageTitle>
          <ComunicationSettingsSection scope="voucher">
            <S.Sector>
              <span className="title">Enviar para</span>
              <S.WrapperSwitch>
                <Form.Item name="giftback_nps_enabled" valuePropName="checked">
                  <Switch
                    defaultChecked={settings?.giftback_nps_enabled}
                    disabled={isLoadingCommunicationSettings}
                    onChange={(checked) => handleChange(checked, 'nps')}
                  />
                </Form.Item>
                <span>Clientes que responderam Pesquisa de Satisfação</span>
              </S.WrapperSwitch>
              <S.WrapperSwitch>
                <Form.Item name="giftback_line_enabled" valuePropName="checked">
                  <Switch
                    defaultChecked={settings?.giftback_line_enabled}
                    disabled={isLoadingCommunicationSettings}
                    onChange={(checked) => handleChange(checked, 'line')}
                  />
                </Form.Item>
                <span>Clientes que frequentaram meu restaurante via fila</span>
              </S.WrapperSwitch>
              <S.WrapperSwitch>
                <Form.Item name="giftback_reservation_enabled" valuePropName="checked">
                  <Switch
                    defaultChecked={settings?.giftback_reservation_enabled}
                    disabled={isLoadingCommunicationSettings}
                    onChange={(checked) => handleChange(checked, 'reservation')}
                  />
                </Form.Item>
                <span>Clientes que frequentaram meu restaurante via reserva</span>
              </S.WrapperSwitch>
            </S.Sector>
            <ComunicationSettingsSwitches
              title="Enviar por"
              service="voucher"
              disabled={isLoadingCommunicationSettings}
              unitId={unitId}
              whatsapp={{
                enabled: true,
                price: import.meta.env.VITE_WHATSAPP_COMMUNICATION_VOUCHER_PRICE,
              }}
            />
          </ComunicationSettingsSection>
        </PageContainer>
      )}
    </>
  );
};

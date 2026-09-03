import { FunctionComponent, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import moment from 'moment';
import api from 'src/services/api';
import { fetchAndActivate, getValue } from 'firebase/remote-config';
import { useRemoteConfig } from 'src/hooks/useRemoteConfig';
import { Gift } from '@styled-icons/boxicons-regular/Gift';
import { GenericBanner } from 'src/components/GenericBanner';
import * as S from './styles';

type NewsBannerProps = {
  unitId?: string;
};

export const NewsBanner: FunctionComponent<NewsBannerProps> = (props) => {
  const { unitId } = props;
  const [isVisible, setIsVisible] = useState(false);
  const remoteConfig = useRemoteConfig({ amenities_banner_visible: false });

  const defineCookiesAmenities = () => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 365);

    Cookies.set(
      'giftback_banner_was_visualized',
      JSON.stringify({ name: 'visualized', date: expirationDate }),
      {
        expires: 365,
      }
    );
  };

  useEffect(() => {
    const amenitiesBannerCookiesValue = Cookies.get(
      'giftback_banner_was_visualized'
    );

    if (
      amenitiesBannerCookiesValue &&
      JSON.parse(amenitiesBannerCookiesValue).name === 'visualized'
    ) {
      setIsVisible(false);

      const today = new Date();

      const amenitiesBannerExpirationValue = moment(
        new Date(JSON.parse(amenitiesBannerCookiesValue).date)
      ).format('DD-MM-YYYY');

      const threeMonthsFromNow = moment(
        new Date(today.setDate(today.getDate() + 90))
      ).format('DD-MM-YYYY');

      if (threeMonthsFromNow === amenitiesBannerExpirationValue) {
        Cookies.remove('giftback_banner_was_visualized');

        defineCookiesAmenities();
      }
    } else {
      if (remoteConfig) {
        fetchAndActivate(remoteConfig)
          .then(() => {
            const shouldShowAmenitiesBanner = getValue(
              remoteConfig,
              'amenities_banner_visible'
            ).asBoolean();

            setIsVisible(shouldShowAmenitiesBanner);
          })
          .catch(() => setIsVisible(false));
      }
    }
  }, []);

  const handleSubmitNewsForm = (values: any) => {
    if ((values.email || null) !== null) {
      api.put(`/marketing/v1/units/${unitId}/crm-intent/${unitId}`, {
        contact: values.email,
        source: 'giftback_lead',
      });

      defineCookiesAmenities();
    }

    setIsVisible(false);
  };

  return (
    <GenericBanner
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      title="Novidades no Get In!"
      modalOptions={{
        maskClosable: false,
      }}
      form={{
        onFinish: handleSubmitNewsForm,
        fields: [
          {
            name: 'email',
            label: 'Email',
            placeholder: 'Digite aqui o seu email!',
            rules: [
              {
                required: true,
                message: 'Por favor, insira um email!',
              },
            ],
          },
        ],
      }}
      actions={{
        primary: {
          text: 'Enviar',
          isSubmit: true,
        },
        secondary: {
          text: 'Fechar',
          onClick: () => {
            api.put(`/marketing/v1/units/${unitId}/crm-intent/${unitId}`, {
              contact: 'no',
              source: 'experiences_lead',
            });
            defineCookiesAmenities();
            setIsVisible(false);
          },
        },
      }}
      body={
        <S.PlanBodyModal>
          <div className="section">
            <div className="title">
              <Gift size={20} />
              <span>CHEGOU O GIFTBACK DO GET IN!</span>
            </div>
            <p className="description">
              Faça seus clientes retornarem ao seu restaurante oferecendo um
              benefício simples e direto!
              <br />
              <br />
              Caso tenha interesse em conhecer mais, deixe seu e-mail abaixo.
            </p>
          </div>
        </S.PlanBodyModal>
      }
    />
  );
};

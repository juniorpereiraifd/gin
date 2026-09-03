import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import Loading from 'src/stories/feedback/Loading';
import { Title } from 'src/stories/typography';
import * as S from './styles';
import { BoxContrasted } from 'src/components/BoxContrasted';

export type ParamProps = {
  unity: string;
};

type ComunicationSettingsSectionProps = {
  children: React.ReactNode;
  scope?: 'voucher' | 'communication';
};

export const ComunicationSettingsSection: FunctionComponent<
  ComunicationSettingsSectionProps
> = ({ children, scope }) => {
  const {
    comunication: { savingSettings: savingCommunicationSettings },
    voucher: { savingSettings: savingVoucherSettings },
  } = useSelector((state: RootType) => state);
  const isSaving =
    savingCommunicationSettings ||
    (scope === 'voucher' && savingVoucherSettings);

  return (
    <BoxContrasted>
      <S.Section>
        <S.TitleWrapper>
          <Title level={3}>Configurações de comunicação </Title>
          {isSaving && <Loading size={14} />}
        </S.TitleWrapper>
        <p className="description">
          Personalize a comunicação de forma simples e eficaz. Ajuste as
          configurações para atender às necessidades específicas do seu
          restaurante.
        </p>
        <S.SectorWrapper>{children}</S.SectorWrapper>
      </S.Section>
    </BoxContrasted>
  );
};

import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { GenericBanner } from 'src/components/GenericBanner';
import * as S from './styles';

type ComunicationContactModalProps = {
  isModalContactVisible: boolean;
  setModalContactIsVisible: Dispatch<SetStateAction<boolean>>;
  primaryAction: () => void;
  secondaryAction: () => void;
  type: 'line' | 'reservation';
};

export const ComunicationContactModal: FunctionComponent<
  ComunicationContactModalProps
> = (props) => {
  const {
    isModalContactVisible,
    setModalContactIsVisible,
    primaryAction,
    secondaryAction,
    type,
  } = props;

  const handleClickPrimaryButton = () => {
    setModalContactIsVisible(false);

    primaryAction?.();
  };

  const handleClickSecondaryButton = () => {
    setModalContactIsVisible(false);

    secondaryAction?.();
  };

  return (
    <GenericBanner
      title={`Customização de SMS - ${type === 'line' ? 'Fila' : 'Reserva'}`}
      isVisible={isModalContactVisible}
      setIsVisible={setModalContactIsVisible}
      actions={{
        primary: {
          text: 'Tenho interesse',
          onClick: handleClickPrimaryButton,
        },
        secondary: {
          text: 'Não, obrigado',
          onClick: handleClickSecondaryButton,
        },
      }}
      body={
        <S.ModalBody>
          <p className="description">
            Agora você pode <b>customizar a mensagem</b> enviada ao seu cliente
            {type === 'line'
              ? ' enquanto aguarda na fila de espera.'
              : ' quando ele faz uma reserva no seu estabelecimento.'}
            <br />
            <br />
            Fale com um de nossos especialistas para entender melhor.
          </p>
        </S.ModalBody>
      }
    />
  );
};

import { Button } from 'src/stories/general/Button';
import * as S from './styles';

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  handleSubmit: () => void;
};

export const WarningSmsDefaultModal = ({
  isVisible,
  setIsVisible,
  handleSubmit,
}: Props) => {
  const handleClose = () => setIsVisible(false);

  const handleClickSubmit = () => {
    handleSubmit();
    handleClose();
  };

  return (
    <S.CustomModal
      open={isVisible}
      centered
      destroyOnClose
      footer={null}
      onCancel={handleClose}
      width={'400px'}
      closable={false}
    >
      <S.Content>
        <S.Title>Restaurar padrão</S.Title>
        <p>
          Esta ação ira substituir sua mensagem personalizada pela versão padrão
          utilizada pelo Get In. Gostaria de continuar?
        </p>

        <S.WrapperButtonActions>
          <Button variant="outlined" onClick={handleClose}>
            Voltar
          </Button>
          <Button onClick={handleClickSubmit}>Restaurar padrão</Button>
        </S.WrapperButtonActions>
      </S.Content>
    </S.CustomModal>
  );
};

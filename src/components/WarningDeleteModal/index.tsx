import { Button } from '@getlove/react';
import * as S from './styles';

type WarningDeleteModalProps = {
  title: string;
  description: string;
  cancelMessage: string;
  submitMessage: string;
  isVisible: boolean;
  handleCloseModal: () => void;
  handleSubmit: () => void;
};

export const WarningDeleteModal = ({
  title,
  description,
  cancelMessage,
  submitMessage,
  isVisible,
  handleCloseModal,
  handleSubmit,
}: WarningDeleteModalProps) => {
  const handleSubmitModal = () => {
    handleSubmit();
    handleCloseModal();
  };

  return (
    <S.CustomModal
      open={isVisible}
      centered
      destroyOnClose
      footer={null}
      onCancel={handleCloseModal}
      width="400px"
      closable={false}
    >
      <S.Content>
        <S.Title>{title}</S.Title>
        <p>{description}</p>

        <S.WrapperButtonActions>
          <Button size="regular" style="outline" onClick={handleCloseModal}>
            {cancelMessage}
          </Button>

          <Button size="regular" style="secondary" onClick={handleSubmitModal}>
            {submitMessage}
          </Button>
        </S.WrapperButtonActions>
      </S.Content>
    </S.CustomModal>
  );
};

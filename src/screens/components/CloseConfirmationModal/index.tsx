import type { FunctionComponent } from 'react';
import { Modal } from 'antd';
import { Button } from 'src/stories/general/Button';

type CloseConfirmationModalProps = {
  open: boolean;
  onDiscard: VoidFunction;
  onBack: VoidFunction;
};

export const CloseConfirmationModal: FunctionComponent<CloseConfirmationModalProps> = (props) => {
  const { open, onDiscard, onBack } = props;

  return (
    <Modal
      title="Descartar mudanças?"
      open={open}
      onClose={onBack}
      onCancel={onBack}
      footer={[
        <Button key="discard" variant="outlined" onClick={onDiscard}>
          Descartar e continuar
        </Button>,
        <Button key="back" type="primary" onClick={onBack}>
          Voltar
        </Button>,
      ]}
    >
      <p>Você não salvou suas alterações. Se continuar, você perderá essas alterações.</p>
    </Modal>
  );
};

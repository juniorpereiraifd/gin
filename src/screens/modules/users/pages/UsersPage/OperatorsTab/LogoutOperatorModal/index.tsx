import { Modal } from 'antd';
import type { FunctionComponent } from 'react';
import { Button } from 'src/stories/general/Button';

type LogoutOperatorModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: VoidFunction;
  onConfirm: VoidFunction;
};

export const LogoutOperatorModal: FunctionComponent<LogoutOperatorModalProps> = (props) => {
  const { open, setOpen, onClose, onConfirm } = props;

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onCancel={handleClose}
      title="Encerrar sessões"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={onConfirm}>Confirmar</Button>
        </div>
      }
    >
      <div className=" flex flex-col gap-3">
        <p>
          Ao encerrar as sessões, o operador será deslogado do painel operacional em todos os dispositivos que estiver
          conectado.
        </p>
        <p>
          Isso possibilita forçar re-login em casos de troca de senha, atualização da lista de unidade de acesso, etc
        </p>
        <p>Tem certeza que deseja encerrar todas as sessões deste operador?</p>
      </div>
    </Modal>
  );
};

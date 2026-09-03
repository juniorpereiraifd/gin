import type { FunctionComponent } from 'react';
import { Modal } from 'antd';
import { Button } from 'src/stories/general/Button';
import Delete from 'src/components/Delete';

type Action = 'edit' | 'delete';

type UsedScheduleModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  action: {
    type: Action;
    onConfirm: VoidFunction;
  };
};

export const UsedScheduleModal: FunctionComponent<UsedScheduleModalProps> = (props) => {
  const { open, setOpen, action } = props;

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    handleClose();

    action.onConfirm();
  };

  return (
    <Modal
      centered
      open={open}
      title="Grade horária com reservas"
      onCancel={handleClose}
      footer={
        <div className="flex items-center justify-end gap-4">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={action.type === 'edit' ? handleConfirm : handleClose}>
            {action.type === 'edit' ? 'Continuar' : <Delete onDelete={handleConfirm}>Continuar</Delete>}
          </Button>
        </div>
      }
    >
      <p className="text-slate-700">
        Você possui reservas ativas para essa grade horária, ao excluir ou editar essa grade horária{' '}
        <b>as reservas não serão excluídas.</b>
        <br />
        <br />
        Deseja continuar?
      </p>
    </Modal>
  );
};

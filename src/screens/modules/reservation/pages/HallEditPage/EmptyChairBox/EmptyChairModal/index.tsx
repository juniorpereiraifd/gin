import { Modal } from 'antd';
import type { Dispatch, FunctionComponent, SetStateAction } from 'react';

type EmptyChairModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EmptyChairModal: FunctionComponent<EmptyChairModalProps> = (props) => {
  const { open, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal open={open} onCancel={handleClose} title="Permitir cadeira vazia" footer={null}>
      <div className="flex flex-col gap-2 text-slate-600">
        <p>
          Com a opção de cadeira vazia habilitada, seu salão oferecerá reservas em mesas mesmo que um dos lugares fique
          vazio.
        </p>
        <p>
          Por exemplo, se um cliente buscar uma reserva para 3 pessoas, o sistema oferecerá mesas de <b>3 lugares</b> e,{' '}
          <b>caso não tenha mesa disponível</b>, oferecerá mesas de 4 lugares.
        </p>
      </div>
    </Modal>
  );
};

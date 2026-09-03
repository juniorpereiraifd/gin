import { type FunctionComponent } from 'react';
import { Modal } from 'src/stories/feedback/Modal';
import { Button } from 'src/stories/general/Button';
import type { WidgetProps } from 'src/store/modules/widget/reducer';

type UnlinkWidgetModalProps = {
  onUnlink: (widget: WidgetProps) => void;
  onClose?: VoidFunction;
  open: boolean;
  setOpen: (open: boolean) => void;
  widget: WidgetProps | null;
};

export const UnlinkWidgetModal: FunctionComponent<UnlinkWidgetModalProps> = (props) => {
  const { onUnlink, onClose, open, setOpen, widget } = props;

  const handleOnUnlink = () => {
    if (widget !== null) {
      onUnlink(widget);
    }

    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title="Desvincular?"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleOnUnlink}>Desvincular</Button>
        </div>
      }
    >
      <p>
        Você realmente deseja desvincular o widget <b>{widget?.name}</b> desta unidade?
      </p>
    </Modal>
  );
};

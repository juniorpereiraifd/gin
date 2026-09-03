import { useState, Fragment, useEffect, type FunctionComponent } from 'react';
import { Title } from 'src/stories/typography';
import { Modal } from 'src/stories/feedback/Modal';
import { Button } from 'src/stories/general/Button';
import { Divider } from 'antd';

type RefundConfirmationModalProps = {
  onRefund?: VoidFunction;
  onClose?: VoidFunction;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

export const RefundConfirmationModal: FunctionComponent<RefundConfirmationModalProps> = (props) => {
  const { open, setOpen, onRefund, onClose } = props;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open !== undefined && open === true) {
      setVisible(true);
    }
  }, [open]);

  const handleOnRefund = () => {
    onRefund && onRefund();
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    setOpen?.(false);
    onClose && onClose();
  };

  return (
    <Fragment>
      <Modal
        open={visible}
        width="30%"
        footer={null}
        onCancel={handleClose}
        title={<Title level={4}>Estornar transação?</Title>}
      >
        <p>Você realmente deseja estornar esta transação? Esta ação é permamente e irreversível.</p>
        <div className="flex items-center justify-end gap-4 mt-8">
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleOnRefund}>Estornar</Button>
        </div>
      </Modal>
    </Fragment>
  );
};

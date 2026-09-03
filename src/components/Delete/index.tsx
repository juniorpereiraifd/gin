import React, { useState, memo, Fragment, useEffect } from 'react';
import { Title } from 'src/stories/typography';
import { Modal } from 'src/stories/feedback/Modal';
import Input from 'src/stories/entry/Input';
import { Button } from 'src/stories/general/Button';
import { Divider } from 'antd';
import * as S from './styles';

type DeleteProps = {
  onDelete?: () => void;
  children?: React.ReactNode;
  className?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
};

const TYPE = 'excluir';

const Delete = (props: DeleteProps) => {
  const { open, setOpen, onDelete, children, className } = props;
  const [disabled, setDisabled] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open !== undefined && open === true) {
      setVisible(true);
    }
  }, [open]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisabled(true);
    if (e.target.value.trim() && e.target.value === TYPE) {
      setDisabled(false);
    }
  };

  const handleOnDelete = () => {
    onDelete && onDelete();
    setVisible(false);
  };

  const handleClose = () => {
    setVisible(false);
    setOpen?.(false);
  };

  return (
    <Fragment>
      <Modal
        open={visible}
        width="30%"
        footer={null}
        onCancel={handleClose}
        title={<Title level={4}>Excluir permanentemente?</Title>}
      >
        <Title level={6}>Você realmente deseja excluir este item? Esta ação é permamente e irreversível.</Title>
        <Divider />
        <S.Information>{'Para confirmar a exclusão, digite "excluir":'}</S.Information>
        <Input onChange={handleOnChange} />

        <S.Footer>
          <Button onClick={handleClose} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={handleOnDelete} disabled={disabled}>
            Excluir
          </Button>
        </S.Footer>
      </Modal>
      {children && (
        <div onClick={() => setVisible(true)} className={className}>
          {children}
        </div>
      )}
    </Fragment>
  );
};

export default memo(Delete);

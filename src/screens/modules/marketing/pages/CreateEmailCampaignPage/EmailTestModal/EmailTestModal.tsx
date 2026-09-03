import { ChangeEvent, useState } from 'react';
import { Input } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import * as S from './styles';
import { Modal } from 'antd';

type Props = {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  handleSendEmailTest: (email: string) => void;
};

export const EmailTestModal = ({
  isVisible,
  setIsVisible,
  handleSendEmailTest,
}: Props) => {
  const [emailValue, setEmailValue] = useState('');
  const [disabled, setDisabled] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setEmailValue('');
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
    setDisabled(false);
  };

  const handleSubmit = () => {
    handleSendEmailTest(emailValue);
    handleClose();
  };

  return (
    <Modal
      open={isVisible}
      centered
      destroyOnClose
      footer={null}
      onCancel={handleClose}
      width={'250px'}
      closable={false}
    >
      <S.Content>
        <S.Title>E-mail de teste</S.Title>
        <S.WrapperInput>
          <label htmlFor="email">E-mail</label>
          <Input
            id="email"
            type="email"
            value={emailValue}
            onChange={handleChangeEmail}
          />
        </S.WrapperInput>

        <S.WrapperButtonActions>
          <Button onClick={handleSubmit} disabled={disabled}>
            Enviar E-mail
          </Button>
        </S.WrapperButtonActions>
      </S.Content>
    </Modal>
  );
};

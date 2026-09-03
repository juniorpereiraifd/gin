import { ChangeEvent, useState } from 'react';
import { InputMask } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { getPhoneNumberUnformatted } from 'src/utils/helpers';
import * as S from './styles';
import { Modal } from 'antd';

type EditType = 'sms' | 'whatsapp';

type Props = {
  type: EditType;
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  handleSendSmsTest: (phone: string) => void;
};

export const SmsTestModal = ({ type, isVisible, setIsVisible, handleSendSmsTest }: Props) => {
  const [numberValue, setNumberValue] = useState('');

  const handleClose = () => {
    setIsVisible(false);
    setNumberValue('');
  };

  const handleChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
    setNumberValue(event.target.value);
  };

  const handleSubmit = () => {
    handleSendSmsTest(numberValue);
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
        <S.Title>{type === 'sms' ? 'SMS' : 'Mensagem'} de teste</S.Title>
        <S.WrapperInput>
          <label htmlFor="number">Número de telefone</label>
          <InputMask id="number" mask="(99) 99999-9999" value={numberValue} onChange={handleChangeNumber} />
        </S.WrapperInput>

        <S.WrapperButtonActions>
          <Button onClick={handleSubmit} disabled={getPhoneNumberUnformatted(numberValue).length < 10}>
            Enviar {type === 'sms' ? 'SMS' : 'mensagem'}
          </Button>
        </S.WrapperButtonActions>
      </S.Content>
    </Modal>
  );
};

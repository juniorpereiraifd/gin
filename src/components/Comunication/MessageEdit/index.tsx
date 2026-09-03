import { useEffect, useRef, useState } from 'react';
import { Form, Select, Switch } from 'antd';
import {
  SmsMessageProps,
  SmsVariablesProps,
} from 'src/store/modules/comunication/reducer';
import { Button } from 'src/stories/general/Button';
import { getStringIgnoringAccents } from 'src/utils/helpers';
import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';

import { SmsTestModal } from '../SmsTestModal';
import { WarningSmsDefaultModal } from '../WarningSmsDefaultModal';
import * as S from './styles';
import { ContentEditableEvent } from 'react-contenteditable';

const { Option } = Select;

type EditType = 'sms' | 'whatsapp';

export type SubmitValues = {
  type: string;
  key: string;
  value: string;
};

type Props = {
  type: EditType;
  experienceType: 'line' | 'reservation';
  listMessages?: SmsMessageProps[];
  listMessagesUpdated?: { [key: string]: string };
  defaultMessage?: string;
  handleSubmit: (values: SubmitValues) => void;
  handleSendSmsTest: (
    phone: string,
    type: string,
    messageType: string,
    message: string
  ) => void;
};

export const MessageEdit = ({
  type,
  experienceType,
  listMessages,
  listMessagesUpdated,
  defaultMessage,
  handleSubmit,
  handleSendSmsTest,
}: Props) => {
  const [form] = Form.useForm();
  const contentEditable = useRef(null);
  const [showWarningSmsDefault, setShowWarningSmsDefault] = useState(false);
  const [editEnabled, setEditEnabled] = useState(false);
  const [smsTestModalIsVisible, setSmsTestModalIsVisible] = useState(false);
  const [variants, setVariants] = useState<SmsVariablesProps[]>([]);
  const [smsValue, setSmsValue] = useState({
    value: '',
    text: '',
    textSize: 0,
  });
  const [whatsAppValue, setWhatsAppValue] = useState({
    value: '',
    text: '',
    textSize: 0,
  });

  useEffect(() => {
    if (defaultMessage) {
      form.setFieldsValue({ model: defaultMessage });
    }
  }, [defaultMessage]); //eslint-disable-line

  useEffect(() => {
    if (defaultMessage && listMessages?.length) {
      const modelSelected = form.getFieldValue('model');

      const variablesSelected = listMessages.filter(
        (item) => item.type === modelSelected
      )[0].variables;

      setVariants(variablesSelected);
    }
  }, [defaultMessage, listMessages]); //eslint-disable-line

  useEffect(() => {
    if (defaultMessage) {
      const modelSelected = form.getFieldValue('model');

      if (listMessagesUpdated && variants && listMessages?.length) {
        const defaultMessageSelectedUpdated =
          Object.keys(listMessagesUpdated).indexOf(modelSelected) >= 0
            ? listMessagesUpdated[modelSelected]
            : null;

        if (defaultMessageSelectedUpdated) {
          handleUpdateDefaultMessageValue(defaultMessageSelectedUpdated, type);
          handleUpdateMessageValueSize(defaultMessageSelectedUpdated, type);

          setEditEnabled(true);
        } else {
          const defaultMessageSelected = listMessages?.filter(
            (item) => item.type === modelSelected
          )[0].default;

          handleUpdateDefaultMessageValue(defaultMessageSelected, type);
          handleUpdateMessageValueSize(defaultMessageSelected, type);
          setEditEnabled(false);
        }
      } else {
        const defaultMessageSelected = listMessages?.filter(
          (item) => item.type === modelSelected
        )[0].default;

        if (defaultMessageSelected) {
          handleUpdateDefaultMessageValue(defaultMessageSelected, type);
          handleUpdateMessageValueSize(defaultMessageSelected, type);
        }

        setEditEnabled(false);
      }
    }
  }, [defaultMessage, listMessages, listMessagesUpdated, variants]); //eslint-disable-line

  const handleEnableEdit = () => {
    const messageTypeSelected: string = form.getFieldValue('model');

    if (!!editEnabled && messageTypeSelected) {
      const messageDefaultSelected = listMessages?.filter(
        (item) => item.type === messageTypeSelected
      );
      messageDefaultSelected &&
        handleUpdateDefaultMessageValue(
          messageDefaultSelected[0].default,
          type
        );
    } else {
      if (listMessagesUpdated) {
        const messageUpdatedDefaultSelected =
          Object.keys(listMessagesUpdated).indexOf(messageTypeSelected) >= 0
            ? listMessagesUpdated[messageTypeSelected]
            : null;

        if (messageUpdatedDefaultSelected) {
          handleUpdateDefaultMessageValue(messageUpdatedDefaultSelected, type);

          return setEditEnabled((value) => !value);
        }
      }
    }

    return setEditEnabled((value) => !value);
  };

  const handleTestSms = () => setSmsTestModalIsVisible(true);

  const handleClickVariant = (
    text: string,
    value: string,
    size: number,
    type: EditType
  ) => {
    document.getElementById(`message-field-${type}-${experienceType}`)?.focus();

    type === 'sms'
      ? setSmsValue((item) => ({
          ...item,
          value: item.value + `{${value}}`,
          text:
            item.text +
            `<span class="variant" contenteditable="false">${getStringIgnoringAccents(
              text,
              true
            )}</span>&nbsp;`,
          textSize: item.textSize + size,
        }))
      : setWhatsAppValue((item) => ({
          ...item,
          value: item.value + `{${value}}`,
          text:
            item.text +
            `<span class="variant" contenteditable="false">${getStringIgnoringAccents(
              text,
              true
            )}</span>&nbsp;`,
          textSize: item.textSize + size,
        }));
  };

  const handleUpdateDefaultMessageValue = (value: string, type: EditType) => {
    let textField = value.replaceAll(' ', '&nbsp;');

    variants.forEach((item) => {
      const regexVariantText = new RegExp(`{${item.type}}`, 'g');

      if (textField.match(regexVariantText)) {
        textField = textField.replaceAll(
          regexVariantText,
          `<span class="variant" contenteditable="false">${getStringIgnoringAccents(
            item.text,
            true
          )}</span>`
        );
      }
    });

    type === 'sms'
      ? setSmsValue((item) => ({
          ...item,
          value: value ? getStringIgnoringAccents(value, true) : value,
          text: textField,
        }))
      : setWhatsAppValue((item) => ({
          ...item,
          value: value ? getStringIgnoringAccents(value, true) : value,
          text: textField,
        }));

    return textField;
  };

  const handleUpdateMessageValue = (value: string, type: EditType) => {
    let textField = value.replaceAll('&nbsp;', ' ');

    variants.forEach((item) => {
      const regexVariantText = new RegExp(
        `<span class="variant" contenteditable="false">${getStringIgnoringAccents(
          item.text,
          true
        )}</span>`,
        'g'
      );
      if (textField.match(regexVariantText)) {
        textField = textField.replaceAll(regexVariantText, `{${item.type}}`);
      }
    });

    const regexAnyTag = new RegExp(`<.*?>`, 'g');

    if (textField.match(regexAnyTag)) {
      textField = textField.replaceAll(regexAnyTag, '');
    }

    type === 'sms'
      ? setSmsValue((item) => ({
          ...item,
          value: textField,
          text: value ? getStringIgnoringAccents(value, true) : value,
        }))
      : setWhatsAppValue((item) => ({
          ...item,
          value: textField,
          text: value ? getStringIgnoringAccents(value, true) : value,
        }));

    return textField;
  };

  const handleUpdateMessageValueSize = (value: string, type: EditType) => {
    let textSize = 0;

    variants.forEach((item) => {
      const variantText = `{${item.type}}`;

      if (value.includes(variantText)) {
        const arrIndex = [];

        let idx = value.indexOf(variantText);
        while (idx != -1) {
          arrIndex.push(idx);
          idx = value.indexOf(variantText, idx + 1);
        }

        textSize += item.size * arrIndex.length;
        value = value.replaceAll(variantText, '');
      }
    });

    textSize += value.length;

    type === 'sms'
      ? setSmsValue((item) => ({
          ...item,
          textSize,
        }))
      : setWhatsAppValue((item) => ({
          ...item,
          textSize,
        }));
  };

  const handleMessageFieldChange = (data: ContentEditableEvent) => {
    if (data) {
      const textFieldUpdated = handleUpdateMessageValue(
        data.target.value,
        type
      );
      handleUpdateMessageValueSize(textFieldUpdated, type);
    }
  };

  const handleChangeSelectTypeMessage = (value: string) => {
    const messageSelected = listMessages?.filter((item) => item.type === value);

    const variablesSelected = listMessages?.filter(
      (item) => item.type === value
    )[0].variables;

    variablesSelected && setVariants(variablesSelected);

    messageSelected &&
      handleUpdateDefaultMessageValue(messageSelected[0].default, type);
  };

  const handleFinish = (values: { model: string }) => {
    if (!editEnabled) {
      return setShowWarningSmsDefault(true);
    }

    return handleSubmit({
      type: experienceType,
      key: values.model,
      value: type === 'sms' ? smsValue.value : whatsAppValue.value,
    });
  };

  const handleFinishWarningModal = () => {
    const modelSelected = form.getFieldValue('model');

    return handleSubmit({
      type: experienceType,
      key: modelSelected,
      value: type === 'sms' ? smsValue.value : whatsAppValue.value,
    });
  };

  const handleSendSmsTestFinish = (phone: string) => {
    const modelSelected = form.getFieldValue('model');
    handleSendSmsTest(phone, experienceType, modelSelected, smsValue.value);
    setSmsTestModalIsVisible(false);
  };

  return (
    <S.Container>
      <SmsTestModal
        type={type}
        isVisible={smsTestModalIsVisible}
        setIsVisible={setSmsTestModalIsVisible}
        handleSendSmsTest={handleSendSmsTestFinish}
      />
      <WarningSmsDefaultModal
        isVisible={showWarningSmsDefault}
        setIsVisible={setShowWarningSmsDefault}
        handleSubmit={handleFinishWarningModal}
      />
      <strong className="title">
        {type === 'sms' ? 'SMS' : 'Whatsapp'} de{' '}
        {experienceType === 'line' ? 'Fila' : 'Reserva'}
      </strong>
      <Form
        layout="vertical"
        onFinish={handleFinish}
        form={form}
        initialValues={{ enabled: true }}
      >
        {type === 'sms' && !!listMessages?.length && (
          <Form.Item name="model" label="Modelo de SMS">
            <S.Select
              onChange={(value) =>
                handleChangeSelectTypeMessage(value as string)
              }
            >
              {listMessages.map((item) => (
                <Option key={item.type} value={item.type}>
                  {item.text}
                </Option>
              ))}
            </S.Select>
          </Form.Item>
        )}
        <S.WrapperSwitch>
          <Switch checked={editEnabled} onChange={handleEnableEdit} />
          <span>Personalizar {type === 'sms' ? 'SMS' : 'mensagem'}</span>
        </S.WrapperSwitch>
        <S.WrapperTextArea>
          <Form.Item
            name="customText"
            label={type === 'sms' ? 'SMS' : 'WhatsApp'}
          >
            <S.ContentEditableWrapper
              id={`message-field-${type}-${experienceType}`}
              innerRef={contentEditable}
              html={type === 'sms' ? smsValue.text : whatsAppValue.text}
              onChange={handleMessageFieldChange}
              disabled={!editEnabled}
              textSize={
                type === 'sms' ? smsValue.textSize : whatsAppValue.textSize
              }
            />
          </Form.Item>
          <S.ContentSizeDescription
            descriptionSize={
              type === 'sms' ? smsValue.textSize : whatsAppValue.textSize
            }
            disabled={!editEnabled}
          >
            <span className="description">
              {type === 'sms' ? smsValue.textSize : whatsAppValue.textSize}/150
            </span>
            {smsValue.textSize > 150 && (
              <S.TooltipInfo
                placement="right"
                title="O tamanho máximo permitido para a mensagem é de 150 caracteres."
              >
                <InfoOutline size={16} />
              </S.TooltipInfo>
            )}
          </S.ContentSizeDescription>
          <S.ContentVariantsInfo>
            <span className="variantText">Adicionar variável</span>
            <S.WrapperVariants>
              {!!variants.length &&
                variants.map((item) => (
                  <S.Variant
                    key={item.type}
                    className="buttonVariant"
                    disabled={!editEnabled}
                    onClick={() =>
                      !editEnabled
                        ? null
                        : handleClickVariant(
                            item.text,
                            item.type,
                            item.size,
                            type
                          )
                    }
                  >
                    <span className="name">{item.text}</span>
                  </S.Variant>
                ))}
            </S.WrapperVariants>
          </S.ContentVariantsInfo>
        </S.WrapperTextArea>
        <S.Footer>
          <Button
            variant="outlined"
            className="secondary"
            onClick={handleTestSms}
            htmlType="button"
            disabled={smsValue.textSize > 150}
          >
            Enviar {type === 'sms' ? 'SMS' : 'mensagem'} teste
          </Button>
          <Button htmlType="submit" disabled={smsValue.textSize > 150}>
            Salvar {type === 'sms' ? 'SMS' : 'mensagem'}
          </Button>
        </S.Footer>
      </Form>
    </S.Container>
  );
};

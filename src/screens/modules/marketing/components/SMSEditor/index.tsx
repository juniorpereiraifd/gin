import { InfoOutline } from '@styled-icons/evaicons-outline/InfoOutline';
import { SmsTestModal } from 'src/components/Comunication/SmsTestModal';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { ContentEditableEvent } from 'react-contenteditable';
import { useDispatch } from 'react-redux';
import type { SmsVariablesProps } from 'src/store/modules/comunication/reducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { SMSCampaignData } from 'src/store/modules/marketing/reducer';
import { getPhoneNumberWithNationalCode, getStringIgnoringAccents, notification } from 'src/utils/helpers';
import * as S from './styles';

export type SMSEditorProps = {
  variables: SmsVariablesProps[];
  handleChangeSMSValue: (smsText: string) => void;
  handleChangeSMSTextSize: (textSize: number) => void;
  campaign: SMSCampaignData | undefined | null;
  smsTestModal: {
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>;
  };
};

export const SMSEditor = ({
  variables,
  handleChangeSMSValue,
  handleChangeSMSTextSize,
  smsTestModal,
  campaign,
}: SMSEditorProps) => {
  const dispatch = useDispatch();
  const contentEditable = useRef<null>(null);
  const [variants, setVariants] = useState<SmsVariablesProps[]>([]);
  const [smsValue, setSmsValue] = useState({
    value: '',
    text: '',
    textSize: 0,
  });

  const handleClickVariant = (text: string, value: string, size: number) => {
    document.getElementById('message-field-sms')?.focus();

    setSmsValue((item) => {
      handleChangeSMSValue(item.value + `{${value}}`);
      handleChangeSMSTextSize(item.textSize + size);

      return {
        ...item,
        value: item.value + `{${value}}`,
        text:
          item.text +
          `<span class="variant" contenteditable="false">${getStringIgnoringAccents(text, true)}</span>&nbsp;`,
        textSize: item.textSize + size,
      };
    });
  };

  const transformToSpan = (value?: string) => {
    let textField = value?.replaceAll('&nbsp;', ' ');

    for (const smsVar of variables) {
      textField = textField?.replace(
        `{${smsVar.type}}`,
        `<span class="variant" contenteditable="false">${getStringIgnoringAccents(smsVar.text, true)}</span>`
      );
    }

    return textField;
  };

  const handleUpdateMessageValue = (value: string) => {
    let textField = value.replaceAll('&nbsp;', ' ');

    variants.forEach((item) => {
      const regexVariantText = new RegExp(
        `<span class="variant" contenteditable="false">${getStringIgnoringAccents(item.text, true)}</span>`,
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

    setSmsValue((item) => ({
      ...item,
      value: textField,
      text: value ? getStringIgnoringAccents(transformToSpan(value)!, true) : value,
    }));

    handleChangeSMSValue(textField);

    return textField;
  };

  useEffect(() => {
    if (campaign && variables) handleUpdateMessageValue(campaign?.template.body);
  }, [campaign, variables]);

  const handleUpdateMessageValueSize = (value: string) => {
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

    handleChangeSMSTextSize(textSize);

    setSmsValue((item) => ({
      ...item,
      textSize,
    }));
  };

  const handleMessageFieldChange = (data: ContentEditableEvent) => {
    if (data) {
      const textFieldUpdated = handleUpdateMessageValue(data.target.value);
      handleUpdateMessageValueSize(textFieldUpdated);
    }
  };

  const handleSendSmsTestFinish = (phone: string) => {
    if (!phone || !smsValue.value) {
      notification.warning('Dados inválidos!', 'Preencha corretamente os campos de SMS e telefone');
      return;
    }
    dispatch(
      MarketingCreators.sendSMSTestRequest({
        phone: getPhoneNumberWithNationalCode(phone),
        text: smsValue.value,
      })
    );
  };

  useEffect(() => {
    if (variables) setVariants(variables);
  }, [variables]);

  return (
    <S.Wrapper>
      <S.WrapperTextArea>
        <SmsTestModal
          type="sms"
          isVisible={smsTestModal.value}
          setIsVisible={smsTestModal.setValue}
          handleSendSmsTest={handleSendSmsTestFinish}
        />

        <S.Wrapper>
          <span className="font-semibold">SMS</span>
          <S.ContentEditableWrapper
            id="message-field-sms"
            innerRef={contentEditable}
            html={smsValue.text}
            onChange={handleMessageFieldChange}
            textSize={smsValue.textSize}
          />
        </S.Wrapper>

        <S.ContentSizeDescription descriptionSize={smsValue.textSize}>
          <span className="description">{smsValue.textSize}/150</span>
          {smsValue.textSize > 150 && (
            <S.TooltipInfo placement="right" title="O tamanho máximo permitido para a mensagem é de 150 caracteres.">
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
                  onClick={() => handleClickVariant(item.text, item.type, item.size)}
                >
                  <span className="name">{item.text}</span>
                </S.Variant>
              ))}
          </S.WrapperVariants>
        </S.ContentVariantsInfo>
      </S.WrapperTextArea>
    </S.Wrapper>
  );
};

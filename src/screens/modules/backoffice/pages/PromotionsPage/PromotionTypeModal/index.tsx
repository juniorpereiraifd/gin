import { Link2Outline } from '@styled-icons/evaicons-outline/Link2Outline';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import { RadioChangeEvent } from 'antd/lib/radio';
import { Dispatch, SetStateAction } from 'react';
import { Title } from 'src/stories/typography';
import * as PromotionAdditionModalStyles from '../PromotionAdditionModal/styles';
import { Modal } from 'src/stories/feedback/Modal';
import type { PromotionType } from '..';
import * as S from './styles';

enum PromotionTypes {
  'get-in' = 'get-in',
  'external-link' = 'external-link',
}

interface PromotionTypeModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  promotionType: {
    value: PromotionType;
    setValue: Dispatch<SetStateAction<PromotionType>>;
  };
}

export function PromotionTypeModal({
  showModal,
  onCloseModal,
  promotionType,
}: PromotionTypeModalProps) {
  const onChange = ({ target: { value } }: RadioChangeEvent) =>
    promotionType.setValue(value);

  const getInSelected = promotionType.value === PromotionTypes['get-in'];
  const externalLinkSelected =
    promotionType.value === PromotionTypes['external-link'];

  return (
    <Modal
      open={showModal}
      onCancel={onCloseModal}
      footer={null}
      title={
        <>
          <Title level={3}>Criar Promoção</Title>
          <PromotionAdditionModalStyles.CustomDivider
            type="horizontal"
            mt="1.5rem"
          />
        </>
      }
    >
      <S.RadioGroup onChange={onChange} value={promotionType.value}>
        <S.Radio value={PromotionTypes['get-in']} active={getInSelected}>
          <S.Title>
            <Pencil size={16} />
            Criar campanha via Get In
          </S.Title>
          Defina e crie toda a mecânica de uma nova
          <br />
          campanha. Como: Nome, descrição, item,
          <br />
          banner, desconto, etc.
        </S.Radio>

        <S.Radio
          value={PromotionTypes['external-link']}
          active={externalLinkSelected}
        >
          <S.Title>
            <Link2Outline size={16} />
            Criar através de um link
          </S.Title>
          Adicione uma campanha externa
          <br />
          existente via weblink.
        </S.Radio>
      </S.RadioGroup>
    </Modal>
  );
}

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { PromotionData } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { notification } from 'src/utils/helpers';
import type { AddedUnitOfForm } from '../PromotionAdditionModal';
import { PromotionType } from '..';
import { PromotionEstablishments } from './PromotionEstablishments';
import * as S from './styles';

export interface StepProps {
  promotion: {
    defaultValues: PromotionData | null;
    addedUnits: AddedUnitOfForm[];
  };
  handleChangeEditionPromotion: (value: AddedUnitOfForm[]) => void;
  promotionType: PromotionType;
}

interface PromotionEditModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  promotion: PromotionData | null;
}

export function PromotionEditModal({
  showModal,
  onCloseModal,
  promotion,
}: PromotionEditModalProps) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state: RootType) => state.promotions);

  const [addedUnits, setAddedUnits] = useState<AddedUnitOfForm[]>([]);

  const promotionType: PromotionType = promotion?.redirect_url
    ? 'external-link'
    : 'get-in';

  const isGetInPromotion = promotionType === 'get-in';

  const hasAllRequiredPromotionFields =
    !!promotion?.title &&
    !!promotion?.start_at &&
    !!promotion?.end_at &&
    !!promotion?.status;

  const hasAllRequiredFieldsOnSecondStep =
    !!addedUnits.length &&
    addedUnits.every((unit) =>
      isGetInPromotion
        ? (unit?.rescue_limit as number) >= 1
        : !unit?.rescue_limit
    );

  const hasAllRequiredFields =
    hasAllRequiredPromotionFields && hasAllRequiredFieldsOnSecondStep;

  const handleChangeEditionPromotion = (newValues: AddedUnitOfForm[]) =>
    setAddedUnits(newValues);

  const closeEditionModal = () => {
    onCloseModal();
    setAddedUnits([]);
    dispatch(UnityCreators.resetUnityData());
  };

  const onFinishForm = () => {
    if (!hasAllRequiredFields) {
      notification.warning(
        'Você deve preencher todos os campos necessários!',
        'Selecione estabelecimentos com número de unidades válidas.'
      );
      return;
    }

    dispatch(
      PromotionCreators.includeUnitsInThePromotionRequest({
        id: promotion.id,
        units: addedUnits,
      })
    );
    closeEditionModal();
  };

  const stepProps = {
    promotion: {
      defaultValues: promotion,
      addedUnits,
    },
    handleChangeEditionPromotion,
    promotionType,
  };

  useEffect(() => {
    if (promotion?.units) {
      setAddedUnits(
        promotion?.units.map((unit) =>
          Object.assign(
            {
              unit_id: unit.unit_id,
              name: unit.name,
            },
            isGetInPromotion && {
              rescue_limit: unit.rescue_limit,
            }
          )
        )
      );
    }
  }, [isGetInPromotion, promotion]);

  return (
    <S.PromotionEditModal
      promotionType={promotionType}
      open={showModal}
      onCancel={closeEditionModal}
      footer={null}
      title={
        <>
          <Title level={3}>Editar Promoção: {promotion?.title}</Title>
          <S.CustomDivider type="horizontal" mt="1.5rem" />
        </>
      }
    >
      <form onSubmit={onFinishForm}>
        <PromotionEstablishments {...stepProps} />
      </form>

      <S.ButtonsWrapper>
        <Button onClick={onFinishForm} disabled={isLoading}>
          Editar Promoção
        </Button>
      </S.ButtonsWrapper>
    </S.PromotionEditModal>
  );
}

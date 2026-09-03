import dayjs, { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { AddPromotionProps } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import type { Base64 } from 'src/types';
import { REGULAR_EXPRESSIONS } from 'src/utils/constants';
import { notification } from 'src/utils/helpers';
import type { PromotionType } from '..';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import * as S from './styles';

export type AddedUnitOfForm = {
  unit_id: string;
  name: string;
  rescue_limit?: number | null;
};

export type CreatePromotionFormProps = {
  title: string;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  message: string;
  discount: number | undefined;
  banner: {
    name: string;
    content: Base64;
  } | null;
  redirectUrl: string | null;
  item: string;
  status: 'active' | 'inactive';
  restriction: 'one' | 'unlimited' | null;
  addedUnits: AddedUnitOfForm[];
};

export type CreatePromotionFormKeys = keyof CreatePromotionFormProps;
export type CreatePromotionFormValues = CreatePromotionFormProps[keyof CreatePromotionFormProps] | Date;

export type CurrentStepProps = '1' | '2';

export interface StepProps {
  promotion: CreatePromotionFormProps;
  handleChangePromotion: (key: CreatePromotionFormKeys, value: CreatePromotionFormValues) => void;
  promotionType: PromotionType;
}

interface PromotionAdditionModalProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  promotionType: PromotionType;
  handleClosePromotionTypeModal: () => void;
}

export function PromotionAdditionModal({
  showModal,
  setShowModal,
  promotionType,
  handleClosePromotionTypeModal,
}: PromotionAdditionModalProps) {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: RootType) => state.promotions);

  const [currentStep, setCurrentStep] = useState<CurrentStepProps>('1');
  const [promotion, setPromotion] = useState<CreatePromotionFormProps>({
    title: '',
    startDate: null,
    endDate: null,
    message: '',
    discount: undefined,
    item: '',
    banner: null,
    redirectUrl: null,
    status: 'active',
    restriction: null,
    addedUnits: [],
  });

  const isFirstStep = currentStep === '1';
  const isGetInPromotion = promotionType === 'get-in';

  const formWarningMessage = 'Você deve preencher todos os campos necessários!';

  const hasAllRequiredFieldsOnFirstStep = isGetInPromotion
    ? !!promotion.title &&
      !!promotion.startDate &&
      !!promotion.endDate &&
      !!promotion.message &&
      !!promotion.restriction &&
      !!promotion.status
    : !!promotion.title && !!promotion.startDate && !!promotion.endDate && !!promotion.redirectUrl;

  const hasAllRequiredFieldsOnSecondStep =
    !!promotion.addedUnits.length &&
    promotion.addedUnits.every((unit) =>
      isGetInPromotion ? (unit?.rescue_limit as number) >= 1 : !unit?.rescue_limit,
    );

  const hasAllRequiredFields = hasAllRequiredFieldsOnFirstStep && hasAllRequiredFieldsOnSecondStep;

  const handleChangePromotion = (key: CreatePromotionFormKeys, value: CreatePromotionFormValues) => {
    setPromotion((oldValues) => {
      return {
        ...oldValues,
        [key]: value,
      };
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setPromotion({
      title: '',
      startDate: null,
      endDate: null,
      message: '',
      discount: undefined,
      item: '',
      banner: null,
      redirectUrl: null,
      status: 'active',
      restriction: null,
      addedUnits: [],
    });
    goBackButton();
    handleClosePromotionTypeModal();
  };

  const goBackButton = () => {
    setCurrentStep('1');
    dispatch(UnityCreators.resetUnityData());
  };

  const onFinishFirstStep = () => {
    if (!hasAllRequiredFieldsOnFirstStep) {
      const fieldsWithError: string[] = [];

      if (!promotion.title) fieldsWithError.push('Título');
      if (!promotion.startDate) fieldsWithError.push('Data de início');
      if (!promotion.endDate) fieldsWithError.push('Data de término');

      if (isGetInPromotion) {
        if (!promotion.message) fieldsWithError.push('Mensagem da promoção');
        if (!promotion.restriction) fieldsWithError.push('Cadastro ilimitado ou único');
      }

      if (promotion.redirectUrl) {
        const linkHasHttpProtocol = !!promotion.redirectUrl.match(
          REGULAR_EXPRESSIONS.urlWithHttpOrHttpsProtocolsRequiredRegExp,
        );
        if (!linkHasHttpProtocol) fieldsWithError.push('Link da promoção inválido');
      } else {
        fieldsWithError.push('Link da promoção');
      }

      if (!promotion.status) fieldsWithError.push('Status (ativa ou inativa)');

      const descriptionMessage = `Campos não preenchidos: ${fieldsWithError
        .map((field) => field)
        .join(', ')
        .replace(/, ([^,]*)$/, ' e $1.')}`;

      notification.warning(formWarningMessage, descriptionMessage);
      return;
    }
    setCurrentStep('2');
  };

  const onFinishForm = () => {
    if (!hasAllRequiredFields) {
      notification.warning(formWarningMessage, 'Selecione estabelecimentos com número de unidades válidas.');
      return;
    }

    const newPromotion: AddPromotionProps = Object.assign(
      {
        title: promotion.title.trim(),
        start_at: dayjs(promotion.startDate).format('YYYY-MM-DD'),
        end_at: dayjs(promotion.endDate).format('YYYY-MM-DD'),
        product: 'menu',
        status: promotion.status,
        units: promotion.addedUnits,
      } as AddPromotionProps,
      promotion.discount && { discount: promotion.discount },
      promotion.banner && {
        banner: promotion.banner,
      },
      promotion.item && { item: promotion.item.trim() },
      promotion.message && { message: promotion.message.trim() },
      promotion.restriction && { restriction: promotion.restriction },
      promotion.redirectUrl && { redirect_url: promotion.redirectUrl.trim() },
    );

    dispatch(PromotionCreators.createPromotionRequest({ newPromotion, promotionType }));
    closeModal();
  };

  const stepProps = { promotion, handleChangePromotion, promotionType };

  return (
    <S.PromotionAdditionModal
      promotionType={promotionType}
      step={currentStep}
      open={showModal}
      onCancel={closeModal}
      footer={null}
      title={
        <>
          <Title level={3}>Criar Promoção {!isGetInPromotion && 'via Link'}</Title>
          <S.CustomDivider type="horizontal" mt="1.5rem" />
        </>
      }
    >
      <form onSubmit={isFirstStep ? onFinishFirstStep : onFinishForm}>
        {isFirstStep ? <Step1 {...stepProps} /> : <Step2 {...stepProps} />}
      </form>

      <S.ButtonsWrapper step={currentStep}>
        {isFirstStep ? (
          <Button onClick={onFinishFirstStep} disabled={isLoading}>
            Avançar
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={goBackButton} disabled={isLoading}>
              Voltar
            </Button>

            <Button onClick={onFinishForm} disabled={isLoading}>
              Criar Promoção
            </Button>
          </>
        )}
      </S.ButtonsWrapper>
    </S.PromotionAdditionModal>
  );
}

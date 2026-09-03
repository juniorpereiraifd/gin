import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { PromotionData } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import * as S from './styles';

export type CurrentStepProps = '1' | '2';

export interface StepProps {
  promotion: PromotionData;
}

interface PromotionVisualizationModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  promotion: PromotionData | null;
}

export function PromotionVisualizationModal({
  showModal,
  onCloseModal,
  promotion,
}: PromotionVisualizationModalProps) {
  const { isLoading } = useSelector((state: RootType) => state.promotions);

  const [currentStep, setCurrentStep] = useState<CurrentStepProps>('1');

  const isFirstStep = currentStep === '1';

  const goBackStep = () => setCurrentStep('1');
  const goNextStep = () => setCurrentStep('2');

  const closeVisualizationModal = () => {
    onCloseModal();
    goBackStep();
  };

  return (
    <S.PromotionVisualizationModal
      step={currentStep}
      open={showModal}
      onCancel={closeVisualizationModal}
      footer={null}
      title={
        <>
          <Title level={3}>Promoção: {promotion?.title}</Title>
          <S.CustomDivider type="horizontal" mt="1.5rem" />
        </>
      }
    >
      {isFirstStep ? (
        <Step1 promotion={promotion!} />
      ) : (
        <Step2 promotion={promotion!} />
      )}

      <S.ButtonsWrapper step={currentStep}>
        {isFirstStep ? (
          <Button onClick={goNextStep} disabled={isLoading}>
            Avançar
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              onClick={goBackStep}
              disabled={isLoading}
            >
              Voltar
            </Button>

            <Button onClick={closeVisualizationModal} disabled={isLoading}>
              Fechar
            </Button>
          </>
        )}
      </S.ButtonsWrapper>
    </S.PromotionVisualizationModal>
  );
}

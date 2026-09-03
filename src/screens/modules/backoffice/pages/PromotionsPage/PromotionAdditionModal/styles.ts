import { Divider } from 'antd';
import { FormItem } from 'src/stories/entry';
import { Modal } from 'src/stories/feedback/Modal';
import styled, { css } from 'styled-components';
import media from 'styled-media-query';
import type { CurrentStepProps } from '.';
import type { PromotionType } from '..';

type ModalProps = {
  promotionType: PromotionType;
  step: CurrentStepProps;
};

export const PromotionAdditionModal = styled(Modal)<ModalProps>`
  display: flex;
  flex-direction: column;

  width: 100%;

  ${({ step, promotionType }) => css`
    min-width: ${(step === '1' && promotionType === 'get-in' && '80rem') ||
    (step === '1' && promotionType === 'external-link' && '42rem') ||
    (step === '2' && '117.4rem')};
  `}

  .ant-modal-body {
    padding: 0 1.5rem 1.5rem;
  }

  ${media.lessThan('large')`
    min-width: auto;
  `}
`;

export const DiscountFormItem = styled(FormItem)`
  > div {
    display: flex;
    align-items: center;

    .ant-input-number {
      width: 33%;
    }

    .percent {
      margin-left: 0.312rem;
    }
  }
`;

export const CustomDivider = styled(Divider)<{
  withoutMargin?: boolean;
  mt?: string | number;
}>`
  ${({ withoutMargin, mt }) => css`
    margin: ${withoutMargin ? 0 : 'unset'};
    margin-top: ${mt ? mt : 0};
  `}
`;

export const ContentWrapper = styled.div<{
  promotionType: PromotionType;
  step: CurrentStepProps;
}>`
  display: grid;
  ${({ promotionType, step }) => css`
    grid-template-columns: ${promotionType === 'external-link' && step === '1'
      ? '1fr'
      : 'repeat(2, 1fr)'};
  `}
  gap: 2.18rem;

  ${media.lessThan('large')`
    grid-template-columns: 1fr;
  `}
`;

export const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  gap: 1.25rem;
`;

export const RightContent = styled.div<{ step: CurrentStepProps }>`
  display: flex;
  flex-direction: column;

  width: 100%;

  ${({ theme, step }) => css`
    gap: ${step === '1' ? '2rem' : theme.spacings.xxsmall};

    h3 {
      font-style: normal;
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.highContrast};
    }
  `}

  ${media.lessThan('large')`
    img {
      width: 16.87rem;
      height: 34.375rem;
    }
  `}
`;

export const PreVisualization = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;

  width: 100%;
  height: 100%;
`;

export const PreviewBox = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  pointer-events: none;
  user-select: none;

  width: 100%;
  height: 14.1rem;

  box-shadow: 0px 0px 16px rgba(228, 231, 231, 0.5);
  border-radius: 0.9rem;

  padding: 0.625rem 1rem;
  gap: 0.312rem;
`;

export const PreviewDetails = styled.div`
  width: 60%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;

  p {
    width: 100%;
    max-width: 11.25rem;
    height: 100%;

    margin: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  button {
    max-width: 100%;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const PreviewImageWrapper = styled.div`
  width: 40%;
  height: 100%;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    ${({ theme }) => css`
      border-radius: ${theme.border.radius.normal};
    `}
  }
`;

export const DatesWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 1.25rem;

  align-items: center;
  justify-content: flex-start;
`;

export const SeparatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.312rem;

  align-items: flex-start;
  justify-content: flex-start;
`;

export const InputBanner = styled.label`
  cursor: pointer;

  width: 100%;
  min-width: 31.5rem;
  min-height: 3.6rem;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.625rem;
  padding: 0.6rem 0.625rem;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.midContrast};
    border-radius: ${theme.border.radius.normal};
  `}

  > div {
    padding: 0.2rem 0.8rem;

    min-width: 6.1rem;
    min-height: 1.5rem;

    ${({ theme }) => css`
      background: ${theme.colors.highContrast};
      border-radius: ${theme.border.radius.normal};
      color: ${theme.colors.white};

      font-style: normal;
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.small};
      line-height: ${theme.font.sizes.xlarge};
    `}
  }

  > span {
    ${({ theme }) => css`
      font-style: normal;
      font-weight: ${theme.font.medium};
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.medium};

      color: ${theme.colors.totalContrast};
    `}
  }
`;

export const ItensWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 0.625rem;

  span {
    display: flex;
  }

  > div {
    width: 100%;

    display: flex;
    flex-direction: column;

    gap: 0.312rem;

    input {
      min-height: 2.5rem;
    }
  }
`;

export const FileDescription = styled.p`
  margin: 0;

  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.xsmall};
    line-height: ${theme.font.sizes.medium};

    color: ${theme.colors.midContrast};
  `}
`;

export const StatusPromotionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.625rem;
`;

export const ButtonsWrapper = styled.div<{ step: CurrentStepProps }>`
  margin-top: 3.4rem;
  width: 100%;

  display: flex;
  align-items: center;

  ${({ step }) => css`
    justify-content: ${step === '1' ? 'center' : 'space-between'};
  `}
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
  `}
`;

export const Description = styled.p`
  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.medium};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.highContrast};
  `}
`;

export const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  gap: 1.25rem;

  padding-top: 1.25rem;

  width: 100%;

  ${({ theme }) => css`
    border: 1px solid ${theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const SearchBoxDescriptionWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const SearchBoxDescription = styled.p`
  margin: 0 1rem;

  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.normal};
    font-size: ${theme.font.sizes.medium};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.midContrast};
  `}
`;

export const SearchBoxDescriptionButtons = styled.div`
  display: flex;
  gap: 0.625rem;
`;

export const HelperForImportCSVContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  padding: 0.625rem;
  gap: 0.625rem;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};

    background: ${theme.colors.white};

    border-radius: 0.6rem;
  `}
`;

export const SearchBoxInputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
  `}

  button {
    min-width: 11.6rem;
    min-height: 2.5rem;

    ${({ theme }) => css`
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      text-align: center;

      color: ${theme.colors.grayLight};
    `}
  }
`;

export const SearchBoxResultWrapper = styled.div`
  width: 100%;
  height: 33.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall};

    background: ${theme.colors.backgroundGray};
    border-radius: 0 0 ${theme.border.radius.medium}
      ${theme.border.radius.medium};
  `}
`;

export const SearchBoxResult = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.625rem 1rem;

  .left-content {
    display: flex;
    gap: 0.6rem;
  }

  ${({ theme }) => css`
    background: ${theme.colors.white};

    border: 1px solid ${theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

export const QuantityUnityBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0.6rem 0.625rem;
  gap: 0.625rem;

  min-width: 7.4rem;
  min-height: 3.2rem;

  ${({ theme }) => css`
    background: ${theme.colors.white};
    color: ${theme.colors.midContrast};

    border: 1px solid ${theme.colors.midContrast};
    border-radius: ${theme.border.radius.medium};
  `}

  .quantity-unity {
    width: 4.375rem;
    border: 0;

    ${({ theme }) => css`
      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.medium};
      line-height: ${theme.font.sizes.xlarge};

      color: ${theme.colors.totalContrast};
    `}
  }
`;

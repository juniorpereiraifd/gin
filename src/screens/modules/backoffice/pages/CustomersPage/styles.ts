import styled, { css } from 'styled-components';
import { Col } from 'antd';
import { DatePicker } from 'antd';

export const Wrapper = styled(Col)`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacings.xlarge};
    padding: ${theme.spacings.xsmall};
  `}
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.625rem;
`;

export const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;

  ${({ theme }) => css`
    background: ${theme.colors.white};

    box-shadow: 0px 4px 12px rgba(20, 20, 20, 0.2);
    border-radius: ${theme.spacings.xxsmall};
  `}
`;

export const FilterBy = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${({ theme }) => css`
    gap: ${theme.spacings.small};

    h4 {
      color: ${theme.colors.totalContrast};
    }
  `}
`;

export const ViewByDate = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
  `}

  .title-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    ${({ theme }) => css`
      gap: ${theme.spacings.xxxsmall};

      h5 {
        color: ${theme.colors.totalContrast};
      }
    `}
  }
`;

export const CustomDatePicker = styled(DatePicker.RangePicker)`
  ${({ theme }) => css`
    border: 1px solid ${theme.colors.grayBorder};
    border-radius: ${theme.border.radius.normal};
  `}
`;

export const ButtonsWrapper = styled.div`
  display: flex;
  gap: 0.625rem;

  margin-top: 1.25rem;
`;

export const ClientsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  ${({ theme }) => css`
    margin-top: 1rem;
    gap: ${theme.spacings.xsmall};
  `}
`;

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
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

  ${({ theme }) => css`
    button {
      min-height: 1.875rem;

      border-radius: ${theme.border.radius.medium};

      font-style: normal;
      font-weight: ${theme.font.bold};
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.medium};
    }
  `}
`;

export const SearchBoxResultWrapper = styled.div`
  width: 100%;
  height: auto;
  max-height: 31.25rem;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall};

    background: ${theme.colors.backgroundGray};
    border-radius: 0 0 ${theme.border.radius.normal}
      ${theme.border.radius.normal};
  `}

  p {
    margin: 0;
  }
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

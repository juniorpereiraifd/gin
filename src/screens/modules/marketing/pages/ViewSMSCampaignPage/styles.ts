import { Col } from 'antd';
import styled, { css } from 'styled-components';

export const Wrapper = styled(Col)`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacings.small};
  `}
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  span {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    gap: 0.625rem;
  }

  button {
    margin-left: auto;
  }
`;

export const Back = styled.p`
  width: fit-content;

  ${({ theme }) => css`
    font-weight: ${theme.font.medium};
    font-size: ${theme.font.sizes.medium};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.totalContrast};

    margin: auto 0;

    &:hover {
      cursor: pointer;
    }

    svg {
      margin-right: 0.312rem;
    }
  `}
`;

export const Column = styled.div<{ gap: 'sm' | 'lg' }>`
  display: flex;
  flex-direction: column;

  ${({ gap }) => css`
    gap: ${gap === 'sm' ? '1rem' : '2rem'};
  `}
`;

export const Content = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(2, 1fr);

  gap: 1.875rem;
`;

export const CardColumn = styled.div<{ rowDirection?: boolean }>`
  display: flex;
  gap: 0.625rem;

  ${({ rowDirection }) => css`
    flex-direction: ${rowDirection ? 'row' : 'column'};
  `}
`;

export const Card = styled.div<{ gap: 'sm' | 'lg' }>`
  display: flex;
  flex-direction: column;

  padding: 0.625rem 1rem;

  width: 100%;
  height: 100%;

  box-shadow: 0px 8px 24px rgba(20, 20, 20, 0.16);
  border-radius: 0.6rem;

  ${({ theme, gap }) => css`
    background-color: ${theme.colors.white};
    gap: ${gap === 'sm' ? '0.5rem' : '1rem'};

    .title {
      font-weight: ${theme.font.bold};
      color: ${theme.colors.totalContrast};
    }

    .description {
      font-weight: ${theme.font.medium};
      color: ${theme.colors['mono-low-medium']};
    }

    .title,
    .description {
      margin: 0;
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.medium};
    }
  `}
`;

import { Radio as CustomRadio } from 'antd';
import styled, { css } from 'styled-components';

export const RadioGroup = styled(CustomRadio.Group)`
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 1rem;
`;

export const Radio = styled(CustomRadio)<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 1rem;
  padding: 1rem;

  width: 100%;
  min-height: 8.7rem;

  ${({ theme, active }) => css`
    background: ${theme.colors.white};

    border: 1px solid
      ${active ? theme.colors.midContrast : theme.colors.grayLight};
    border-radius: ${theme.border.radius.medium};

    &:hover {
      border: 1px solid ${theme.colors.midContrast};

      span {
        color: ${theme.colors.totalContrast};
      }
    }
  `}

  span {
    padding: 0;

    svg {
      margin-right: 0.312rem;
    }

    ${({ theme, active }) => css`
      font-style: normal;
      font-weight: ${theme.font.normal};
      font-size: ${theme.font.sizes.xsmall};
      line-height: ${theme.font.sizes.large};

      color: ${active ? theme.colors.totalContrast : theme.colors.highContrast};
    `};
  }
`;

export const Title = styled.h3`
  ${({ theme }) => css`
    font-style: normal;
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.small};
    line-height: ${theme.font.sizes.xlarge};

    color: ${theme.colors.totalContrast};
  `}
`;

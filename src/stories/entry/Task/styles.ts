import styled, { css } from 'styled-components';
import { Checkbox as CustomCheckbox } from 'antd';

export const Wrapper = styled.div`
  min-width: 3.125rem;
  display: flex;
  align-items: center;
`;

export const Checkbox = styled(CustomCheckbox)`
  display: flex;
  align-items: center;
  margin-right: 1rem;

  transform: scale(1.4);

  .ant-checkbox,
  .ant-checkbox-input,
  .ant-checkbox-inner {
    ${({ theme }) => css`
      border-radius: ${theme.spacings.xxxsmall};
    `}
  }
`;

export const Title = styled.h3`
  ${({ theme }) => css`
    overflow-wrap: normal;
    word-wrap: break-word;
    hyphens: auto;
    font-weight: ${theme.font.bold};
    font-size: ${theme.font.sizes.large};
    margin: 0;
  `}
`;

import styled, { css } from 'styled-components';

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  .ant-form-item {
    margin: 0;
  }

  ${({ theme }) => css`
    label.visibility-control-label {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

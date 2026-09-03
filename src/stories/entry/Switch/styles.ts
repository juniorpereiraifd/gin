import styled, { css } from 'styled-components';

type WrapperSwitchProps = {
  align?: 'top' | 'center';
};

export const WrapperSwitch = styled.div<WrapperSwitchProps>`
  display: flex;

  > div {
    margin: 0;
  }

  ${({ theme, align }) => css`
    align-items: ${align === 'top' ? 'flex-start' : 'center'};

    > label {
      font-size: ${theme.font.sizes.small};
      color: ${theme.colors['slate-600']};
      margin-left: 1rem;
    }
  `}
`;

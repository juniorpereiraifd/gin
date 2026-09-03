import styled, { css, keyframes } from 'styled-components';
import { Spinner8 as Spinner } from '@styled-icons/icomoon/Spinner8';

const rotate = keyframes`
  from{
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Loading = styled(Spinner)`
  ${({ theme }) => css`
    color: ${theme.colors.primary};
    margin-right: ${theme.spacings.xxsmall};
    animation: ${rotate} 0.5s linear infinite;
  `}
`;

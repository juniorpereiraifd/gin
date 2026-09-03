import styled, { css } from 'styled-components';
import { SmallProps } from '.';

export const Small = styled.small<SmallProps>`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.xsmall};
  `}
  color: ${(props) => props.color};
`;

import styled from 'styled-components';
import { LogoProps } from '.';

export const Wrapper = styled.div<LogoProps>`
  width: fit-content;
  height: fit-content;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

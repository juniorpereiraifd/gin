import styled, { css } from 'styled-components';
import { Layout } from 'antd';

export const Wrapper = styled(Layout)`
  min-height: 100vh;
  overflow: hidden;

  ${({ theme }) => css`
    background-color: ${theme.colors.backgroundContrast};
  `}
`;

export const Content = styled(Layout)`
  height: 100%;
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    background-color: ${theme.colors.backgroundContrast};
  `}
`;

import styled, { css } from 'styled-components';
import { Row } from 'antd';
import Box from 'src/stories/general/Box';

export const Wrapper = styled(Row)`
  height: calc(100vh - 2.18rem);
`;

export const Container = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

export const Image = styled.img`
  ${({ theme }) => css`
    margin: ${theme.spacings.xsmall} 0px;
  `}
`;

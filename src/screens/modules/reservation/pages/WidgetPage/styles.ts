import styled, { css } from 'styled-components';
import { List } from 'antd';
import Box from 'src/stories/general/Box';

export const ListItem = styled(List.Item)`
  ${({ theme }) => css`
    background: ${theme.colors.white};
    border: 0;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    margin-bottom: 10px;
    font-size: 17px;

    div > span {
      margin-right: 15px;
    }
  `}
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const SelectedUnits = styled(Box)`
  ${({ theme }) => css`
    background: ${theme.colors.mainBg};
    border: 0;
    box-shadow: none;
    padding: ${theme.spacings.xsmall};
    max-height: 15.62rem;
    overflow: auto;
    margin: ${theme.spacings.xsmall} 0;
  `}
`;

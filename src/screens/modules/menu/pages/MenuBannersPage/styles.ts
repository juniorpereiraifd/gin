import styled, { css } from 'styled-components';
import { Tabs as BaseTabs } from 'antd';

const { TabPane } = BaseTabs;

export const Container = styled.div`
  width: 100%;
  height: 100%;
  max-width: 1024px;

  display: flex;
  flex-direction: column;

  gap: 1.25rem;

  margin-bottom: 1.25rem;
`;

export const Pane = styled(TabPane)`
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.large};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.white};
    padding: ${theme.spacings.small} ${theme.spacings.small};
  `};
`;

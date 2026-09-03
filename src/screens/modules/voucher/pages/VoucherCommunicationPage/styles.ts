import styled, { css } from 'styled-components';
import { Tabs as CustomTabs } from 'antd';
import { Title as CustomTitle } from 'src/stories/typography';

const { TabPane } = CustomTabs;

export const Title = styled(CustomTitle)`
  margin-bottom: 1.25rem;
`;

export const Container = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: 80% 20%;
  grid-template-rows: auto auto;

  grid-row-gap: 1.25rem;

  margin-bottom: 1.25rem;
`;

export const WrapperTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SideMenu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;

  gap: 1.25rem;

  grid-row-start: 2;
`;

export const Pane = styled(TabPane)`
  ${({ theme }) => css`
    width: 100%;
    border-radius: ${theme.border.radius.large};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.white};
    padding: ${theme.spacings.small} ${theme.spacings.small};
    font-weight: ${theme.font.medium} !important;
  `};
`;

export const WrapperSms = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    > p.description {
      color: ${theme.colors.highContrast};
    }
  `};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.625rem;
`;

export const WrapperSwitch = styled.div`
  display: flex;
  align-items: center;

  margin-bottom: 1.25rem;

  > div {
    margin: 0;
  }

  > span {
    margin-left: 1rem;
  }
`;

export const Sector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-block: 0.625rem;

  > span.title {
    margin-bottom: 0.625rem;
    font-weight: ${({ theme }) => theme.font.bold};
  }
`;

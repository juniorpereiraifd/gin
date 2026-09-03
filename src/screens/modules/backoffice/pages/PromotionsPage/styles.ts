import styled, { css } from 'styled-components';
import { Col, Tabs as CustomTabs } from 'antd';

const { TabPane } = CustomTabs;

const TabPaneStyles = css`
  ${({ theme }) => css`
    border-radius: ${theme.border.radius.large};
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors.white};
    padding: ${theme.spacings.xsmall};
  `};
`;

export const Wrapper = styled(Col)`
  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacings.small};
  `}
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  gap: 0.625rem;
`;

export const PromotionsTabContent = styled(TabPane)`
  ${TabPaneStyles};

  display: flex;
  flex-direction: column;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
  `}
`;

export const LabelWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

export const Label = styled.p<{ variant: 'primary' | 'secondary' }>`
  margin: 0;

  ${({ theme, variant }) => css`
    font-style: normal;
    font-weight: ${theme.font.medium};

    font-size: ${variant === 'primary'
      ? theme.font.sizes.medium
      : theme.font.sizes.xsmall};

    line-height: ${variant === 'primary'
      ? theme.font.sizes.xlarge
      : theme.font.sizes.medium};

    color: ${theme.colors.midContrast};
  `}
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  overflow-y: auto;

  height: auto;
  max-height: 31.25rem;

  ${({ theme }) => css`
    gap: ${theme.spacings.xsmall};
    padding: ${theme.spacings.xsmall};

    background: ${theme.colors.lightGray};
    border-radius: 0 0 ${theme.border.radius.normal}
      ${theme.border.radius.normal};
  `}

  p {
    margin: 0;
  }
`;

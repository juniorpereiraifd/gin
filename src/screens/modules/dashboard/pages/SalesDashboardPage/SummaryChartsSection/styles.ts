import styled, { css } from 'styled-components';
import { Skeleton as BaseSkeleton } from 'antd';
import { Title as BaseTitle } from 'src/stories/typography';

export const ChartsSection = styled.section`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1.25rem;
`;

export const PieChartContent = styled.div`
  grid-column: span 2;
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;

  padding: 1.25rem;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors['zinc-200']};
    filter: ${theme['drop-shadow'].sm};
    border-radius: ${theme.border.radius.medium};
  `}
`;

export const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  padding: 1.25rem;

  ${({ theme }) => css`
    background-color: ${theme.colors.white};
    border: 1px solid ${theme.colors['zinc-200']};
    filter: ${theme['drop-shadow'].sm};
    border-radius: ${theme.border.radius.medium};
  `}
`;

type BoxInfoWrapper = {
  variant?: 'normal' | 'small';
};

export const BoxInfoWrapper = styled.div<BoxInfoWrapper>`
  ${({ theme, variant = 'normal' }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${variant === 'normal' ? '1rem' : '0.2rem'};

    > span.info-value {
      font-size: ${variant === 'normal'
        ? theme.font.sizes.medium
        : theme.font.sizes.small};
      font-weight: ${theme.font.bold};
    }

    > span.info-title {
      font-size: ${variant === 'normal'
        ? theme.font.sizes.small
        : theme.font.sizes.xsmall};
      color: ${theme.colors.textGray};
    }
  `}
`;

export const Title = styled(BaseTitle)`
  ${({ theme }) => css`
    font-size: ${theme.font.sizes.medium};
  `}
`;

export const ChartContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 1.25rem;
`;

export const ContentLegend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`;

type LegendProps = {
  color: string;
};

export const Legend = styled.li<LegendProps>`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  ${({ theme, color }) => css`
    .legend-color {
      width: 1rem;
      height: 1rem;
      border-radius: ${theme.border.radius.normal};
      background-color: ${color};
    }

    .legend-text {
      font-size: ${theme.font.sizes.xsmall};
      color: ${theme.colors.textGray};
    }
  `}
`;

export const HeaderPieChart = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;

  > svg {
    margin: 0;
  }

  ${({ theme }) => css`
    span {
      font-size: ${theme.font.sizes.xsmall};
      color: ${theme.colors.textGray};
    }
  `}
`;

export const Skeleton = styled(BaseSkeleton.Button)`
  display: flex;
  height: fit-content;

  .ant-skeleton-button {
    width: 6.25rem;
    height: 1.25rem;
  }
`;

export const EmptyMessage = styled.div`
  ${({ theme }) => css`
    flex: 1;
    text-align: center;

    span {
      font-size: ${theme.font.sizes.medium};
      color: ${theme.colors.textGraySecondary};
    }
  `}
`;

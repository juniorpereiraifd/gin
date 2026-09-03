import styled, { css } from 'styled-components';
import { Tooltip as CustomTooltip } from 'antd';
import { Button } from 'src/stories/general/Button';

type BoxColorProps = {
  color: string;
};

type CircleLegendProps = {
  color: string;
};

type LegendTextProps = {
  fontSize: string;
  fontColor: string;
};

export const WrapperChart = styled.div`
  display: flex;
  flex-direction: column;
`;

type TooltipProps = {
  hasTooltipHover: boolean;
};

export const ContentLegend = styled.div`
  display: flex;
  align-items: center;

  gap: 0.625rem;
`;

export const CircleLegend = styled.div<CircleLegendProps>`
  width: 1rem;
  height: 1rem;

  border-radius: 50% 50%;

  ${({ color }) => css`
    background-color: ${color};
  `}
`;

type LegendProps = {
  fontSize?: string;
};

export const Legend = styled.span<LegendProps>`
  max-width: 6.875rem;

  ${({ theme, fontSize = '1.4rem' }) => css`
    font-family: ${theme.font.family};
    font-weight: ${theme.font.bold};
    font-size: ${fontSize};
  `}
`;

export const Tooltip = styled.div<TooltipProps>`
  align-items: center;

  gap: 0.625rem;

  border-radius: 0.312rem;

  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);

  ${({ theme, hasTooltipHover }) => css`
    display: ${hasTooltipHover ? 'flex' : 'none'};
    padding: 0.625rem;

    color: ${theme.colors.black};
    background-color: ${theme.colors.white};

    > strong {
      font-size: ${theme.font.sizes.small};
    }
  `}
`;

export const BoxColor = styled.div<BoxColorProps>`
  ${({ color }) => css`
    width: 1rem;
    height: 1rem;
    background-color: ${color};
  `}
`;

export const TooltipInfo = styled(CustomTooltip)`
  ${({ theme }) => css`
    color: ${theme.colors.highContrast};
  `}

  .ant-tooltip-inner {
    border-radius: 5px;
  }
`;

export const ContentTooltip = styled.div`
  display: flex;
  flex-direction: column;

  gap: 0.625rem;
`;

export const CustomButton = styled(Button)`
  width: 100%;
`;

export const LegendText = styled.text<LegendTextProps>`
  ${({ fontSize, fontColor }) => css`
    font-size: ${fontSize};
    font-weight: 600;
    fill: ${fontColor};
  `}
`;

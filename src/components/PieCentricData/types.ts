type DataProps = {
  id: string;
  label: string;
  value: number;
  color: string;
  ignoreValue?: boolean;
};

export type Props = {
  data: DataProps[];
  width: number;
  height: number;
  innerRadius?: number;
  fontSizeCentricData: string;
  fontSizeLegend?: string;
  withLegend?: boolean;
  isPercent?: boolean;
  isCurrency?: boolean;
  textTooltip?: string;
  hasTooltipHover?: boolean;
  textButtonTooltip?: string;
  buttonTooltipIsLink?: boolean;
  buttonTooltipUrl?: string;
  activeOuterRadiusOffset?: number;
  legend?: React.ReactNode;
  centricData?: { value: string | number; isPercent?: boolean; color?: string };
  onClickTooltipButton?: () => void;
  margin: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

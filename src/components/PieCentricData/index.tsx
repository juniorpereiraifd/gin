import { DefaultRawDatum, Pie, PieCustomLayerProps } from '@nivo/pie';
import { InfoCircle } from '@styled-icons/boxicons-regular/InfoCircle';
import { theme } from 'src/styles/theme';
import * as S from './styles';
import { Props } from './types';
import { getCurrencyBrl } from 'src/utils/helpers';

export const PieCentricData = ({
  data,
  width,
  height,
  innerRadius = 0.8,
  fontSizeCentricData,
  fontSizeLegend,
  margin,
  withLegend = false,
  isPercent = false,
  isCurrency = false,
  textTooltip,
  hasTooltipHover = true,
  textButtonTooltip,
  buttonTooltipIsLink,
  buttonTooltipUrl,
  onClickTooltipButton,
  activeOuterRadiusOffset = 8,
  legend,
  centricData,
}: Props) => {
  const commonProperties = {
    width,
    height,
    innerRadius,
    margin,
    data,
    animate: true,
    activeOuterRadiusOffset,
  };

  const CenteredMetric = ({
    centerX,
    centerY,
  }: PieCustomLayerProps<DefaultRawDatum>) => {
    let total = 0;

    data
      .filter((item) => !item.ignoreValue)
      .forEach((item) => {
        total += item.value;
      });

    return (
      <S.LegendText
        x={centerX}
        y={centerY}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSizeCentricData}
        fontColor={centricData?.color || theme.colors.black}
      >
        {typeof centricData?.value === 'number'
          ? `${centricData?.value.toFixed(0)}${
              centricData.isPercent ? '%' : ''
            }`
          : `${isCurrency ? getCurrencyBrl(total) : total}${
              isPercent && !isCurrency ? '%' : ''
            }`}
      </S.LegendText>
    );
  };

  return (
    <S.WrapperChart>
      <Pie
        {...commonProperties}
        enableArcLabels={true}
        activeInnerRadiusOffset={commonProperties.activeOuterRadiusOffset}
        colors={{ datum: 'data.color' }}
        layers={['arcs', 'legends', CenteredMetric]}
        tooltip={({ datum: { value, color, label } }) => (
          <S.Tooltip hasTooltipHover={hasTooltipHover}>
            {hasTooltipHover ? (
              <>
                <S.BoxColor color={color} />
                <strong>
                  {label}: {isCurrency ? getCurrencyBrl(value) : value}
                </strong>
              </>
            ) : (
              <></>
            )}
          </S.Tooltip>
        )}
      />
      {withLegend ? (
        <S.ContentLegend>
          {legend ? (
            legend
          ) : (
            <>
              <S.CircleLegend color={data[0].color} />
              <S.Legend fontSize={fontSizeLegend}>{data[0].label}</S.Legend>
            </>
          )}
          {textTooltip ? (
            <S.TooltipInfo
              placement="bottom"
              title={
                <S.ContentTooltip>
                  {textTooltip}
                  {buttonTooltipIsLink ? (
                    <a href={buttonTooltipUrl} target="_blank" rel="noreferrer">
                      <S.CustomButton
                        type="outlineTransparent"
                        onClick={onClickTooltipButton}
                      >
                        {textButtonTooltip}
                      </S.CustomButton>
                    </a>
                  ) : (
                    <S.CustomButton
                      type="outlineTransparent"
                      onClick={onClickTooltipButton}
                    >
                      {textButtonTooltip}
                    </S.CustomButton>
                  )}
                </S.ContentTooltip>
              }
            >
              <InfoCircle size={16} />
            </S.TooltipInfo>
          ) : null}
        </S.ContentLegend>
      ) : null}
    </S.WrapperChart>
  );
};

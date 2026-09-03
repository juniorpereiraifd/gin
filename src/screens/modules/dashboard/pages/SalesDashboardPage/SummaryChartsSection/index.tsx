import { Fragment, FunctionComponent, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import Loading from 'src/stories/feedback/Loading';
import { PieCentricData } from 'src/components/PieCentricData';
import * as S from './styles';
import { getCurrencyBrl } from 'src/utils/helpers';

type SummatyChartsSectionProps = {
  hasReservationModule: boolean;
};

export const SummatyChartsSection: FunctionComponent<
  SummatyChartsSectionProps
> = (props) => {
  const { hasReservationModule } = props;
  const {
    dashboard: { loadingSalesSummary, salesSummary },
  } = useSelector((state: RootType) => state);

  const pieChartData = useMemo(() => {
    if (hasReservationModule === false) {
      return mockedData;
    }

    if (salesSummary !== null) {
      return salesSummary.sales_by_type.map((item) => ({
        id: item.type,
        label: pieChartDescriptionData[item.type].title,
        value: item.quantity,
        color: pieChartDescriptionData[item.type].color,
      }));
    }
  }, [salesSummary, hasReservationModule]);

  const totalValueSold = useMemo(() => {
    if (hasReservationModule === false) {
      return getCurrencyBrl(45000);
    }
    if (salesSummary !== null) {
      return getCurrencyBrl(salesSummary?.amount_total / 100);
    }
  }, [salesSummary, hasReservationModule]);

  const averageTicket = useMemo(() => {
    if (hasReservationModule === false) {
      return getCurrencyBrl(450);
    }
    if (salesSummary !== null) {
      return getCurrencyBrl(
        salesSummary.amount_total === 0 || salesSummary?.sales_total === 0
          ? 0
          : salesSummary?.amount_total / salesSummary?.sales_total / 100
      );
    }
  }, [salesSummary, hasReservationModule]);

  const pieChartDataIsVisible = () => {
    if (hasReservationModule === false) {
      return false;
    }

    if (pieChartData === undefined || pieChartData.length <= 0) {
      return false;
    }

    return true;
  };

  return (
    <S.ChartsSection>
      <S.PieChartContent>
        <S.HeaderPieChart>
          <S.Title level={4}>Vendas</S.Title>
          {loadingSalesSummary === true && hasReservationModule === true && (
            <S.LoadingWrapper>
              <Loading size={14} />
              <span>Carregando dados...</span>
            </S.LoadingWrapper>
          )}
        </S.HeaderPieChart>
        <S.ChartContent>
          {loadingSalesSummary === false &&
          pieChartDataIsVisible() === false ? (
            <S.EmptyMessage>
              <span>Não há dados de vendas disponíveis</span>
            </S.EmptyMessage>
          ) : (
            <Fragment>
              <PieCentricData
                data={pieChartData ?? []}
                width={200}
                height={200}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                fontSizeCentricData="20px"
              />
              <S.ContentLegend>
                {salesSummary !== null &&
                  salesSummary.sales_by_type.map((item) => (
                    <S.Legend
                      key={item.type}
                      color={pieChartDescriptionData[item.type].color}
                    >
                      <div className="legend-color" />
                      <span className="legend-text">
                        {pieChartDescriptionData[item.type].title}
                      </span>
                    </S.Legend>
                  ))}
              </S.ContentLegend>
            </Fragment>
          )}
        </S.ChartContent>
      </S.PieChartContent>
      <S.SummaryBox>
        <S.BoxInfoWrapper>
          {loadingSalesSummary && hasReservationModule === true ? (
            <S.Skeleton active />
          ) : (
            <span className="info-value">{totalValueSold}</span>
          )}
          <span className="info-title">Valor total vendido</span>
        </S.BoxInfoWrapper>
      </S.SummaryBox>
      <S.SummaryBox>
        <S.BoxInfoWrapper>
          {loadingSalesSummary && hasReservationModule === true ? (
            <S.Skeleton active />
          ) : (
            <span className="info-value">{averageTicket}</span>
          )}
          <span className="info-title">Ticket médio</span>
        </S.BoxInfoWrapper>
      </S.SummaryBox>
    </S.ChartsSection>
  );
};

const mockedData = [
  { id: 'experience', label: 'Experiência', value: 142, color: '#FFB946' },
  { id: 'schedule', label: 'Reserva paga', value: 83, color: '#FF6384' },
  { id: 'noshow', label: 'No-Show', value: 154, color: '#36A2EB' },
];

const pieChartDescriptionData = {
  experience: {
    title: 'Experiência',
    color: '#FFB946',
  },
  schedule: {
    title: 'Reserva paga',
    color: '#FF6384',
  },
  noshow: {
    title: 'No-Show',
    color: '#36A2EB',
  },
};

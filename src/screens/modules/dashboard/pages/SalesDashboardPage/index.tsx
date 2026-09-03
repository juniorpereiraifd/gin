import { useParams } from 'react-router-dom';
import { Divider } from 'antd';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { FilterSection } from './FilterSection';
import { SummatyChartsSection } from './SummaryChartsSection';
import { SalesReportTable } from './SalesReportTable';
import { ModuleInactiveAlert } from '../../components/Alert/ModuleInactiveAlert';
import * as S from './styles';
import { AccountingReportTable } from './AccountingReportTable';
import { Tabs } from 'src/stories/display/Tabs';

export const SalesDashboardPage = () => {
  const { unitId } = useParams<'dashboard.sales'>();
  const {
    unity: { unitModules },
  } = useSelector((state: RootType) => state);
  const hasReservationModule = unitModules.reservation === true;

  return (
    <PageContainer>
      <PageTitle>Relatórios de vendas</PageTitle>
      <S.Overlay>
        <S.ReportData blurred={hasReservationModule === false}>
          <S.InfoContent>
            <FilterSection unitId={unitId} hasReservationModule={hasReservationModule} />
            <SummatyChartsSection hasReservationModule={hasReservationModule} />
            <Divider />
            <Tabs
              defaultActiveKey="general"
              destroyInactiveTabPane
              items={[
                {
                  key: 'sales',
                  label: 'Vendas',
                  children: <SalesReportTable hasReservationModule={hasReservationModule} />,
                },
                {
                  key: 'accounting',
                  label: 'Contabilidade',
                  children: <AccountingReportTable />,
                },
              ]}
              className="[&_.ant-tabs-nav]:mb-8 overflow-hidden"
            />
          </S.InfoContent>
        </S.ReportData>
        {hasReservationModule === false && (
          <ModuleInactiveAlert
            title="Módulo de Reserva bloqueado"
            description="Acompanhe detalhadamente o desempenho das vendas das experiências
              do seu restaurante e tenha todas as vantagens que o nosso Módulo
              de Reservas pode oferecer ao seu negócio."
          />
        )}
      </S.Overlay>
    </PageContainer>
  );
};

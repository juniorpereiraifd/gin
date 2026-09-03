import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { RootType } from 'src/store/modules/rootReducer';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Tabs, TabsProps } from 'src/stories/display/Tabs';
import { NpsTabReport } from './NpsTabReport';
import { AnswersTabReport } from './AnswersTabReport';
import { ModuleInactiveAlert } from '../../components/Alert/ModuleInactiveAlert';

export const NpsDashboardPage: FunctionComponent = () => {
  const { unitId } = useParams<'dashboard.nps'>();
  const {
    unity: { unitModules },
  } = useSelector((state: RootType) => state);
  const hasNpsModule = unitModules.nps === true;

  const items: TabsProps['items'] = [
    {
      label: 'NPS',
      key: 'nps',
      children: <NpsTabReport unitId={unitId} hasNpsModule={hasNpsModule} />,
    },
    {
      label: 'Respostas',
      key: 'answers',
      children: <AnswersTabReport unitId={unitId} />,
    },
  ];

  return (
    <PageContainer>
      <PageTitle>Relatório de avaliações</PageTitle>
      {hasNpsModule === false ? (
        <div className="w-full h-full relative">
          <div
            data-blurred={hasNpsModule === false}
            className="w-full h-full data-[blurred=true]:relative data-[blurred=true]:blur-sm data-[blurred=true]:translate-z-[1px] data-[blurred=true]:pointer-events-[none]"
          >
            <Tabs defaultActiveKey="nps" items={items} className="overflow-hidden" />
          </div>
          {hasNpsModule === false && (
            <ModuleInactiveAlert
              title="Módulo de Avaliações bloqueado"
              description="Analise profundamente a experiência dos seus clientes.
            Acompanhe a nota geral, respostas recebidas, notas por pergunta e as opiniões dos clientes.
            Transforme esses insights em ações que impulsionam a satisfação e a fidelização do público."
            />
          )}
        </div>
      ) : (
        <Tabs defaultActiveKey="nps" items={items} className="overflow-hidden" />
      )}
    </PageContainer>
  );
};

export const parseDate = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD');
};

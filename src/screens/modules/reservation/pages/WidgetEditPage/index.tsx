import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import { PageContainer } from 'src/components/PageContainer';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Tabs } from 'src/stories/display/Tabs';
import { IntegrationSection } from './IntegrationSection';
import { SharingSection } from './SharingSection';
import { PersonalizationSection } from './PersonalizationSection';

export const WidgetEditPage = () => {
  const { widgetId } = useParams<'reservation.widgetEdit'>();
  const dispatch = useDispatch();
  const {
    widget: { selectedWidget, loadingSelectedWidget },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (widgetId) {
      dispatch(WidgetCreators.getWidgetRequest({ id: widgetId }));
    }
  }, [widgetId]);

  return (
    <PageContainer sideColumn>
      {loadingSelectedWidget ? (
        <Skeleton.Button active className="!w-64 !h-11" />
      ) : (
        <PageTitle>{selectedWidget?.name || 'Editar widget de reserva'}</PageTitle>
      )}
      <Tabs
        className="row-start-2 col-start-1"
        defaultActiveKey="SHARING"
        items={[
          {
            key: 'SHARING',
            label: 'Compartilhamento',
            disabled: loadingSelectedWidget,
            children: <SharingSection selectedWidget={selectedWidget} />,
          },
          {
            key: 'PERSONALIZATION',
            label: 'Personalização',
            disabled: loadingSelectedWidget,
            children: <PersonalizationSection selectedWidget={selectedWidget} />,
          },
          {
            key: 'INTEGRATION',
            label: 'Integrações',
            disabled: loadingSelectedWidget,
            children: <IntegrationSection selectedWidget={selectedWidget} />,
          },
        ]}
      />
    </PageContainer>
  );
};

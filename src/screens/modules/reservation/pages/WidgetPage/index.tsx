import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Link2, Plus, Unlink2 } from 'lucide-react';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { WidgetProps } from 'src/store/modules/widget/reducer';
import { Button } from 'src/stories/general/Button';
import { CreateWidgetDrawer } from './CreateWidgetDrawer';
import { LinkWidgetModal } from './LinkWidgetModal';
import { MenuBadge } from './MenuBadge';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Table } from 'src/stories/display/Table';
import { UnlinkWidgetModal } from './UnlinkWidgetModal';
import { PageContainer } from 'src/components/PageContainer';

export const WidgetPage = () => {
  const { unitId } = useParams<'reservation.widgets'>();
  const dispatch = useDispatch();
  const [isUnlinkWidgetModalOpen, setIsUnlinkWidgetModalOpen] = useState(false);
  const [widgetToUnlink, setWidgetToUnlink] = useState<WidgetProps | null>(null);
  const [isLinkWidgetModalOpen, setIsLinkWidgetModalOpen] = useState(false);
  const {
    auth: { user },
    widget: { data, pagination, loading },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    dispatch(
      WidgetCreators.getWidgetsRequest({
        page: 1,
        unity: unitId,
      })
    );
  }, [dispatch, unitId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = (page: number) => {
    if (pagination?.is_last_page) {
      return;
    }

    dispatch(
      WidgetCreators.getWidgetsRequest({
        page: page,
        unity: unitId,
      })
    );
  };

  const handleUnlinkWidget = (widget: WidgetProps) => {
    dispatch(
      WidgetCreators.unlinkWidgetRequest({
        widget: widget.id,
        unity: unitId,
      })
    );
  };

  return (
    <PageContainer sideColumn>
      <PageTitle>Widget de Reserva</PageTitle>
      <Table<WidgetProps>
        bordered
        className="shadow-sm row-start-2 col-start-1"
        dataSource={data}
        loading={loading}
        title={() => (
          <div className="w-full flex items-center justify-end gap-3">
            <Button variant="outlined" icon={<Link2 size={20} />} onClick={() => setIsLinkWidgetModalOpen(true)}>
              Vincular a um widget
            </Button>
            <Button
              variant="outlined"
              icon={<Plus size={20} />}
              onClick={() =>
                dispatch(
                  WidgetCreators.setCreateDrawerOpen({
                    open: true,
                  })
                )
              }
            >
              Criar novo widget
            </Button>
          </div>
        )}
        actions={{
          isVisible: (item) => item.default === false,
          custom: [
            {
              key: 'unlink',
              content: (
                <div className="flex items-center gap-2">
                  <Unlink2 size={14} />
                  <span>Desvincular</span>
                </div>
              ),
              onClick: (item: WidgetProps) => {
                setWidgetToUnlink(item);
                setIsUnlinkWidgetModalOpen(true);
              },
            },
          ],
          delete: {
            onClick: (item: WidgetProps) => {
              dispatch(WidgetCreators.deleteWidgetRequest(item.id));
            },
            isVisible: () => user?.master === true,
          },
        }}
        pagination={{
          pageSize: pagination?.per_page,
          total: pagination?.total,
          current: pagination?.current_page,
          showTotal: (total) => `Total de ${total} widget${total !== 1 ? 's' : ''}`,
          onChange: handleLoadMore,
        }}
        columns={[
          {
            title: 'Nome',
            dataIndex: 'name',
            key: 'name',
            render: (name: string, data: WidgetProps) => (
              <Link to={`/units/${unitId}/reservation/widgets/${data.id}/edit`} className="text-blue-900">
                {name}
              </Link>
            ),
          },
        ]}
      />
      <UnlinkWidgetModal
        open={isUnlinkWidgetModalOpen}
        setOpen={setIsUnlinkWidgetModalOpen}
        onClose={() => {
          setWidgetToUnlink(null);
          setIsUnlinkWidgetModalOpen(false);
        }}
        widget={widgetToUnlink}
        onUnlink={handleUnlinkWidget}
      />
      <LinkWidgetModal open={isLinkWidgetModalOpen} setOpen={setIsLinkWidgetModalOpen} unitId={unitId} />
      <CreateWidgetDrawer unitId={unitId} />
      <MenuBadge />
    </PageContainer>
  );
};

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Creators as BookingExperiencesCreators } from 'src/store/modules/bookingExperiences/actions';
import { BookingExperienceProps } from 'src/store/modules/bookingExperiences/reducer';
import { Creators as ReservationCreators } from 'src/store/modules/reservation/actions';
import { ExperienceMutationDrawer } from './ExperienceMutationDrawer';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { ChangeStatusProps } from './utils';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { PageContainer } from 'src/components/PageContainer';
import { ExternalLink, Plus, TriangleAlert } from 'lucide-react';
import { Button } from 'src/stories/general/Button';
import { Table } from 'src/stories/display/Table';
import { Switch } from 'src/stories/entry/Switch';
import { Popover, Select, Tag } from 'antd';
import { useMedia } from 'src/hooks/useMedia';
import { GETIN_WHATSAPP_CONTACT } from 'src/utils/constants';

export const ExperiencesPage = () => {
  const { unitId } = useParams<'reservation.experiences'>();
  const dispatch = useDispatch();
  const isMediumOrGreater = useMedia('MD');

  const {
    hall: { unity: unitHall },
    bookingExperiences: { data, loading, pagination, experiencesListFilters },
    reservation: { settings, loadingSettings },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (unitHall && unitId) {
      dispatch(ReservationCreators.getReservationSettingsRequest());

      dispatch(
        HallCreators.getHallsRequest({
          page: 1,
          perPage: 20,
          reset: true,
          active: false,
        }),
      );
    }

    dispatch(
      BookingExperiencesCreators.getExperiencesRequest({
        unit_id: unitId,
        page: 1,
      }),
    );
  }, [dispatch, unitHall, unitId]);

  const handleAddNewExperience = () => {
    dispatch(BookingExperiencesCreators.setMutationDrawerOpen({ open: true }));
  };

  const handleLoadMore = (props: { page: number; perPage: number }) => {
    dispatch(
      BookingExperiencesCreators.getExperiencesRequest({
        unit_id: unitId,
        page: props.page,
      }),
    );
  };

  const handleEditItem = (item: BookingExperienceProps) => {
    dispatch(BookingExperiencesCreators.getExperienceRequest({ experienceId: item.id }));
    dispatch(BookingExperiencesCreators.setMutationDrawerOpen({ open: true }));
  };

  const handleDeleteItem = (item: BookingExperienceProps) => {
    dispatch(BookingExperiencesCreators.deleteExperienceRequest(item.id));
  };

  const handleStatusExperience = ({ id, active }: ChangeStatusProps) => {
    dispatch(
      BookingExperiencesCreators.changeStatusExperienceRequest({
        id,
        active,
      }),
    );
  };

  const handleFilterExperiencesByStatus = (value: Array<'active' | 'inactive'>) => {
    if (value.length === 0) {
      return;
    }

    dispatch(
      BookingExperiencesCreators.setExperiencesListFilter({
        status: value,
      }),
    );

    dispatch(
      BookingExperiencesCreators.getExperiencesRequest({
        unit_id: unitId,
        page: 1,
      }),
    );
  };

  return (
    <PageContainer>
      <div className="flex items-center gap-3">
        <PageTitle>Experiências</PageTitle>
        {settings !== null && settings.billing_enabled === false && (
          <Popover
            title={<span className="text-slate-700">Suas cobranças estão inativas</span>}
            content={
              <p className="text-slate-600">
                Atenção! Para disponibilizar suas experiências aos clientes, <br />é necessário ativar a funcionalidade
                de cobrança. <br />
                <span className="inline-flex items-center gap-1">
                  <a href={GETIN_WHATSAPP_CONTACT} target="_blank" rel="noreferrer" className="text-blue-600">
                    Entre em contato
                  </a>
                  <ExternalLink size={14} />
                </span>{' '}
                conosco para habilitá-la e ofereça <br />
                momentos memoráveis em seu restaurante.
              </p>
            }
            trigger={!isMediumOrGreater ? ['hover', 'click'] : ['hover', 'focus']}
            placement="bottomLeft"
          >
            <Button
              className="!w-fit !h-fit !p-1"
              variant="text"
              icon={<TriangleAlert size={20} className="text-amber-500" />}
            />
          </Popover>
        )}
      </div>
      <Table
        className="shadow-sm"
        bordered
        title={() => (
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <Select
                value={experiencesListFilters?.status}
                onChange={handleFilterExperiencesByStatus}
                mode="multiple"
                tagRender={({ label, value }) => (
                  <Tag color={filterTag[value as string]} style={{ marginInlineEnd: 4 }}>
                    {label}
                  </Tag>
                )}
                defaultValue={['active']}
                prefix={
                  <div className="mr-2">
                    <span className="text-slate-700">Status</span>
                  </div>
                }
                options={[
                  { value: 'active', label: 'Ativas' },
                  { value: 'inactive', label: 'Inativas' },
                ]}
              />
            </div>
            <Button icon={<Plus size={14} />} onClick={handleAddNewExperience}>
              Nova experiência
            </Button>
          </div>
        )}
        columns={[
          {
            title: 'Experiência ativa',
            dataIndex: 'active',
            key: 'active',
            align: 'center',
            render: (_: unknown, item) => (
              <div className="w-full flex items-center justify-center">
                <Switch
                  checked={item.active}
                  onChange={(checked) =>
                    handleStatusExperience({
                      id: item.id,
                      active: checked,
                    })
                  }
                />
              </div>
            ),
          },
          { title: 'Título', dataIndex: 'title', key: 'title' },
          {
            title: 'Data de início',
            dataIndex: 'starting_at',
            key: 'starting_at_date',
            render: (value: string | Date) => dayjs(value).format('DD/MM/YYYY'),
          },
          {
            title: 'Data de término',
            dataIndex: 'ending_at',
            key: 'ending_at_date',
            render: (value: string | Date) => dayjs(value).format('DD/MM/YYYY'),
          },
          {
            title: 'Horário de início',
            dataIndex: 'starting_at',
            key: 'starting_at_time',
            render: (value: string | Date) => dayjs(value).format('HH:mm'),
          },
          {
            title: 'Horário de término',
            dataIndex: 'ending_at',
            key: 'ending_at_time',
            render: (value: string | Date) => dayjs(value).format('HH:mm'),
          },
          { title: 'Vendas', dataIndex: 'sales_count', key: 'sales_count' },
        ]}
        dataSource={data}
        loading={loading || loadingSettings}
        onChange={(pagination) =>
          handleLoadMore({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
        actions={{
          edit: {
            onClick: handleEditItem,
          },
          delete: {
            onClick: handleDeleteItem,
          },
        }}
        pagination={{
          current: pagination?.current_page,
          pageSize: pagination?.per_page,
          total: pagination?.total,
          showSizeChanger: false,
          showTotal: (total) => `Total de ${total} experiências`,
        }}
      />
      <ExperienceMutationDrawer unitId={unitId} />
    </PageContainer>
  );
};

const filterTag: Record<string, string> = {
  active: 'geekblue',
  inactive: 'default',
};

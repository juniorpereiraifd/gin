import { Fragment, FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Ellipsis, Pencil, Plus, Trash } from 'lucide-react';
import debounce from 'lodash/debounce';
import { RootType } from 'src/store/modules/rootReducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { CampaignList } from '../CampaignList';
import { Button } from 'src/ui/Button';
import { SMSCampaignData } from 'src/store/modules/marketing/reducer';
import { Event, getDeviceType, notification } from 'src/utils/helpers';
import { MARKETING_CAMPAIGN_STATUSES, MINUTES_TO_INVALIDATE_CAMPAIGN } from 'src/utils/constants';
import { Input } from 'src/ui/Input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'src/ui/DropdownMenu';
import { Modal } from 'src/stories/feedback/Modal';

type SmsCampaignsProps = {
  unitId: string;
};

export const SmsCampaigns: FunctionComponent<SmsCampaignsProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    marketing: { isLoading, smsCampaigns },
  } = useSelector((state: RootType) => state);
  const [campaignNameSearched, setCampaignNameSearched] = useState<string | null>(null);
  const [campaignToDelete, setCampaignToDelete] = useState<SMSCampaignData | null>(null);

  useEffect(() => {
    dispatch(MarketingCreators.resetSMSCampaigns());
  }, []);

  useEffect(() => {
    if (!unitId) {
      return;
    }

    dispatch(
      MarketingCreators.getSMSCampaignsRequest({
        page: 1,
      })
    );
  }, [unitId]);

  const searchCampaign = useMemo(
    () =>
      debounce((campaignName: string) => {
        setCampaignNameSearched(campaignName);

        Event.push('admin_crm_campaign_search_click', {
          unit_id: unitId,
          device_type: getDeviceType(),
          search_term: campaignName,
        });

        dispatch(MarketingCreators.resetSMSCampaigns());
        dispatch(
          MarketingCreators.getSMSCampaignsRequest({
            campaignName: campaignName,
            page: 1,
          })
        );
      }, 500),
    [dispatch]
  );

  const handleCreateCampaign = () => {
    navigate(`/units/${unitId}/marketing/campaigns/sms/create`);
  };

  const handleViewCampaignDetails = (campaign: SMSCampaignData) => {
    dispatch(MarketingCreators.resetSMSCampaignSelect());
    dispatch(
      MarketingCreators.getSMSCampaignRequest({
        campaignId: campaign.id,
      })
    );

    navigate(`/units/${unitId}/marketing/campaigns/sms/${campaign.id}/view`);
  };

  const handleEditCampaign = (campaign: SMSCampaignData) => {
    if (
      dayjs(`${campaign.shipping_at_date} ${campaign.shipping_at_time}`).diff(Date.now(), 'minutes') <
      MINUTES_TO_INVALIDATE_CAMPAIGN
    ) {
      notification.warning(
        'Não é possível realizar alterações',
        'A campanha selecionada está muito perto de ser disparada, portanto, nenhuma alteração é permitida.'
      );
    } else if (campaign.status === 'done') {
      notification.warning(
        'Não é possível realizar alterações',
        'A campanha selecionada já foi disparada, portanto, nenhuma alteração é permitida.'
      );
    } else {
      navigate(`/units/${unitId}/marketing/campaigns/sms/${campaign.id}/edit`);
    }
  };

  const handleDeleteCampaign = (campaign: SMSCampaignData) => {
    if (campaign.status === 'done') {
      notification.warning('Não é possível remover a campanha.', 'A campanha selecionada já foi disparada');
    } else {
      setCampaignToDelete(campaign);
    }
  };

  const handleLoadMore = ({ page, perPage }: { page: number; perPage: number }) => {
    if (!unitId) {
      return;
    }

    dispatch(
      MarketingCreators.getSMSCampaignsRequest({
        campaignName: campaignNameSearched || '',
        page: page,
        per_page: perPage,
      })
    );
  };

  return (
    <Fragment>
      <CampaignList<SMSCampaignData>
        data={smsCampaigns.data}
        loading={isLoading}
        pagination={{
          current: smsCampaigns.pagination?.current_page,
          pageSize: smsCampaigns.pagination?.per_page,
          total: smsCampaigns.pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} campanhas`,
        }}
        title={
          <div className="w-full flex items-center justify-between">
            <div className="w-64">
              <Input placeholder="Buscar campanha" onChange={(event) => searchCampaign(event.target.value)} />
            </div>
            <Button onClick={handleCreateCampaign}>
              <Plus size={16} />
              Nova campanha
            </Button>
          </div>
        }
        onChange={(pagination) => {
          handleLoadMore({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          });
        }}
        columns={[
          {
            title: 'Nome da campanha',
            dataIndex: 'name',
            key: 'name',
            render: (text, campaign) => (
              <Button
                variant="link"
                className="text-blue-500"
                onClick={() => handleViewCampaignDetails(campaign as SMSCampaignData)}
              >
                {text}
              </Button>
            ),
          },
          {
            title: 'Data/Hora de envio',
            dataIndex: 'shipping_at_date',
            key: 'shipping_at_date',
            render: (value, campaign) => `${dayjs(value).format('DD/MM/YYYY')} ${campaign.shipping_at_time}`,
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (value) => MARKETING_CAMPAIGN_STATUSES[value],
          },
          {
            title: 'Consumidores elegíveis',
            dataIndex: 'customers_total',
            key: 'customers_total',
          },
          {
            title: 'Entregues',
            dataIndex: 'delivered_total',
            key: 'delivered_total',
          },
          {
            title: 'Não entregues',
            dataIndex: 'failed_total',
            key: 'failed_total',
          },
          {
            dataIndex: 'actions',
            key: 'actions',
            render: (_, campaign) => (
              <div className="w-full flex items-center justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Ellipsis size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="cursor-pointer flex item-center"
                      onClick={() => handleEditCampaign(campaign as SMSCampaignData)}
                    >
                      <Pencil />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer flex item-center"
                      onClick={() => handleDeleteCampaign(campaign as SMSCampaignData)}
                    >
                      <Trash />
                      Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          },
        ]}
      />
      <Modal
        open={campaignToDelete !== null}
        title="Deseja deletar esta campanha de sms?"
        okText="Excluir"
        onCancel={() => setCampaignToDelete(null)}
        onOk={() => {
          if (campaignToDelete) {
            dispatch(
              MarketingCreators.deleteSMSCampaignRequest({
                campaignId: campaignToDelete.id,
              })
            );
          }

          setCampaignToDelete(null);
        }}
      >
        Deseja deletar a campanha {`"${campaignToDelete?.name}"`}?
      </Modal>
    </Fragment>
  );
};

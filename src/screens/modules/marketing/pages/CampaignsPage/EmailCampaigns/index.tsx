import {
  Fragment,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Ellipsis, Pencil, Plus, Trash } from 'lucide-react';
import debounce from 'lodash/debounce';
import { RootType } from 'src/store/modules/rootReducer';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { CampaignList } from '../CampaignList';
import { Button } from 'src/ui/Button';
import { EmailCampaignData } from 'src/store/modules/marketing/reducer';
import { Event, getDeviceType, notification } from 'src/utils/helpers';
import { MINUTES_TO_INVALIDATE_CAMPAIGN } from 'src/utils/constants';
import { Input } from 'src/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'src/ui/DropdownMenu';
import { Modal } from 'src/stories/feedback/Modal';

type EmailCampaignsProps = {
  unitId: string;
};

export const EmailCampaigns: FunctionComponent<EmailCampaignsProps> = (
  props
) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    marketing: { isLoading, emailCampaigns },
  } = useSelector((state: RootType) => state);
  const [campaignNameSearched, setCampaignNameSearched] = useState<
    string | null
  >(null);
  const [campaignToDelete, setCampaignToDelete] =
    useState<EmailCampaignData | null>(null);

  useEffect(() => {
    dispatch(MarketingCreators.resetEmailCampaigns());
  }, []);

  useEffect(() => {
    if (!unitId) {
      return;
    }

    dispatch(
      MarketingCreators.getEmailCampaignsRequest({
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

        dispatch(MarketingCreators.resetEmailCampaigns());
        dispatch(
          MarketingCreators.getEmailCampaignsRequest({
            campaignName: campaignName,
            page: 1,
          })
        );
      }, 500),
    [dispatch]
  );

  const handleCreateCampaign = () => {
    Event.push('admin_crm_campaign_new_click', {
      unit_id: unitId,
      device_type: getDeviceType(),
    });

    navigate(`/units/${unitId}/marketing/campaigns/email/create`);
  };

  const handleViewCampaignDetails = (campaign: EmailCampaignData) => {
    dispatch(MarketingCreators.resetEmailCampaignSelect());
    dispatch(
      MarketingCreators.getEmailCampaignRequest({
        campaignId: campaign.id,
      })
    );

    navigate(`/units/${unitId}/marketing/campaigns/email/${campaign.id}/view`);
  };

  const handleEditCampaign = (campaign: EmailCampaignData) => {
    if (
      dayjs(`${campaign.shipping_at_date} ${campaign.shipping_at_time}`).diff(
        Date.now(),
        'minutes'
      ) < MINUTES_TO_INVALIDATE_CAMPAIGN
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
      navigate(
        `/units/${unitId}/marketing/campaigns/email/${campaign.id}/edit`
      );
    }
  };

  const handleDeleteCampaign = (campaign: EmailCampaignData) => {
    if (campaign.status === 'done') {
      notification.warning(
        'Não é possível remover a campanha.',
        'A campanha selecionada já foi disparada'
      );
    } else {
      setCampaignToDelete(campaign);
    }
  };

  const handleLoadMore = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    if (!unitId) {
      return;
    }

    dispatch(
      MarketingCreators.getEmailCampaignsRequest({
        campaignName: campaignNameSearched || '',
        page: page,
        per_page: perPage,
      })
    );
  };

  return (
    <Fragment>
      <CampaignList<EmailCampaignData>
        data={emailCampaigns.data}
        loading={isLoading}
        pagination={{
          current: emailCampaigns.pagination?.current_page,
          pageSize: emailCampaigns.pagination?.per_page,
          total: emailCampaigns.pagination?.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} campanhas`,
        }}
        title={
          <div className="w-full flex items-center justify-between">
            <div className="w-64">
              <Input
                placeholder="Buscar campanha"
                onChange={(event) => searchCampaign(event.target.value)}
              />
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
                onClick={() =>
                  handleViewCampaignDetails(campaign as EmailCampaignData)
                }
              >
                {text}
              </Button>
            ),
          },
          {
            title: 'Data de envio',
            dataIndex: 'shipping_at_date',
            key: 'shipping_at_date',
            render: (value) => dayjs(value).format('DD/MM/YYYY'),
          },
          { title: 'Enviados', dataIndex: ['views', 'sent'], key: 'sent' },
          { title: 'Abertura', dataIndex: ['views', 'open'], key: 'open' },
          {
            title: 'Cliques',
            dataIndex: ['views', 'single_clicks'],
            key: 'single_clicks',
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
                      onClick={() =>
                        handleEditCampaign(campaign as EmailCampaignData)
                      }
                    >
                      <Pencil />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer flex item-center"
                      onClick={() =>
                        handleDeleteCampaign(campaign as EmailCampaignData)
                      }
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
        title="Deseja deletar esta campanha de e-mail?"
        okText="Excluir"
        onCancel={() => setCampaignToDelete(null)}
        onOk={() => {
          if (campaignToDelete) {
            dispatch(
              MarketingCreators.deleteEmailCampaignRequest({
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

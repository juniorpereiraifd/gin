import { FunctionComponent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Ban, CalendarX2, ChevronRight, PartyPopper, RefreshCwOff, Users } from 'lucide-react';
import { MarketingCreators } from 'src/store/modules/marketing/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { getCurrentMonth } from 'src/utils/helpers';
import { BigNumberCard } from 'src/screens/modules/marketing/components/BigNumberCard';
import { Button } from 'src/ui/Button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from 'src/ui/Select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from 'src/ui/Tooltip';

type CustomerSegmentationProps = {
  unitId: string;
};

export const CustomerSegmentation: FunctionComponent<CustomerSegmentationProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { textMonth } = getCurrentMonth();
  const [visualization, setVisualization] = useState<'pattern' | 'imported'>('pattern');
  const {
    hall: { unity },
    marketing: { customers, lists },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (!unity?.id) return;
    dispatch(MarketingCreators.getCustomersRequest());
    dispatch(MarketingCreators.getListsRequest());
  }, [unity?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6">
      <Select defaultValue="pattern" onValueChange={(value) => setVisualization(value as 'pattern' | 'imported')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Visualizar por" />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          <SelectGroup>
            <SelectLabel>Visualizar por</SelectLabel>
            <SelectItem value="pattern">Listas padrão</SelectItem>
            <SelectItem value="imported">Listas importadas</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {visualization === 'pattern' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <BigNumberCard
            title="Clientes cadastrados"
            value={customers?.all?.pagination?.total || 0}
            icon={<Users size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/all`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title={`Aniversariantes de ${textMonth}`}
            value={customers?.birthdays?.pagination?.total || 0}
            icon={<PartyPopper size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/birthdays`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title="Reservas com no-show"
            value={customers?.reservation_noshow?.pagination?.total || 0}
            icon={<CalendarX2 size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/reservation_noshow`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title="Cancelados"
            value={customers?.canceled?.pagination?.total || 0}
            icon={<Ban size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/canceled`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title="Não voltaram dentro de 30 dias"
            value={customers?.dont_come_back_thirty?.pagination?.total || 0}
            icon={<RefreshCwOff size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/dont_come_back_thirty`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title="Não voltaram dentro de 60 dias"
            value={customers?.dont_come_back_sixty?.pagination?.total || 0}
            icon={<RefreshCwOff size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/dont_come_back_sixty`)}
              >
                Ver detalhes
              </Button>
            }
          />
          <BigNumberCard
            title="Não voltaram dentro de 90 dias"
            value={customers?.dont_come_back_ninety?.pagination?.total || 0}
            icon={<RefreshCwOff size={16} />}
            footer={
              <Button
                className="text-xs text-brand-600 p-0 h-fit"
                variant="link"
                onClick={() => navigate(`/units/${unitId}/marketing/customers/segmentation/dont_come_back_ninety`)}
              >
                Ver detalhes
              </Button>
            }
          />
        </div>
      )}
      {visualization === 'imported' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {lists
            .filter((seg) => seg.id !== '')
            .map((list) => (
              <BigNumberCard
                key={list.id}
                title={list.name}
                icon={<></>}
                value={null}
                orientation="horizontal"
                footer={
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="text-xs text-brand-600"
                          variant="outline"
                          size="icon"
                          onClick={() => navigate(`/units/${unity?.id}/marketing/customers/list/${list.id}`)}
                        >
                          <ChevronRight size={18} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Ver detalhes</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                }
              />
            ))}
        </div>
      )}
    </div>
  );
};

import { useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Tooltip } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import Delete from 'src/components/Delete';
import { Button } from 'src/stories/general/Button';
import { EditHallModal } from './EditHallModal';
import { Switch } from 'src/stories/entry/Switch';

type ActionsHallBoxProps = {
  hallId: string;
};

export const ActionsHallBox: FunctionComponent<ActionsHallBoxProps> = (props) => {
  const { hallId } = props;
  const dispatch = useDispatch();
  const {
    hall: { hall },
  } = useSelector((state: RootType) => state);
  const [hallStateActive, setHallStateActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (hall) {
      setHallStateActive(hall.active);
    }
  }, [hall]);

  const handleSwitchActiveHall = (checked: boolean) => {
    setHallStateActive(checked);
    dispatch(
      HallCreators.changeStatusHallRequest({
        hall_id: hallId,
        active: checked,
      })
    );
  };

  const handleDeleteHall = () => dispatch(HallCreators.deleteHallRequest(hall!));

  return hall === null ? null : (
    <BoxContrasted className="flex flex-col gap-4">
      <span className="text-base font-medium text-slate-800">{hall.name}</span>
      <Divider className="!my-0" />
      <div className="flex items-center justify-between">
        <span className="text-slate-600 font-medium">Salão ativo?</span>
        <Switch defaultChecked={hall.active} checked={hallStateActive} onChange={handleSwitchActiveHall} />
      </div>
      <div className="w-full flex flex-col items-center justify-between gap-2">
        <Button
          icon={<Pencil size={14} />}
          className="w-full"
          variant="outlined"
          onClick={() => setIsModalVisible(true)}
        >
          Editar salão
        </Button>
        <Tooltip
          title={
            hall?.allow_delete === false ? (
              <div className="flex flex-col gap-2">
                <span className="font-semibold">Não é possível deletar este salão</span>
                <p className="text-sm">
                  A exclusão deste salão está desabilitada, pois, o mesmo já possui reservas cadastradas e/ou datas
                  especiais.
                </p>
              </div>
            ) : null
          }
        >
          {hall?.allow_delete === false ? (
            <Button disabled icon={<Trash2 size={14} />} className="w-full" variant="outlined">
              Excluir salão
            </Button>
          ) : (
            <Delete className="w-full" onDelete={handleDeleteHall}>
              <Button icon={<Trash2 size={14} />} className="w-full" variant="outlined">
                Excluir salão
              </Button>
            </Delete>
          )}
        </Tooltip>
      </div>
      <EditHallModal open={isModalVisible} setOpen={setIsModalVisible} hallId={hallId} />
    </BoxContrasted>
  );
};

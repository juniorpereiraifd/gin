import { useEffect, useState, type FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Switch } from 'src/stories/entry/Switch';
import { Button } from 'src/stories/general/Button';
import { EmptyChairModal } from './EmptyChairModal';
import { HALLS_TYPE } from 'src/utils/constants';

type EmptyChairBoxProps = {
  hallId: string;
};

export const EmptyChairBox: FunctionComponent<EmptyChairBoxProps> = (props) => {
  const { hallId } = props;
  const dispatch = useDispatch();
  const {
    hall: { hall },
  } = useSelector((state: RootType) => state);
  const [hallFlexibleActive, setHallFlexibleActive] = useState(false);
  const [isEmptyChairVisible, setIsEmptyChairVisible] = useState(false);

  useEffect(() => {
    if (hall) {
      setHallFlexibleActive(hall.flexible);
    }
  }, [hall]);

  const handleSwitchFlexibleHall = (checked: boolean) => {
    setHallFlexibleActive(checked);
    dispatch(
      HallCreators.changeFlexibleHallRequest({
        hall_id: hallId,
        flexible: checked,
      })
    );
  };

  return hall === null || hall.type === HALLS_TYPE.TOTAL_SEATS ? null : (
    <BoxContrasted className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="font-medium">Cadeira vazia</span>
        <Switch defaultChecked={hall.flexible} checked={hallFlexibleActive} onChange={handleSwitchFlexibleHall} />
      </div>
      <p className="text-xs text-slate-600">
        Com esta opção ativa este salão oferece reservas mesmo se uma cadeira ficar vazia.
      </p>
      <Button variant="outlined" onClick={() => setIsEmptyChairVisible(true)}>
        Saiba Mais
      </Button>
      <EmptyChairModal open={isEmptyChairVisible} setOpen={setIsEmptyChairVisible} />
    </BoxContrasted>
  );
};

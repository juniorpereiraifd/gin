import { Fragment, useState } from 'react';
import { Map } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { Button } from 'src/stories/general/Button';
import { TableMapOptionsDropdown } from './TableMapOptionsDropdown';
import { TableMapDrawerMutation } from './TableMapDrawerMutation';

export const TableMapBox = () => {
  const dispatch = useDispatch();
  const {
    hall: { hall },
  } = useSelector((state: RootType) => state);
  const [isTableMapDrawerOpen, setIsTableMapDrawerOpen] = useState(false);

  const handleOpenTableMapDrawerMutation = () => {
    if (hall !== null) {
      dispatch(
        HallCreators.setTableMap(hall.map.length > 0 ? hall.map.map((item) => ({ ...item, draft: false })) : null)
      );
    }

    setIsTableMapDrawerOpen(true);
  };

  const handleDeleteTableMap = () => {
    dispatch(HallCreators.deleteTableMapRequest());
  };

  return !hall ? null : (
    <Fragment>
      <BoxContrasted>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Map size={16} />
              <span className="font-medium">Mapa de mesas</span>
            </div>
            {hall.map.length > 0 && <TableMapOptionsDropdown onDeleteMap={handleDeleteTableMap} />}
          </div>
          <Button variant="outlined" onClick={handleOpenTableMapDrawerMutation}>
            {hall.map.length > 0 ? 'Visualizar' : 'Criar'} mapa
          </Button>
        </div>
      </BoxContrasted>
      <TableMapDrawerMutation open={isTableMapDrawerOpen} setOpen={setIsTableMapDrawerOpen} />
    </Fragment>
  );
};

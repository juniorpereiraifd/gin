import { useDispatch, useSelector } from 'react-redux';
import { List } from 'antd';
import { Pencil, Trash } from 'lucide-react';
import { Creators as ShiftCreators } from 'src/store/modules/shift/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { RootType } from 'src/store/modules/rootReducer';
import Loading from 'src/stories/feedback/Loading';
import { Button } from 'src/stories/general/Button';
import { ShiftMutationModal } from './ShiftMutationModal';
import Delete from 'src/components/Delete';

export const ShiftSection = () => {
  const dispatch = useDispatch();
  const {
    shift: { loading: loadingShifts, data: shifts },
  } = useSelector((state: RootType) => state);

  return (
    <div className="col-start-2 row-start-2">
      <BoxContrasted className="flex flex-col max-h-[34rem] py-6 px-4">
        <div className="flex flex-col gap-2 mb-4">
          <span className="text-base font-medium text-slate-800">Turnos da Reserva</span>
          <p className="text-sm text-slate-600">
            Quando esta opção está ativada, as reservas são organizadas por turno no painel de reservas (manager).
          </p>
        </div>
        <div className="flex-1 h-full flex flex-col min-h-0">
          {loadingShifts ? (
            <div className="h-full flex items-center justify-center">
              <Loading /> Carregando
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-transparent">
              <List
                itemLayout="vertical"
                split={false}
                dataSource={shifts}
                locale={{
                  emptyText: 'Nenhum turno encontrado',
                }}
                key={'list'}
                renderItem={(shift) => (
                  <List.Item key={shift.id}>
                    <div className="w-full flex flex-col gap-3 border border-slate-200 rounded-md py-3 px-4 shadow-sm">
                      <span className="text-sm font-medium">{shift.name}</span>
                      <div className="w-full flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-600">Horário</span>
                          <span>
                            {shift.starts_at} - {shift.ends_at}
                          </span>
                        </div>
                        <div className="flex item-center gap-2">
                          <Button
                            className="p-0"
                            variant="filled"
                            icon={<Pencil className="text-slate-600" size={16} />}
                            onClick={() => dispatch(ShiftCreators.setEditableItem(shift))}
                          />
                          <Delete onDelete={() => dispatch(ShiftCreators.deleteShiftRequest(shift))}>
                            <Button
                              className="p-0"
                              variant="filled"
                              icon={<Trash className="text-slate-600" size={16} />}
                            />
                          </Delete>
                        </div>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          )}
          <Button
            className="mt-6"
            onClick={() => {
              dispatch(ShiftCreators.openModal());
            }}
          >
            Criar turno
          </Button>
        </div>
      </BoxContrasted>
      <ShiftMutationModal />
    </div>
  );
};

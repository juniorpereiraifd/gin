import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'antd';
import { TriangleAlert } from 'lucide-react';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as SettingCreators } from 'src/store/modules/setting/actions';
import { BoxContrasted } from 'src/components/BoxContrasted';

export const MenuBadge = () => {
  const dispatch = useDispatch();
  const {
    setting: { menu, show_in_reservation, loading },
  } = useSelector((state: RootType) => state);
  const [menuChecked, setMenuChecked] = useState(false);

  useEffect(() => {
    dispatch(SettingCreators.getMenuSettingRequest());
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setMenuChecked(menu?.show_in_reservation as boolean);
  }, [menu]);

  useEffect(() => {
    if (!show_in_reservation) setMenuChecked(false);
  }, [show_in_reservation]);

  const handleChange = (value: boolean) => {
    setMenuChecked(value);
    dispatch(
      SettingCreators.showInReservationRequest({
        show_in_reservation: value,
      })
    );
  };

  return (
    <BoxContrasted className="col-start-2 row-start-2 h-fit">
      <div className="w-full flex items-start justify-between mb-4">
        <span className="text-base text-gray-700 font-semibold">Exibir banner de cardápio</span>
        <Switch checked={menuChecked} onChange={handleChange} loading={loading} />
      </div>
      <p className="text-xs text-gray-500">
        Quando esta opção está ativada, exibimos um banner com o seu cardápio na tela de sucesso do widget.{' '}
      </p>
      <div className="flex gap-2 bg-gray-50 p-2 rounded-md border border-gray-200 mt-4">
        <TriangleAlert size={14} className="text-amber-600 flex-shrink-0" />
        <p className="text-gray-600 text-xs">Você precisa ter um cardápio ativo para ativar essa função.</p>
      </div>
    </BoxContrasted>
  );
};

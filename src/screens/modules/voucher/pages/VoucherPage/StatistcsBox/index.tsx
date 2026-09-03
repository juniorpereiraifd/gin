import { Loader2 } from 'lucide-react';
import { Fragment, FunctionComponent } from 'react';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { VoucherStatisticsProps } from 'src/store/modules/voucher/reducer';

type StatistcsBoxProps = {
  statistics: VoucherStatisticsProps | undefined;
  loading: boolean;
};

export const StatistcsBox: FunctionComponent<StatistcsBoxProps> = (props) => {
  const { statistics, loading } = props;

  return (
    <BoxContrasted>
      <span className="text-base text-gray-700 font-semibold">Consumo de giftbacks</span>
      <div className="flex flex-col mt-4 gap-4">
        {loading === true ? (
          <div className="flex items-center gap-2">
            <Loader2 className="text-gray-500 animate-spin" size={14} />
            <span className="text-xs text-gray-500">Buscando dados de consumo</span>
          </div>
        ) : (
          <Fragment>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-700 font-semibold">{statistics?.count}</span>
              <span className="text-gray-700">Enviados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-700 font-semibold">{statistics?.count_validated}</span>
              <span className="text-gray-700">Validados</span>
            </div>
          </Fragment>
        )}
      </div>
    </BoxContrasted>
  );
};

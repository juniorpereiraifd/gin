import { Fragment, type FunctionComponent } from 'react';
import { Alert } from '..';
import { Hammer } from 'lucide-react';

export const MaintenanceAlert: FunctionComponent = () => {
  return (
    <Alert
      title="Estamos melhorando para você!"
      description={
        <Fragment>
          Os relatórios de dados do Get In estão passando por uma manutenção e, com isso, ficarão fora do ar até que
          todos seus dados sejam reprocessados.
          <br />
          Assim que possível liberamos novamente para que você possa ter acesso aos novos dados.
        </Fragment>
      }
      icon={
        <div className="w-10 h-10 relative p-[0.625rem] rounded-full bg-gradient-to-br from-slate-700 to-brand-700 mb-5">
          <Hammer size={20} className="absolute text-white" />
        </div>
      }
    />
  );
};

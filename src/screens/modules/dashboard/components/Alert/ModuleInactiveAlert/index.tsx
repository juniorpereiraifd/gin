import { FunctionComponent } from 'react';
import { Lock, LockOpen } from 'lucide-react';
import { GETIN_WHATSAPP_CONTACT } from 'src/utils/constants';
import { Button } from 'src/stories/general/Button';
import { Alert } from '..';

type ModuleInactiveAlertProps = {
  title: string;
  description: string;
};

export const ModuleInactiveAlert: FunctionComponent<ModuleInactiveAlertProps> = (props) => {
  return (
    <Alert
      title={props.title}
      description={props.description}
      icon={
        <div className="w-10 h-10 relative p-[0.625rem] rounded-full bg-gradient-to-br from-slate-700 to-brand-700 mb-5">
          <Lock size={20} className="absolute text-white" />
        </div>
      }
      action={
        <Button
          color="primary"
          icon={<LockOpen size={16} />}
          onClick={() => window.open(GETIN_WHATSAPP_CONTACT, '_blank')}
        >
          Desbloquear módulo
        </Button>
      }
    />
  );
};

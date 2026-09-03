import type { FunctionComponent, ReactNode } from 'react';

type AlertProps = {
  title: string;
  description: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
};

export const Alert: FunctionComponent<AlertProps> = (props) => {
  const { title, description, icon, action } = props;

  return (
    <div className="w-full h-full absolute top-0 left-0">
      <div className="flex justify-center sticky mt-[9.37rem] transform -translate-y-1/2 top-1/2">
        <div className="w-full max-w-[30rem] bg-white rounded-lg drop-shadow-md p-6 overflow-hidden">
          <div className="flex flex-col items-center relative before:content-[''] before:absolute before:top-[-50%] before:right-[-50%] before:w-full before:h-full before:bg-[radial-gradient(50%_50%_at_50%_50%,_#899FD030,_transparent)]">
            {icon}
            <span className="text-xl font-semibold text-slate-600 mb-3">{title}</span>
            <p className="text-slate-500 text-sm text-center mb-6">{description}</p>
            {action}
          </div>
        </div>
      </div>
    </div>
  );
};

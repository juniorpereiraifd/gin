import { FunctionComponent, PropsWithChildren } from 'react';
import { cn } from 'src/lib/utils';

type BoxContrastedProps = PropsWithChildren & {
  className?: string;
};

export const BoxContrasted: FunctionComponent<BoxContrastedProps> = (props) => {
  return (
    <div
      className={cn(
        'h-full bg-white rounded-md border border-solid border-slate-200 p-6 drop-shadow-sm',
        props.className
      )}
    >
      {props.children}
    </div>
  );
};

import { FunctionComponent, PropsWithChildren } from 'react';
import { cn } from 'src/lib/utils';

type PageContainerProps = {
  sideColumn?: boolean;
  className?: string;
};

export const PageContainer: FunctionComponent<PropsWithChildren<PageContainerProps>> = (props) => {
  const { sideColumn = false, children, className } = props;

  return (
    <div
      data-side={sideColumn}
      className={cn(
        'w-full grid gap-5 grid-cols-[100%] grid-rows-[auto_auto] data-[side=true]:grid-cols-[1fr_278px] data-[side=true]:grid-rows-[auto_auto]',
        className
      )}
    >
      {children}
    </div>
  );
};

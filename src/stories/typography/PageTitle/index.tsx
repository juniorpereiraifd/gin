import { FunctionComponent, ReactNode } from 'react';
import { cn } from 'src/lib/utils';
import { Heading } from 'src/ui/Typograph';

type PageTitleProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const PageTitle: FunctionComponent<PageTitleProps> = (props) => {
  const { icon, children, className } = props;

  return (
    <Heading level="1" className={cn('text-3xl font-bold text-slate-700', className)}>
      {icon && icon}
      {children}
    </Heading>
  );
};

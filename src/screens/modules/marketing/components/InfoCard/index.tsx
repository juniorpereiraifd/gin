import { Skeleton } from 'antd';
import { FunctionComponent, ReactNode } from 'react';
import { cn } from 'src/lib/utils';

interface InfoCardProps {
  title: string;
  content: ReactNode;
  loading?: boolean;
  className?: string;
}

export const InfoCard: FunctionComponent<InfoCardProps> = (props) => {
  const { title, content, className, loading } = props;

  return (
    <div
      title={title}
      className={cn(
        'flex flex-col gap-3 bg-white border border-solid border-slate-200 py-3 px-4 drop-shadow-sm rounded-md',
        className
      )}
    >
      <p className="text-sm font-medium">{title}</p>
      {loading === true ? (
        <Skeleton.Button className="w-full flex [&_.ant-skeleton-button]:!w-full" />
      ) : (
        <span className="text-slate-600">{content}</span>
      )}
    </div>
  );
};

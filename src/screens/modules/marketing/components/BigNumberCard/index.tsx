import { Skeleton } from 'antd';
import { Fragment, FunctionComponent, ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from 'src/ui/Card';

type BigNumberCardProps = {
  title: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  loading?: boolean;
};

export const BigNumberCard: FunctionComponent<BigNumberCardProps> = (props) => {
  const { title, value, icon, footer, orientation = 'vertical', loading = false } = props;

  return (
    <Card
      data-orientation={orientation}
      className="flex flex-col justify-between overflow-hidden data-[orientation='horizontal']:flex-row"
    >
      <div
        data-with-value={(value || null) !== null}
        className="flex flex-col gap-2 p-6 pb-3 data-[with-value=false]:justify-center data-[with-value=false]:px-6 data-[with-value=false]:py-4"
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-0 text-slate-600">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        {loading === true ? (
          <Skeleton.Button className="w-full flex [&_.ant-skeleton-button]:!w-full" />
        ) : (
          <Fragment>
            {(value || null) !== null && (
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-slate-700">{value}</div>
              </CardContent>
            )}
          </Fragment>
        )}
      </div>
      {footer !== undefined && (
        <CardFooter
          data-orientation={orientation}
          className="pb-3 pt-3 bg-slate-50 data-[orientation='horizontal']:px-4"
        >
          {footer}
        </CardFooter>
      )}
    </Card>
  );
};

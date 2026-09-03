import { FunctionComponent, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'src/ui/Card';

type BigNumberCardProps = {
  title: string;
  value: ReactNode;
  icon?: ReactNode;
};

export const BigNumberCard: FunctionComponent<BigNumberCardProps> = (props) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2 text-slate-600">
        <CardTitle className="text-sm font-medium">{props.title}</CardTitle>
        {props.icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-700">{props.value}</div>
      </CardContent>
    </Card>
  );
};

import { FunctionComponent, ReactNode } from 'react';
import { Checkbox as BaseCheckbox, Spin, Tooltip } from 'antd';
import type { CheckboxProps as BaseCheckboxProps } from 'antd';
import { cn } from 'src/lib/utils';
import { CircleHelp } from 'lucide-react';

type CheckboxProps = BaseCheckboxProps & {
  label?: ReactNode;
  align?: 'top' | 'center';
  tooltip?: string;
  loading?: boolean;
};

export const Checkbox: FunctionComponent<CheckboxProps> = ({ label, align, tooltip, loading, ...props }) => {
  return (
    <div className={cn('flex', align === 'top' ? 'items-start' : 'items-center')}>
      <BaseCheckbox {...props}>{label && <span className="text-sm text-slate-600">{label}</span>}</BaseCheckbox>
      {loading && <Spin size="small" className="ml-2" />}
      {tooltip && (
        <Tooltip title={tooltip}>
          <CircleHelp size={14} className="text-slate-500 cursor-help ml-2" />
        </Tooltip>
      )}
    </div>
  );
};

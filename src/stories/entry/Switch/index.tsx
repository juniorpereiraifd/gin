import { FunctionComponent, ReactNode } from 'react';
import { Switch as BaseSwitch, Tooltip } from 'antd';
import type { SwitchProps as BaseSwitchProps } from 'antd/es/switch';
import * as S from './styles';
import { CircleHelp } from 'lucide-react';

type SwitchProps = BaseSwitchProps & {
  label?: ReactNode;
  align?: 'top' | 'center';
  tooltip?: string;
};

export const Switch: FunctionComponent<SwitchProps> = (props) => {
  return (
    <S.WrapperSwitch align={props.align}>
      <BaseSwitch {...props} />
      {(props.label ?? null) !== null && (
        <label htmlFor={props.id} className="switch-label">
          {props.label}
        </label>
      )}
      {props.tooltip && (
        <Tooltip title={props.tooltip}>
          <CircleHelp size={14} className="text-slate-500 cursor-help ml-2" />
        </Tooltip>
      )}
    </S.WrapperSwitch>
  );
};

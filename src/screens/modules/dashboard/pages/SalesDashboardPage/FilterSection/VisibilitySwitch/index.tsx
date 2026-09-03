import { Switch, Tooltip } from 'antd';
import * as S from './styles';
import { FunctionComponent } from 'react';

type VisibilitySwitchProps = {
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
  label: string;
  unauthorized?: boolean;
};

export const VisibilitySwitch: FunctionComponent<VisibilitySwitchProps> = (
  props
) => {
  const { checked, disabled, label, onChange, unauthorized } = props;

  return (
    <Tooltip
      placement="top"
      title={
        disabled
          ? 'É necessário manter pelo menos uma opção de visualização ativada.'
          : ''
      }
    >
      <S.SwitchWrapper>
        <Switch
          checked={checked}
          disabled={disabled || unauthorized === true}
          onChange={onChange}
        />
        <label className="visibility-control-label">{label}</label>
      </S.SwitchWrapper>
    </Tooltip>
  );
};

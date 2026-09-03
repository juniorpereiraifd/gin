import { HTMLAttributes, ReactNode } from 'react';
import { InfoCircleFill } from '@styled-icons/bootstrap/InfoCircleFill';
import { Tooltip } from 'antd';
import * as S from './styles';

interface FormItemProps extends HTMLAttributes<HTMLDivElement> {
  rowDirection?: boolean;
  required?: boolean;
  label?: string;
  infoHint?: string;
  labelPosition?: 'left' | 'right';
  onClickOnLabel?: () => void;
  heading?: ReactNode;
  minHeight?: string;
  helperText?: string;
  children: ReactNode;
}

export function FormItem({
  rowDirection,
  required,
  label,
  infoHint,
  labelPosition = 'left',
  onClickOnLabel,
  heading,
  minHeight,
  helperText,
  children,
  ...props
}: FormItemProps) {
  const requiredValue = required ? '* ' : '';
  const colonValue = labelPosition === 'left' ? ':' : '';

  const labelText = `${requiredValue}${label}${colonValue}`;

  const labelContent = (
    <label onClick={onClickOnLabel}>
      {labelText}
      {infoHint !== undefined && (
        <Tooltip title={infoHint}>
          <InfoCircleFill size={12} />
        </Tooltip>
      )}
    </label>
  );

  const helperContent = helperText ? <p>{helperText}</p> : null;

  return (
    <S.Wrapper
      rowDirection={rowDirection}
      title={label}
      minHeight={minHeight}
      hasOnClickOnLabel={!!onClickOnLabel}
      {...props}
    >
      {heading && <S.HeadingWrapper>{heading}</S.HeadingWrapper>}

      {labelPosition === 'left' && label && labelContent}

      {children}

      {labelPosition === 'right' && label && labelContent}

      {helperContent}
    </S.Wrapper>
  );
}

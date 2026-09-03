import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import * as S from './styles';

interface SelectWrapperProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  label: string;
  children: ReactNode;
}

export function SelectWrapper({ label, children }: SelectWrapperProps) {
  return (
    <S.Wrapper title={label}>
      <label>{label}</label>
      {children}
    </S.Wrapper>
  );
}

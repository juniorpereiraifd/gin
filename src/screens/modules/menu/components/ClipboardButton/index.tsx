import { ButtonHTMLAttributes, ReactNode } from 'react';
import * as S from './styles';

export interface ClipboardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: ReactNode;
}

const ClipboardButton = ({ icon = null, text, ...restProps }: ClipboardButtonProps) => (
  <S.Wrapper {...restProps}>
    <S.Content>{text}</S.Content>

    {!!icon && icon}
  </S.Wrapper>
);

export default ClipboardButton;

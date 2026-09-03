import { FunctionComponent, ReactNode } from 'react';
import * as S from './styles';

type AnnouncementBarProps = {
  content: ReactNode;
};

export const AnnouncementBar: FunctionComponent<AnnouncementBarProps> = (
  props
) => {
  return <S.Bar>{props.content}</S.Bar>;
};

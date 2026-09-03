import React from 'react';
import * as S from './styles';

export type SmallProps = {
  children: React.ReactNode;
  /**
   * The color of paragraph.
   */
  color?: string;
};

/**
 * Basic text writing in small size.
 */
const Small = ({ children, ...props }: SmallProps) => (
  <S.Small {...props}>{children}</S.Small>
);

export default Small;

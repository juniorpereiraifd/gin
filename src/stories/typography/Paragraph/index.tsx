import React from 'react';
import * as S from './styles';

export interface ParagraphProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  /**
   * The size of paragraph.
   */
  type?: 'normal' | 'lead';
  /**
   * The color of paragraph.
   */
  color?: string;
  /**
   * The marginTop of paragraph.
   */
  mt?: string;
  /**
   * The marginBottom of paragraph.
   */
  mb?: string;
  /**
   * The marginLeft of paragraph.
   */
  ml?: string;
  /**
   * The marginRight of paragraph.
   */
  mr?: string;
  /**
   * The margin of paragraph.
   */
  margin?: string;
}

/**
 * Basic text writing, with paragraph you can select by two sizes (normal/lead).
 */
const Paragraph = ({ type = 'normal', children, ...props }: ParagraphProps) => (
  <S.Paragraph role="paragraph" type={type} {...props}>
    {children}
  </S.Paragraph>
);

export default Paragraph;

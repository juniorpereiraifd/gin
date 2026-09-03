import React from 'react';
import * as S from './styles';

export type BoxProps = {
  /**
   * Type of box styles, options:
   */
  type?: 'success' | 'warning' | 'danger' | 'default';
  /**
   * Padding of box with the following options:
   */
  padding?: 'small' | 'normal' | 'large' | 'none';
  /**
   * Padding of box with the following options:
   */
  status?: 'listed' | 'not-listed' | 'suspended' | 'disabled';
  /**
   * Your content wrapped by the box
   */
  children: string | React.ReactNode;
  onClick?: () => void;
  // eslint-disable-next-line
  innerRef?: any;

  isDragItem?: boolean;

  removeShadow?: boolean;

  boxAs?: 'div' | 'link';
  href?: string;
};

/**
 * Simple rectangular with border radius container.
 */
const Box = ({
  innerRef,
  padding = 'normal',
  type = 'default',
  status = 'listed',
  children,
  onClick,
  boxAs = 'div',
  href,
  ...props
}: BoxProps) => {
  return boxAs === 'div' ? (
    <S.Wrapper
      padding={padding}
      status={status}
      type={type}
      {...props}
      onClick={onClick}
      ref={innerRef}
    >
      {children}
    </S.Wrapper>
  ) : (
    <S.LinkWrapper
      padding={padding}
      status={status}
      type={type}
      {...props}
      onClick={onClick}
      ref={innerRef}
      href={href}
    >
      {children}
    </S.LinkWrapper>
  );
};

export default Box;

import React from 'react';
import * as S from './styles';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

export type TitleProps = {
  /**
   * The sizes of title, each number respect heading styles
   */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * An optional icon in prefix
   */
  icon?: React.ReactNode;
  children: React.ReactNode | string;
  dragHandleProps?: DraggableProvidedDragHandleProps;
  floatLeft?: boolean;
  isGrab?: boolean;
  linkStyleOnHover?: boolean;
};

/**
 * Basic text writing with heading style.
 */
const Title = ({
  icon,
  linkStyleOnHover,
  children,
  level = 1,
  dragHandleProps,
  floatLeft = false,
  ...props
}: TitleProps) => {
  const isGrab = !!dragHandleProps;
  const linkStyle = !!linkStyleOnHover;

  return (
    <S.Title
      level={level}
      linkStyleOnHover={linkStyle}
      icon={icon}
      isGrab={isGrab}
      floatLeft={floatLeft}
      {...props}
    >
      {floatLeft && (
        <span style={{ float: 'left' }} {...dragHandleProps}>
          {icon}
        </span>
      )}
      {!floatLeft && <span {...dragHandleProps}>{icon}</span>}
      {children}
    </S.Title>
  );
};
export default Title;

import React from 'react';
import { Space as CustomSpace } from 'antd';

export type SpaceProps = {
  /**
   * If the space component get full width by parent component
   */
  fullWidth?: boolean;
  /**
   * The space size
   */
  size?: 'small' | 'middle' | 'large' | number;
  /**
   * The space direction
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * Wrapped Items
   */
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const getStyles = (fullWidth: boolean) => {
  if (fullWidth) {
    return {
      width: '100%',
    };
  }
};

/**
 * Set components spacing.
 */

const Space = ({
  size = 'small',
  direction = 'vertical',
  children,
  fullWidth = true,
  ...props
}: SpaceProps) => (
  <CustomSpace
    size={size}
    direction={direction}
    style={{ ...props.style, ...getStyles(fullWidth) }}
    {...props}
  >
    {children}
  </CustomSpace>
);

export default Space;

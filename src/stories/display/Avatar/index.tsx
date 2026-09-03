import React from 'react';
import * as S from './styles';

export type AvatarProps = {
  /**
   * How large should the avatar be?
   */
  size?: number | 'large' | 'small' | 'default';
  /**
   * In the case of the button, have the maximum size of the container
   */
  shape?: 'circle' | 'square';
  /**
   * The address of the image for an image avatar
   */
  src?: string;
  /**
   * Alternative text for image accessibility
   */
  alt?: string;
  /**
   * An optional icon
   */
  icon?: React.ReactNode;
  /**
   * An optional child
   */
  children?: React.ReactNode | string;

  /**
   * Optional click handler
   */
  onClick?: () => (event: React.MouseEvent<HTMLButtonElement>) => void;
};

/**
 * Avatars can be used to represent people or objects. It supports images, Icons, or letters.
 */
const Avatar = ({
  children,
  size = 'default',
  shape = 'circle',
  alt,
  ...props
}: AvatarProps) => (
  <S.Avatar size={size} shape={shape} {...props} alt={alt}>
    {children}
  </S.Avatar>
);

export default Avatar;

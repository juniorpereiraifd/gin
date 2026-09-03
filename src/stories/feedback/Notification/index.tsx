import React from 'react';
import * as S from './styles';
import { CloseOutline } from '@styled-icons/evaicons-outline/CloseOutline';
import Box, { BoxProps } from 'src/stories/general/Box';

export type NotificationProps = {
  /**
   * Title of this notification
   */
  title: string;
  /**
   * Short/Long description to respective notification
   */
  description: string | React.ReactNode;
  /**
   * On dispatch close function
   */
  onClose?: () => void;
} & Pick<BoxProps, 'type'>;

/**
 * Display a notification message only in determinated container.
 */
const Notification = ({
  type = 'warning',
  title,
  description,
  onClose,
}: NotificationProps) => {
  const [visible, setVisible] = React.useState(true);

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
    setVisible(false);
  };

  return visible ? (
    <Box type={type}>
      <S.Header>
        <S.Title level={4} aria-label={title}>
          {title}
        </S.Title>
        <S.CloseButton
          aria-label="Close button"
          role="button"
          onClick={handleOnClose}
        >
          <CloseOutline aria-label="Close icon" size={25} />
        </S.CloseButton>
      </S.Header>
      {description}
    </Box>
  ) : null;
};

export default Notification;

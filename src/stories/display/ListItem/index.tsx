import React, { FunctionComponent, ReactNode } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import { Pencil } from '@styled-icons/heroicons-outline/Pencil';
import { Trash } from '@styled-icons/bootstrap/Trash';
import { MailSend } from 'styled-icons/remix-line';
import Delete from 'src/components/Delete';
import * as S from './styles';
import { Switch } from 'src/stories/entry/Switch';

type ListItemProps = {
  leftText: React.ReactNode;
  onSend?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dragHandleAction?: ReactNode;
  activeAction?: {
    active: boolean;
    onActive: (checked: boolean) => void;
  };
  padding?: 'small' | 'normal' | 'large' | 'none';
  innerRef?: any;
  showSend?: boolean;
  noActions?: boolean;
  removeShadow?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps;
};

const ListItem: FunctionComponent<ListItemProps> = (props) => {
  const {
    leftText,
    onSend,
    onEdit,
    onDelete,
    dragHandleAction,
    activeAction,
    padding = 'large',
    innerRef,
    showSend,
    noActions = false,
    removeShadow,
    dragHandleProps,
    ...rest
  } = props;

  return (
    <S.Wrapper
      removeShadow={!!removeShadow}
      isDragItem={!!dragHandleProps}
      padding={padding}
      innerRef={innerRef}
      {...rest}
    >
      <S.Left>
        {dragHandleAction !== undefined && dragHandleAction}
        {activeAction !== undefined && (
          <Switch
            checked={activeAction.active}
            onChange={(checked) => activeAction.onActive(checked)}
            size="small"
          />
        )}
        {leftText}
      </S.Left>
      {noActions ? null : (
        <S.Right>
          {onSend && showSend && (
            <MailSend title={'Reenviar e-mail'} onClick={onSend} size={22} />
          )}
          {onEdit && <Pencil onClick={onEdit} size={22} />}

          {onDelete !== undefined && (
            <Delete onDelete={onDelete}>
              <Trash size={22} />
            </Delete>
          )}
        </S.Right>
      )}
    </S.Wrapper>
  );
};

export default ListItem;

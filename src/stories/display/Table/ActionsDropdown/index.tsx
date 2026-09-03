import { Fragment, type ReactNode } from 'react';
import { App, Button, Input, Tooltip, type TableColumnsType } from 'antd';
import { Ellipsis, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemProps,
  DropdownMenuTrigger,
} from 'src/ui/DropdownMenu';

export type ActionsConfig<T> = {
  columnProps?: Partial<TableColumnsType<T>>;
  getDisabledState?: (item: T) => boolean;
  tooltip?: (item: T) => string;
  edit?: { onClick: (item: T) => void; isVisible?: (item: T) => boolean };
  isVisible?: (item: T) => boolean;
  delete?: {
    onClick: (item: T) => void;
    skipConfirmation?: (item: T) => boolean;
    content?: ReactNode;
    isVisible?: (item: T) => boolean;
  };
  custom?: {
    key: string;
    content: ReactNode | ((item: T) => ReactNode);
    props?: DropdownMenuItemProps;
    getDisabledState?: (item: T) => boolean;
    isVisible?: (item: T) => boolean;
    onClick: (item: T) => void;
  }[];
};

type ActionsDropdownProps<T> = {
  data: any;
  actions: ActionsConfig<T>;
  disabled?: boolean;
  tooltip?: string;
};

export const ActionsDropdown = <T extends object = Record<string, any>>(props: ActionsDropdownProps<T>) => {
  const { data, actions, disabled, tooltip } = props;
  const { modal } = App.useApp();

  const handleDelete = async (data: T) => {
    if (actions.delete?.skipConfirmation?.(data)) {
      return actions.delete?.onClick(data);
    }

    let text = '';

    const instance = modal.confirm({
      title: 'Você tem certeza que deseja excluir?',
      className: '[&_.anticon-exclamation-circle]:hidden [&_.ant-modal-confirm-paragraph]:!max-w-full',
      content: (
        <div className="flex flex-col gap-4 mb-6">
          {actions.delete?.content ?? (
            <p>Você realmente deseja excluir este item? Esta ação é permamente e irreversível.</p>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="delete-field">
              Para confirmar a exclusão, digite <b>"excluir"</b> no campo abaixo:
            </label>
            <Input
              id="delete-field"
              autoFocus
              onChange={(e) => {
                text = e.target.value;

                instance.update({
                  okButtonProps: { danger: true, disabled: text.toLowerCase() !== 'excluir' },
                });
              }}
            />
          </div>
        </div>
      ),
      closable: true,
      width: 450,
      okText: 'Excluir',
      okButtonProps: { danger: true, disabled: true },
      cancelText: 'Cancelar',
      onOk: () => actions.delete?.onClick(data),
    });
  };

  return (
    <Fragment>
      <DropdownMenu>
        <Tooltip title={tooltip}>
          <DropdownMenuTrigger asChild disabled={disabled}>
            <Button type="text" icon={<Ellipsis size={18} />} disabled={disabled} />
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent>
          {actions.edit && (actions.edit.isVisible === undefined || actions.edit.isVisible(data) === true) && (
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onClick={() => actions.edit!.onClick(data)}
            >
              <Pencil size={14} />
              Editar
            </DropdownMenuItem>
          )}
          {actions.delete && (actions.delete.isVisible === undefined || actions.delete.isVisible(data) === true) && (
            <DropdownMenuItem
              className="cursor-pointer flex items-center gap-2"
              onSelect={(e) => e.preventDefault()}
              onClick={() => handleDelete(data)}
            >
              <Trash size={14} />
              Deletar
            </DropdownMenuItem>
          )}
          {actions.custom?.map((item) => {
            if (item.isVisible !== undefined && item.isVisible(data) === false) return null;

            const content = typeof item.content === 'function' ? item.content(data) : item.content;

            if (content == null) return null;

            return (
              <DropdownMenuItem
                {...item.props}
                disabled={item.getDisabledState?.(data)}
                key={item.key}
                className="cursor-pointer flex items-center gap-2"
                onClick={() => item.onClick(data)}
              >
                {content}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
};

import { useState, type FunctionComponent } from 'react';
import { Input, Space, Tooltip } from 'antd';
import { GripVertical, Inbox, Plus, Trash2 } from 'lucide-react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers';
import { Button } from 'src/stories/general/Button';

type ListOptionsProps = {
  value?: string[];
  onChange?: (value: string[]) => void;
  emptyListText?: string;
  input?: {
    placeholder?: string;
    buttonTooltip?: string;
  };
  list?: {
    options?: {
      removeButtonTooltip?: string;
    };
  };
};

export const ListOptions: FunctionComponent<ListOptionsProps> = (props) => {
  const { value = [], onChange, emptyListText, input, list } = props;
  const [optionInput, setOptionInput] = useState('');

  const handleAddOption = () => {
    if (optionInput.trim() && !value.includes(optionInput.trim())) {
      onChange?.([...value, optionInput.trim()]);
      setOptionInput('');
    }
  };

  return (
    <div className="flex flex-col gap-4 overflow-hidden">
      <div className="h-36 overflow-y-auto flex flex-col gap-3 border border-gray-300 rounded-md">
        {value.length > 0 ? (
          <DragDropProvider
            onDragEnd={(event) => {
              onChange?.(move(value, event));
            }}
          >
            <ul className="flex flex-col gap-2 p-2">
              {value.map((option, index) => (
                <Option
                  key={option}
                  id={option}
                  index={index}
                  title={option}
                  list={list}
                  onRemove={() => onChange?.(value.filter((opt) => opt !== option))}
                />
              ))}
            </ul>
          </DragDropProvider>
        ) : (
          <div className="w-full h-full flex items-center justify-center flex-col gap-2">
            <Inbox size={16} className="text-gray-300" />
            <span className="text-xs text-gray-400">{emptyListText ?? 'Nenhuma opção adicionada'}</span>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder={input?.placeholder ?? 'Nome da opção'}
            value={optionInput}
            onChange={(e) => setOptionInput(e.target.value)}
            onPressEnter={handleAddOption}
          />
          <Tooltip title={input?.buttonTooltip ?? 'Adicionar opção'}>
            <Button variant="outlined" icon={<Plus size={14} />} onClick={handleAddOption} />
          </Tooltip>
        </Space.Compact>
      </div>
    </div>
  );
};

type OptionProps = {
  id: string;
  index: number;
  title: string;
  onRemove: VoidFunction;
  list?: ListOptionsProps['list'];
};

const Option: FunctionComponent<OptionProps> = (props) => {
  const { id, index, title, onRemove, list } = props;
  const { ref, handleRef } = useSortable({ id, index, modifiers: [RestrictToVerticalAxis] });

  return (
    <li ref={ref} className="flex items-center justify-between gap-2 p-2 rounded-md border border-gray-300">
      <div className="flex items-center gap-3">
        <GripVertical ref={handleRef} size={16} className="text-slate-400" />
        <span className="text-sm text-slate-600">{title}</span>
      </div>
      <Tooltip title={list?.options?.removeButtonTooltip ?? 'Remover opção'}>
        <Button
          variant="filled"
          size="small"
          color="danger"
          shape="circle"
          icon={<Trash2 size={14} />}
          onClick={onRemove}
        />
      </Tooltip>
    </li>
  );
};

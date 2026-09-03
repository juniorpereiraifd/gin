import React from 'react';
import * as S from './styles';
import { CheckboxProps } from 'antd/lib/checkbox/Checkbox';

export type TaskProps = {
  /**
   * The title of determined task
   */
  title: string;
  /**
   * Description of the task, a simple text or a complete component
   */
  description: string | React.ReactNode;
  /**
   * The callback function that is triggered when the state changes
   */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & CheckboxProps;

const Task = ({ title, description, ...props }: TaskProps) => (
  <S.Wrapper>
    <S.Checkbox aria-label={title} {...props} />
    <div>
      <S.Title>{title}</S.Title>
      {description}
    </div>
  </S.Wrapper>
);

export default Task;

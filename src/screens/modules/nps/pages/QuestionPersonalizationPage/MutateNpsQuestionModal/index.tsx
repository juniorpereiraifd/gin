import { Fragment, useEffect, useRef, useState } from 'react';
import {
  Form,
  Input,
  Radio,
  Button as AddButton,
  notification,
  Select,
  Modal,
} from 'antd';
import type { InputRef } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Number } from '@styled-icons/octicons/Number';
import { TextareaT } from '@styled-icons/bootstrap/TextareaT';
import { InputCursor } from '@styled-icons/bootstrap/InputCursor';
import { TextFirstLine } from '@styled-icons/fluentui-system-regular/TextFirstLine';
import { Plus } from '@styled-icons/bootstrap/Plus';
import { Trash } from '@styled-icons/bootstrap/Trash';
import { DragIndicator } from '@styled-icons/material/DragIndicator';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { RootType } from 'src/store/modules/rootReducer';
import {
  Question,
  OptionProps,
  CategoryQuestion,
} from 'src/store/modules/nps/reducer';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { Switch } from 'src/stories/entry/Switch';
import * as S from './styles';

const rules = {
  name: [{ required: true, message: 'O título é obrigatório.' }],
  type: [{ required: true, message: 'O tipo da pergunta é obrigatório.' }],
  options: [{ required: true, message: 'As opções são obrigatórias.' }],
  scale: [{ required: true, message: 'A escala é obrigatória.' }],
  category: [{ required: true, message: 'A categoria é obrigatória.' }],
};

type QuestionFormValues = {
  type: Question['type'];
  name: string;
  description?: string;
  required: boolean;
  scale?: number;
  category: CategoryQuestion;
};

export const MutateNpsQuestionModal = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const {
    nps: { questionModalIsOpen, questionEditable, savingQuestion },
  } = useSelector((state: RootType) => state);
  const [options, setOptions] = useState<OptionProps[]>([]);
  const [optionName, setOptionName] = useState('');
  const [questionType, setQuestionType] = useState<Question['type'] | null>(
    null
  );
  const selectOptionsRef = useRef<InputRef>(null);

  useEffect(() => {
    if (questionModalIsOpen === false) {
      form.resetFields();
      setOptions([]);
      setOptionName('');
      setQuestionType(null);
    }
  }, [questionModalIsOpen]);

  useEffect(() => {
    if (questionEditable !== null) {
      form.setFieldsValue({
        type: questionEditable.type,
        name: questionEditable.name,
        description: questionEditable.description,
        required: questionEditable.required,
        category: questionEditable.category,
      });

      switch (questionEditable.type) {
        case 'single-choice':
          setOptions(questionEditable.options);
          setQuestionType('single-choice');
          break;
        case 'scale':
          setOptions(questionEditable.options);
          setQuestionType('scale');
          form.setFieldsValue({ scale: questionEditable.options.length });
          break;
        case 'short-answer':
          setQuestionType('short-answer');
          break;
        case 'long-answer':
          setQuestionType('long-answer');
          break;
      }
    }
  }, [questionEditable]);

  const handleSubmit = (values: QuestionFormValues) => {
    const payload: Partial<Question> = {
      type: values.type,
      name: values.name,
      description: values.description,
      required: values.required ?? false,
      category: values.category,
    };

    if (payload.type === 'single-choice') {
      payload.options = options;
    }

    if (payload.type === 'scale' && values.scale !== undefined) {
      payload.options = [
        ...Array.from({ length: values.scale }).map((_, index) => ({
          name: String(index + 1),
          position: index + 1,
        })),
      ];
    }

    if (questionEditable) {
      dispatch(
        NpsCreators.editQuestionRequest({
          ...questionEditable,
          ...payload,
        })
      );
    } else {
      dispatch(
        NpsCreators.createQuestionRequest({
          ...(payload as Omit<Question, 'id'>),
        })
      );
    }
  };

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOptionName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (optionName.trim() === '') {
      return notification.warning({
        message: 'Por favor, informe um nome para a opção',
      });
    }

    if (
      options.some(
        (item) =>
          item.name.toLowerCase().trim() === optionName.toLowerCase().trim()
      )
    ) {
      return notification.warning({
        message: 'Essa opção já foi adicionada',
      });
    }

    setOptions((prev) => [
      ...prev,
      { name: optionName, position: prev.length + 1 },
    ]);

    setOptionName('');

    setTimeout(() => {
      selectOptionsRef.current?.focus();
    }, 0);
  };

  const handleClose = () => {
    dispatch(NpsCreators.setQuestionModalVisibility(false));
    form.resetFields();
    setOptions([]);
    setOptionName('');
    setQuestionType(null);
  };

  const handleRemoveOption = (option: OptionProps) => {
    setOptions((prev) => prev.filter((item) => item !== option));
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    setOptions((prev) => {
      const newOptions = Array.from(prev);
      const [removed] = newOptions.splice(source.index, 1);
      newOptions.splice(destination.index, 0, removed);

      return newOptions.map((item, index) => ({
        ...item,
        position: index + 1,
      }));
    });
  };

  return (
    <Modal
      open={questionModalIsOpen === true}
      centered
      destroyOnClose
      onCancel={handleClose}
      width={'800px'}
      title={
        <Title level={3}>
          {questionEditable ? 'Editar pergunta' : 'Criar pergunta'}
        </Title>
      }
      footer={
        <S.Footer>
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            disabled={questionType === null}
            loading={savingQuestion}
            onClick={() => form.submit()}
          >
            Salvar
          </Button>
        </S.Footer>
      }
    >
      <S.Container>Selecione o tipo da pergunta</S.Container>
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="type" rules={rules.type}>
          <S.RadioGroup onChange={(e) => setQuestionType(e.target.value)}>
            <Radio value={'single-choice'}>
              <div>
                <S.TitleContent>
                  <TextFirstLine size={18} />
                  <strong>Campo de opções</strong>
                </S.TitleContent>
                <span className="text-xs text-slate-500">
                  Crie um campo com opções pré-definidas
                </span>
              </div>
            </Radio>
            <Radio value={'scale'}>
              <div>
                <S.TitleContent>
                  <Number size={18} />
                  <strong>Campo de escala</strong>
                </S.TitleContent>
                <span className="text-xs text-slate-500">
                  Crie um campo com uma escala numérica
                </span>
              </div>
            </Radio>
            <Radio value={'short-answer'}>
              <div>
                <S.TitleContent>
                  <InputCursor size={18} />
                  <strong>Campo de texto curto</strong>
                </S.TitleContent>
                <span className="text-xs text-slate-500">
                  Crie um campo aberto para resposta curta
                </span>
              </div>
            </Radio>
            <Radio value={'long-answer'}>
              <div>
                <S.TitleContent>
                  <TextareaT size={18} />
                  <strong>Campo de texto longo</strong>
                </S.TitleContent>
                <span className="text-xs text-slate-500">
                  Crie um campo aberto para resposta longa
                </span>
              </div>
            </Radio>
          </S.RadioGroup>
        </Form.Item>
        {questionType !== null && (
          <Fragment>
            <S.Fields>
              <Form.Item
                label="Título"
                name="name"
                rules={rules.name}
                extra="Insira o título da pergunta desejada."
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Descrição"
                name="description"
                extra="Você pode incluir uma descrição breve sobre a pergunta."
              >
                <Input />
              </Form.Item>
              {questionType === 'single-choice' && (
                <S.OptionsSection>
                  <label className="title">Opções</label>
                  <S.Options>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="options">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {options.map((item, index) => (
                              <Draggable
                                key={item.name}
                                draggableId={item.name}
                                index={index}
                              >
                                {(provided) => (
                                  <S.Option
                                    key={item.name}
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                  >
                                    <div className="left-content">
                                      <S.DragHandle
                                        {...provided.dragHandleProps}
                                      >
                                        <DragIndicator size={20} />
                                      </S.DragHandle>
                                      {item.name}
                                    </div>
                                    <S.OptionActions>
                                      <Trash
                                        size={18}
                                        onClick={() => handleRemoveOption(item)}
                                      />
                                    </S.OptionActions>
                                  </S.Option>
                                )}
                              </Draggable>
                            ))}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </S.Options>
                  <S.InputOptions>
                    <Input
                      placeholder="Informe o nome da opção"
                      ref={selectOptionsRef}
                      value={optionName}
                      onChange={onNameChange}
                    />
                    <AddButton
                      variant="outlined"
                      icon={<Plus size={18} />}
                      onClick={addItem}
                    >
                      Adicionar
                    </AddButton>
                  </S.InputOptions>
                </S.OptionsSection>
              )}
            </S.Fields>
            <S.FieldsControl>
              {questionType === 'scale' && (
                <S.Scale>
                  <label className="before:content-['*'] before:mr-0.5 before:text-red-500">
                    Escala
                  </label>
                  <S.ScaleField>
                    <div className="mb-6 flex items-center gap-4">
                      <span className="base-scale-value">1</span>
                      <span className="separator">-</span>
                    </div>
                    <Form.Item name="scale" rules={rules.scale}>
                      <Select
                        defaultValue="0"
                        options={Array.from({ length: 10 }).map((_, index) => ({
                          label: index + 1,
                          value: index + 1,
                        }))}
                      />
                    </Form.Item>
                  </S.ScaleField>
                </S.Scale>
              )}
              <Form.Item name="category" label="Página" rules={rules.category}>
                <S.Select>
                  <S.Select.Option value="feedback">Página 1</S.Select.Option>
                  <S.Select.Option value="profile">Página 2</S.Select.Option>
                </S.Select>
              </Form.Item>
              <Form.Item name="required" valuePropName="checked">
                <Switch label="Pergunta obrigatória" />
              </Form.Item>
            </S.FieldsControl>
          </Fragment>
        )}
      </Form>
    </Modal>
  );
};

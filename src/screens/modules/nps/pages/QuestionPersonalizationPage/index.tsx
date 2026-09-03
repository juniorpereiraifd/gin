import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { notification, Select, Switch } from 'antd';
import { Copy, Plus } from 'lucide-react';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Question, CategoryQuestion } from 'src/store/modules/nps/reducer';
import { PageContainer } from 'src/components/PageContainer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import Loading from 'src/stories/feedback/Loading';
import { DraggableTable, OnDragEndProps } from 'src/stories/display/DraggableTable';
import { Button } from 'src/stories/general/Button';
import { MutateNpsQuestionModal } from './MutateNpsQuestionModal';
import { QrcodeBadge } from './QrcodeBadge';
import * as S from './styles';
import { CloneNpsQuestionDrawer } from './CloneNpsQuestionDrawer';

export const QuestionPersonalizationPage: FunctionComponent = () => {
  const dispatch = useDispatch();
  const { unitId } = useParams<'nps.personalization'>();
  const {
    hall: { unity },
    nps: { questions, loadingQuestions, savingQuestion, selectedCategoryQuestion },
  } = useSelector((state: RootType) => state);
  const [isCloneNpsQuestionDrawerOpen, setIsCloneNpsQuestionDrawerOpen] = useState(false);
  const [selectedQuestionsToClone, setSelectedQuestionsToClone] = useState<Question[]>([]);

  useEffect(() => {
    if (unity !== null) {
      dispatch(NpsCreators.setQuestionCategory('feedback'));
      dispatch(NpsCreators.getQuestionsRequest());
    }
  }, [unity]);

  const handleActiveItem = (item: Question) => dispatch(NpsCreators.editQuestionRequest(item));

  const handleEditItem = (item: Question) => {
    dispatch(NpsCreators.setQuestionEditable(item));
    dispatch(NpsCreators.setQuestionModalVisibility(true));
  };

  const handleDeleteQuestion = (item: Question) => dispatch(NpsCreators.deleteQuestionRequest(item.id));

  const handleAddItem = () => dispatch(NpsCreators.setQuestionModalVisibility(true));

  const handleChangeQuestionCaterory = (category: CategoryQuestion) => {
    dispatch(NpsCreators.setQuestionCategory(category));
    dispatch(NpsCreators.getQuestionsRequest());
  };

  const handleDragEnd = (props: OnDragEndProps<Question>) => {
    const { toBasedOnPreviousState, movedItem, updatedList } = props;

    if (toBasedOnPreviousState !== undefined) {
      dispatch(NpsCreators.reorderQuestions(updatedList));
      dispatch(
        NpsCreators.editQuestionRequest({
          ...movedItem,
          position: toBasedOnPreviousState,
        })
      );

      return;
    }

    return notification.error({
      message: 'Erro ao reordenar',
      description: 'Não foi possível reordenar a pergunta',
    });
  };

  const handleSelectCloneQuestions = (selected: Question | Question[]) => {
    setIsCloneNpsQuestionDrawerOpen(true);

    if (Array.isArray(selected)) {
      setSelectedQuestionsToClone(selected);
    } else {
      setSelectedQuestionsToClone([selected]);
    }
  };

  const handleCloseCloneQuestionDrawer = () => {
    setSelectedQuestionsToClone([]);
  };

  return (
    <PageContainer sideColumn>
      <MutateNpsQuestionModal />
      <PageTitle>Personalizar Pesquisa de Satisfação</PageTitle>
      <DraggableTable
        bordered
        selectable
        loading={loadingQuestions}
        className="shadow-sm row-start-2 col-start-1 [&_.ant-pagination]:px-4"
        pagination={{
          showTotal: (total) => `Total de ${total} perguntas`,
        }}
        onDragEnd={handleDragEnd}
        data={questions
          .filter((question) => question.category === selectedCategoryQuestion)
          .map((question) => ({ key: question.id, ...question }))}
        title={() => (
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center justify-center gap-4">
              <Select
                defaultValue="feedback"
                onChange={(value) => handleChangeQuestionCaterory(value as CategoryQuestion)}
              >
                <Select.Option value="feedback">Página 1</Select.Option>
                <Select.Option value="profile">Página 2</Select.Option>
              </Select>
              {savingQuestion === true && (
                <S.SavinQuestionLoading>
                  <Loading size={14} /> Salvando
                </S.SavinQuestionLoading>
              )}
            </div>
            <Button onClick={handleAddItem}>
              <Plus size={16} />
              Nova pergunta
            </Button>
          </div>
        )}
        rowSelectionActions={{
          custom: [
            {
              key: 'clone',
              content: (
                <span className="flex items-center gap-2">
                  <Copy size={14} /> Clonar
                </span>
              ),
              onClick: handleSelectCloneQuestions,
            },
          ],
        }}
        actions={{
          edit: {
            onClick: handleEditItem,
          },
          delete: {
            onClick: handleDeleteQuestion,
          },
          custom: [
            {
              key: 'clone',
              content: (
                <span className="flex items-center gap-2">
                  <Copy size={14} /> Clonar
                </span>
              ),
              onClick: handleSelectCloneQuestions,
            },
          ],
        }}
        columns={[
          {
            title: 'Ativa',
            dataIndex: 'active',
            render: (active, dataQuestion) => {
              const question = dataQuestion as Question;

              return (
                <div className="w-full flex justify-center">
                  <Switch checked={active} onChange={(active) => handleActiveItem({ ...question, active })} />
                </div>
              );
            },
          },
          { title: 'Nome', dataIndex: 'name' },
          {
            title: 'Tipo',
            dataIndex: 'type',
            render: (type: Question['type']) => typeField[type].name,
          },
        ]}
      />
      <div className="col-start-2 row-start-2 h-fit">
        <QrcodeBadge unitId={unitId} unitName={unity?.name || 'unit'} />
      </div>
      <CloneNpsQuestionDrawer
        open={isCloneNpsQuestionDrawerOpen}
        setOpen={setIsCloneNpsQuestionDrawerOpen}
        selectedQuestionsToClone={selectedQuestionsToClone}
        setSelectedQuestionsToClone={setSelectedQuestionsToClone}
        onClose={handleCloseCloneQuestionDrawer}
      />
    </PageContainer>
  );
};

const typeField: Record<Question['type'], { name: string }> = {
  scale: {
    name: 'Escala',
  },
  'single-choice': {
    name: 'Opções',
  },
  'long-answer': {
    name: 'Texto longo',
  },
  'short-answer': {
    name: 'Texto curto',
  },
};

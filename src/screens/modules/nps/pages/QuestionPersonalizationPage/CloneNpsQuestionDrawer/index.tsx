import { Fragment, useEffect, useState, type Dispatch, type FunctionComponent, type SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Divider, Drawer, Tooltip } from 'antd';
import { Inbox, Trash2 } from 'lucide-react';
import type { RootType } from 'src/store/modules/rootReducer';
import type { LinkedUnit } from 'src/store/modules/operator/reducer';
import { Creators as UnitCreators } from 'src/store/modules/unity/actions';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import type { UnityItemProps } from 'src/store/modules/unity/reducer';
import type { Question } from 'src/store/modules/nps/reducer';
import { Heading } from 'src/ui/Typograph';
import { notification } from 'src/utils/helpers';

type SelectUnit = {
  label: string;
  value: string;
};

type TargetSelectUnit = SelectUnit | SelectUnit[];

type CloneNpsQuestionDrawerProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedQuestionsToClone: Question[];
  setSelectedQuestionsToClone: Dispatch<SetStateAction<Question[]>>;
  onClose?: VoidFunction;
};

export const CloneNpsQuestionDrawer: FunctionComponent<CloneNpsQuestionDrawerProps> = (props) => {
  const { open, setOpen, selectedQuestionsToClone, setSelectedQuestionsToClone, onClose } = props;
  const dispatch = useDispatch();
  const {
    unity: { loading, data: units, pagination },
    nps: { cloningQuestions },
  } = useSelector((state: RootType) => state);
  const [unitNameSearched, setUnitNameSearched] = useState<string | null>(null);
  const [selectedLinkedUnits, setSelectedLinkedUnits] = useState<LinkedUnit[]>([]);

  useEffect(() => {
    if (open) {
      dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
    }
  }, [open]);

  const handleCloneQuestions = () => {
    if (selectedLinkedUnits.length === 0 || selectedQuestionsToClone.length === 0) {
      notification.error('Selecione ao menos uma unidade e uma pergunta para clonar', '');

      return;
    }

    dispatch(
      NpsCreators.cloneQuestionsRequest({
        questions: selectedQuestionsToClone,
        unitIds: selectedLinkedUnits.map((unit) => unit.id),
        onSuccessCallback: () => {
          handleClose();
        },
      })
    );
  };

  const handleClose = () => {
    setOpen(false);
    setUnitNameSearched(null);
    setSelectedLinkedUnits([]);
  };

  const handleSearchUnit = (unitName: string) => {
    setUnitNameSearched(unitName);

    dispatch(
      UnitCreators.getUnitsRequest({
        page: 1,
        unitName: unitName,
      })
    );
  };

  const onScrollUnitSelect = async (event: any) => {
    const target = event.target;

    if (!loading && pagination !== null && target.scrollTop + target.offsetHeight === target.scrollHeight) {
      target.scrollTo(0, target.scrollHeight);

      dispatch(
        UnitCreators.getUnitsRequest({
          page: pagination.current_page === 0 ? 1 : pagination.current_page + 1,
          isCumulative: true,
          ...(unitNameSearched !== null && { unitName: unitNameSearched }),
        })
      );
    }
  };

  const handleSelectUnit = (target: TargetSelectUnit) => {
    if ((target || null) !== null && Array.isArray(target) && target.length > 0) {
      const selectedUnits = target
        .map((item) => units.find((unit) => unit.id === item.value))
        .filter((unit): unit is UnityItemProps => unit !== undefined);

      if (selectedUnits.length > 0) {
        setSelectedLinkedUnits((prevUnits) => [
          ...prevUnits,
          ...selectedUnits.filter((unit) => !prevUnits.some((prevUnit) => prevUnit.id === unit.id)),
        ]);
      }
    }
  };

  const handleClearUnitSelect = () => {
    setUnitNameSearched(null);
    dispatch(UnitCreators.getUnitsRequest({ page: 1 }));
  };

  const handleDeleteQuestionToCloneList = (questionId: string) => {
    setSelectedQuestionsToClone((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId));
  };

  return (
    <Drawer
      destroyOnClose
      title="Clonar perguntas"
      closable={false}
      afterOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
      onClose={handleClose}
      open={open}
      className="[&_.ant-drawer-body]:p-0"
      footer={
        <div className="flex items-center justify-end gap-4 p-2">
          <Button variant="outlined" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleCloneQuestions} loading={cloningQuestions}>
            Clonar perguntas
          </Button>
        </div>
      }
    >
      <div className="flex flex-col w-full h-full p-6">
        <FormItem
          layout="vertical"
          label="Unidades para clonar"
          help="Selecione as unidades que deseja clonar as perguntas"
        >
          <DebouncedSelect
            allowClear
            mode="multiple"
            loading={loading}
            onChange={handleSelectUnit}
            handleLoadMore={handleSearchUnit}
            onClear={handleClearUnitSelect}
            onPopupScroll={pagination?.is_last_page === false ? onScrollUnitSelect : () => null}
            data={units.map((unit) => ({
              label: unit.name,
              value: unit.id,
            }))}
          />
        </FormItem>
        <Divider />
        <div className="flex flex-col gap-4">
          <Heading level="6">Perguntas selecionadas</Heading>
          <div className="flex flex-col gap-3">
            {selectedQuestionsToClone.length > 0 ? (
              <Fragment>
                {selectedQuestionsToClone.map((item) => (
                  <QuestionItemSelected key={item.id} question={item} onDelete={handleDeleteQuestionToCloneList} />
                ))}
              </Fragment>
            ) : (
              <div className="flex flex-col gap-3 items-center justify-center my-8">
                <Inbox size={28} strokeWidth={1.4} className="text-gray-300" />
                <span className="text-gray-500">Nenhuma pergunta selecionada</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

type QuestionItemSelectedProps = {
  question: Question;
  onDelete: (questionId: string) => void;
};

const QuestionItemSelected: FunctionComponent<QuestionItemSelectedProps> = (props) => {
  const { question, onDelete } = props;

  return (
    <div className="w-full flex items-center justify-between py-3 px-4 border border-gray-300 rounded-md">
      <span className="break-words min-w-0">{question.name}</span>
      <Tooltip title="Remover pergunta" mouseEnterDelay={0.3}>
        <Button
          className="flex-shrink-0"
          icon={<Trash2 size={16} />}
          variant="text"
          color="danger"
          onClick={() => onDelete(question.id)}
        />
      </Tooltip>
    </div>
  );
};

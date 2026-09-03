import { Input, InputNumber } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { Form, useForm } from 'src/stories/entry/Form';
import { FormItem } from 'src/stories/entry/Form/FormItem';
import { Button } from 'src/stories/general/Button';
import { Fragment, useEffect, type Dispatch, type FunctionComponent, type SetStateAction } from 'react';
import Delete from 'src/components/Delete';

type TableMutationFormValues = {
  'table-number': string;
  'min-people': number;
  'max-people': number;
};

type TableMutationFormProps = {
  setIsMutationTableFormIsVisible: Dispatch<SetStateAction<boolean>>;
};

export const TableMutationForm: FunctionComponent<TableMutationFormProps> = (props) => {
  const { setIsMutationTableFormIsVisible } = props;
  const [form] = useForm();
  const dispatch = useDispatch();
  const {
    hall: { hall, selectedTableMap, selectedTable, savingDeleteTable, savingUpdateTable },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (selectedTable !== null) {
      form.setFieldsValue({
        'table-number': selectedTable.number,
        'min-people': selectedTable.min_people,
        'max-people': selectedTable.max_people,
      });
    }
  }, [selectedTable]);

  const handleSubmit = (values: TableMutationFormValues) => {
    const tableNumberParsed =
      typeof values['table-number'] === 'number' ? [values['table-number']] : parseNumberRanges(values['table-number']);

    if (selectedTable !== null) {
      const registeredTable = hall?.map.find((item) => item.number === selectedTable.number);

      dispatch(
        HallCreators.updateTableRequest({
          table: {
            number: parseInt(values['table-number']),
            min_people: values['min-people'],
            max_people: values['max-people'],
          },
          selectedTable: selectedTable,
          registeredTable: registeredTable,
          onSuccessCallback:
            registeredTable !== undefined
              ? () => {
                  dispatch(HallCreators.setEditableTable(null));

                  form.resetFields();
                }
              : undefined,
        })
      );

      if (registeredTable === undefined) {
        dispatch(HallCreators.setEditableTable(null));

        form.resetFields();
      }

      return;
    }

    if (selectedTableMap !== null && selectedTableMap.length > 0) {
      const duplicatedTable = tableNumberParsed.find((tableNumber) =>
        selectedTableMap.find((table) => table.number === tableNumber)
      );

      if (duplicatedTable !== undefined) {
        form.setFields([
          {
            name: 'table-number',
            errors: [`A mesa de número ${duplicatedTable} já existe.`],
          },
        ]);

        return;
      }
    }

    dispatch(
      HallCreators.setTableMap(
        tableNumberParsed.map((table) => ({
          number: table,
          group:
            values['min-people'] <= values['max-people']
              ? `${values['min-people']} - ${values['max-people']}`
              : `${values['max-people']} - ${values['min-people']}`,
          min_people: values['min-people'],
          max_people: values['max-people'],
          draft: true,
        }))
      )
    );

    form.resetFields();
  };

  const handleDeleteTable = () => {
    if (selectedTable !== null) {
      dispatch(
        HallCreators.deleteTableRequest({
          table: selectedTable,
          registeredTable: hall?.map.find((item) => item.number === selectedTable.number),
          onSuccessCallback: () => {
            dispatch(HallCreators.setEditableTable(null));

            form.resetFields();
          },
        })
      );
    }
  };

  const handleCancelEditing = () => {
    setIsMutationTableFormIsVisible(false);
    dispatch(HallCreators.setEditableTable(null));
    form.resetFields();
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="grid grid-cols-3 gap-4 mt-4 [&_.ant-form-item-extra]:text-xs [&_.ant-form-item-extra]:mt-2"
      >
        <FormItem
          label="Número da mesa"
          name="table-number"
          rules={rules['table-number']}
          tooltip={
            <div>
              <p>É possível adicionar múltiplas mesas utilizando intervalos ou separando por vírgulas. Exemplo:</p>
              <br />
              <ul>
                <li>1-10: Adicionará mesas de 1 a 10;</li>
                <li>1,5: Adicionará apenas as mesas 1 e 5;</li>
                <li>1-10, 12, 15: Adicionará mesas de 1 a 10 e também as mesas 12 e 15.</li>
              </ul>
            </div>
          }
        >
          <Input placeholder="1-5, 8, 11-13" />
        </FormItem>
        <FormItem label="Mínimo de pessoas" name="min-people" rules={rules['min-people']}>
          <InputNumber className="w-full" />
        </FormItem>
        <FormItem label="Máximo de pessoas" name="max-people" rules={rules['max-people']}>
          <InputNumber className="w-full" />
        </FormItem>
      </Form>
      <div className="w-full flex items-center justify-end gap-4">
        {selectedTable !== null && (
          <Fragment>
            <Button variant="outlined" onClick={handleCancelEditing}>
              Cancelar
            </Button>
            <Delete onDelete={handleDeleteTable}>
              <Button color="danger" loading={savingDeleteTable}>
                Excluir
              </Button>
            </Delete>
          </Fragment>
        )}
        <Button onClick={form.submit} loading={selectedTable !== null && savingUpdateTable}>
          {selectedTable !== null ? 'Editar' : 'Adicionar'}
        </Button>
      </div>
    </div>
  );
};

const rules = {
  'table-number': [
    { required: true, message: 'O número da mesa é obrigatório.' },
    {
      pattern: /^\s*\d+(\s*-\s*\d+)?(\s*,\s*\d+(\s*-\s*\d+)?)*\s*$/,
      message: 'O valor informado não é válido, leia as instruções desse campo no ícone de informação.',
    },
  ],
  'min-people': [{ required: true, message: 'O valor mínimo de pessoas é obrigatório.' }],
  'max-people': [{ required: true, message: 'O valor máximo de pessoas é obrigatório.' }],
};

function parseNumberRanges(input: string): number[] {
  const result = new Set<number>();

  const parts = input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  for (const part of parts) {
    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-').map((item) => item.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (!isNaN(start) && !isNaN(end)) {
        const [from, to] = start <= end ? [start, end] : [end, start];

        for (let i = from; i <= to; i++) {
          result.add(i);
        }
      }
    } else {
      const num = parseInt(part, 10);

      if (!isNaN(num)) {
        result.add(num);
      }
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

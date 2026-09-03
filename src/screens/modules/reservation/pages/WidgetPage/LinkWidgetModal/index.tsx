import { useMemo, FunctionComponent, useState, useEffect } from 'react';
import { Form, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'src/stories/feedback/Modal';
import { Search } from '@styled-icons/boxicons-regular/Search';
import debounce from 'lodash/debounce';
import { Button } from 'src/stories/general/Button';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as WidgetCreators } from 'src/store/modules/widget/actions';
import { WidgetProps } from 'src/store/modules/widget/reducer';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';

type LinkWidgetModalProps = {
  unitId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const LinkWidgetModal: FunctionComponent<LinkWidgetModalProps> = (props) => {
  const { unitId, open, setOpen } = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [widgetNameSearched, setWidgetNameSearched] = useState<string | null>(null);

  const {
    widget: { searcheds, loadingSearchWidgets, searchedsPagination },
  } = useSelector((state: RootType) => state);

  useEffect(() => {
    if (open) {
      dispatch(WidgetCreators.searchWidgetsRequest({ page: 1 }));
    }
  }, [open]);

  const handleSearchUnit = (unitName: string) => {
    setWidgetNameSearched(unitName);

    dispatch(
      WidgetCreators.searchWidgetsRequest({
        query: unitName,
        page: 1,
      })
    );
  };

  const handleClearWidgetSelect = () => {
    setWidgetNameSearched(null);
    dispatch(WidgetCreators.searchWidgetsRequest({ page: 1 }));
  };

  const onScrollUnitSelect = async (event: any) => {
    const target = event.target;

    if (
      !loadingSearchWidgets &&
      searchedsPagination !== null &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      target.scrollTo(0, target.scrollHeight);

      dispatch(
        WidgetCreators.searchWidgetsRequest({
          page: searchedsPagination.current_page === 0 ? 1 : searchedsPagination.current_page + 1,
          reset: false,
          ...(widgetNameSearched !== null && { query: widgetNameSearched }),
        })
      );
    }
  };

  const onFinish = (values: {
    widget: {
      value: string;
    };
  }) => {
    dispatch(
      WidgetCreators.linkWidgetRequest({
        widget: values.widget.value,
        unity: unitId,
      })
    );
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      width="35%"
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => setOpen(false)} variant="outlined">
            Cancelar
          </Button>
          <Button onClick={() => form.submit()}>Vincular</Button>
        </div>
      }
      onCancel={() => setOpen(false)}
      title="Vincular widget"
    >
      <p className="mb-6">Selecione o widget que deseja vincular a unidade.</p>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="widget"
          label="Widget"
          rules={[
            {
              required: true,
              message: 'É obrigatório selecionar um widget',
            },
          ]}
        >
          <DebouncedSelect
            allowClear
            loading={loadingSearchWidgets}
            handleLoadMore={handleSearchUnit}
            onClear={handleClearWidgetSelect}
            onPopupScroll={searchedsPagination?.is_last_page === false ? onScrollUnitSelect : () => null}
            data={searcheds.map((widget) => ({
              label: widget.name,
              value: widget.id,
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

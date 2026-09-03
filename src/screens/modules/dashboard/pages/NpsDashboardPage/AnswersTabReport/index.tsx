import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';
import { Divider, Modal, Select, Table, Tooltip } from 'antd';
import { Creators as NpsCreators } from 'src/store/modules/nps/actions';
import { DatePicker } from 'src/ui/DatePicker';
import { RootType } from 'src/store/modules/rootReducer';
import { parseDate } from '..';
import { Button } from 'src/stories/general/Button';
import { Mail, Smartphone } from 'lucide-react';
import { NpsTypeAnswer } from 'src/store/modules/nps/reducer';
import { getWhatsappLink, isValidEmail, isValidPhone } from 'src/utils/helpers';

const { Column } = Table;

type AnswersTabReportProps = {
  unitId: string;
};

export const AnswersTabReport: FunctionComponent<AnswersTabReportProps> = (props) => {
  const { unitId } = props;
  const dispatch = useDispatch();
  const {
    nps: { answerData, paginationAnswer, loadingAnswerReport },
  } = useSelector((state: RootType) => state);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [npsType, setNpsType] = useState<NpsTypeAnswer>('all');
  const [rowSelected, setRowSelected] = useState<Record<string, string> | null>(null);
  const columns = useMemo(() => {
    if (answerData.length > 0) {
      return Object.keys(answerData[0]);
    }

    return [];
  }, [answerData]);

  useEffect(() => {
    handleChangeDate({
      from: subDays(new Date(), 30),
      to: new Date(),
    });
  }, []);

  const handleChangeDate = (range: DateRange) => {
    if (range.from && range.to) {
      setDateRange(range);
      dispatch(
        NpsCreators.getAnswerReportRequest({
          unitId: unitId,
          startAt: parseDate(range.from),
          endAt: parseDate(range.to),
          page: 1,
          npsType: npsType,
        })
      );
    }
  };

  const handleTablePageChange = (props: { page: number; perPage: number }) => {
    if (dateRange.from && dateRange.to) {
      dispatch(
        NpsCreators.getAnswerReportRequest({
          unitId: unitId,
          startAt: parseDate(dateRange.from),
          endAt: parseDate(dateRange.to),
          page: props.page,
          perPage: props.perPage,
          npsType: npsType,
        })
      );
    }
  };

  const handleChangeNpsTypeAnswer = (value: NpsTypeAnswer) => {
    setNpsType(value);
    if (dateRange.from && dateRange.to) {
      dispatch(
        NpsCreators.getAnswerReportRequest({
          unitId: unitId,
          startAt: parseDate(dateRange.from),
          endAt: parseDate(dateRange.to),
          page: 1,
          npsType: value,
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-8 mt-4">
      <DatePicker onRangeChange={handleChangeDate} />
      <Table
        bordered
        className="shadow-sm [&_.ant-table-row]:hover:cursor-pointer"
        title={() => (
          <div className="flex items-center justify-between">
            <span>Respostas</span>
            <Select className="min-w-36" defaultValue="all" onChange={handleChangeNpsTypeAnswer}>
              <Select.Option value="all">Todas as respostas</Select.Option>
              <Select.Option value="promoter">Promotores</Select.Option>
              <Select.Option value="passive">Neutros</Select.Option>
              <Select.Option value="detractor">Detratores</Select.Option>
            </Select>
          </div>
        )}
        dataSource={answerData}
        loading={loadingAnswerReport}
        scroll={{ x: 'max-content' }}
        onRow={(record) => {
          return {
            onClick: () => setRowSelected(record),
          };
        }}
        onChange={(pagination) =>
          handleTablePageChange({
            page: pagination.current ?? 1,
            perPage: pagination.pageSize ?? 15,
          })
        }
        pagination={{
          current: paginationAnswer?.current_page,
          pageSize: paginationAnswer?.per_page,
          total: paginationAnswer?.total,
          showSizeChanger: true,
          pageSizeOptions: ['15', '30', '50'],
          showTotal: (total) => `Total de ${total} respostas`,
        }}
      >
        {columns.map((column) => (
          <Column
            title={column}
            dataIndex={column}
            key={column}
            render={(value) => (
              <div className="overflow-hidden whitespace-nowrap text-ellipsis max-w-[200px]" title={value}>
                {value}
              </div>
            )}
          />
        ))}
      </Table>
      <Modal
        open={rowSelected !== null}
        onCancel={() => setRowSelected(null)}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
      >
        <div className="flex flex-col">
          <div className="grid grid-cols-2">
            {Object.entries(rowSelected ?? {}).map(([key, value]) => (
              <div key={key} className="flex flex-col gap-2 mb-4">
                <span className="font-semibold">{key}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
          <Divider />
          <div className="flex item-center justify-between">
            <Tooltip
              title={
                isValidEmail(rowSelected?.['E-mail'] ?? '') === false
                  ? 'Não é possível contatar pois o email não foi informado.'
                  : ''
              }
            >
              <Button
                icon={<Mail size={14} />}
                variant="outlined"
                disabled={isValidEmail(rowSelected?.['E-mail'] ?? '') === false}
                onClick={() =>
                  isValidEmail(rowSelected?.['E-mail'] ?? '') === true
                    ? window.open(`mailto:${rowSelected?.['E-mail']}`, '_blank')
                    : null
                }
              >
                Contatar via Email
              </Button>
            </Tooltip>
            <Tooltip
              title={
                isValidPhone(rowSelected?.Telefone ?? '') === false
                  ? 'Não é possível contatar pois o telefone não foi informado.'
                  : ''
              }
            >
              <Button
                icon={<Smartphone size={14} />}
                variant="outlined"
                disabled={isValidPhone(rowSelected?.Telefone ?? '') === false}
                onClick={() =>
                  isValidPhone(rowSelected?.Telefone ?? '') === true
                    ? window.open(getWhatsappLink(rowSelected?.Telefone!), '_blank')
                    : null
                }
              >
                Contatar via WhatsApp
              </Button>
            </Tooltip>
          </div>
        </div>
      </Modal>
    </div>
  );
};

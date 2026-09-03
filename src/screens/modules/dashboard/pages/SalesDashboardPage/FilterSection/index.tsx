import { FunctionComponent, useEffect, useState } from 'react';
import { Select, DatePicker } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as DashboardCreators } from 'src/store/modules/dashboard/actions';
import { PaymentType } from 'src/store/modules/dashboard/reducer';
import { Creators as BookingExperiencesCreators } from 'src/store/modules/bookingExperiences/actions';
import { DebouncedSelect } from 'src/stories/entry/DebouncedSelect';
import { getCalculatedDateRange } from 'src/utils/helpers';
import { VisibilitySwitch } from './VisibilitySwitch';
import * as S from './styles';

type VisibilityProps = {
  experience: boolean;
  schedule: boolean;
  noshow: boolean;
};

type FilterSectionProps = {
  unitId: string;
  hasReservationModule: boolean;
};

export const FilterSection: FunctionComponent<FilterSectionProps> = (props) => {
  const { unitId, hasReservationModule } = props;
  const dispatch = useDispatch();
  const {
    hall: { unity: unityData },
    dashboard: { salesFilter },
    bookingExperiences: { data: listExperiences, loading: loadingExperiences, pagination: paginationExperiences },
  } = useSelector((state: RootType) => state);
  const [showRangePicker, setShowRangePicker] = useState(false);

  useEffect(() => {
    const { today, selectedDate } = getCalculatedDateRange(30);

    dispatch(
      DashboardCreators.updateSalesFilter({
        ...salesFilter,
        startDate: dayjs(selectedDate).format('YYYY-MM-DD'),
        endDate: dayjs(today).format('YYYY-MM-DD'),
      })
    );
  }, []);

  useEffect(() => {
    if (unityData !== null && hasReservationModule === true) {
      dispatch(DashboardCreators.getDashboardSalesSummaryRequest());

      dispatch(
        BookingExperiencesCreators.getExperiencesRequest({
          unit_id: unitId,
          page: 1,
        })
      );
    }
  }, [unityData]);

  const handleChangeVisibility = (key: keyof VisibilityProps, visible: boolean) => {
    dispatch(
      DashboardCreators.updateSalesFilter({
        ...salesFilter,
        visibility: {
          ...salesFilter.visibility,
          [key]: visible,
        },
      })
    );

    dispatch(DashboardCreators.getDashboardSalesSummaryRequest());
    dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
  };

  const onChangeDate = ({ value }: { value: string | number }) => {
    if (typeof value === 'number') {
      const { today, selectedDate } = getCalculatedDateRange(value);

      dispatch(
        DashboardCreators.updateSalesFilter({
          ...salesFilter,
          startDate: dayjs(selectedDate).format('YYYY-MM-DD'),
          endDate: dayjs(today).format('YYYY-MM-DD'),
        })
      );

      dispatch(DashboardCreators.getDashboardSalesSummaryRequest());
      dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
      dispatch(DashboardCreators.getDashboardAccountingRequest({ page: 1 }));
    }
  };

  const handleFilterCustomDate = (dates: string) => {
    dispatch(
      DashboardCreators.updateSalesFilter({
        ...salesFilter,
        startDate: dayjs(dates[0]).format('YYYY-MM-DD'),
        endDate: dayjs(dates[1]).format('YYYY-MM-DD'),
      })
    );

    dispatch(DashboardCreators.getDashboardSalesSummaryRequest());
    dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
    dispatch(DashboardCreators.getDashboardAccountingRequest({ page: 1 }));
  };

  const handleUpdateExperienceFilter = (value: any) => {
    dispatch(
      DashboardCreators.updateSalesFilter({
        ...salesFilter,
        experienceId: value.value || null,
      })
    );

    dispatch(DashboardCreators.getDashboardSalesSummaryRequest());
    dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
  };

  const handleUpdatePaymentWayFilter = (value: string) => {
    dispatch(
      DashboardCreators.updateSalesFilter({
        ...salesFilter,
        paymentType: value as PaymentType,
      })
    );

    dispatch(DashboardCreators.getDashboardSalesSummaryRequest());
    dispatch(DashboardCreators.getDashboardSalesDetailsRequest({ page: 1 }));
  };

  const onScrollExperienceSelect = async (event: any) => {
    const target = event.target;

    if (
      !loadingExperiences &&
      paginationExperiences !== null &&
      target.scrollTop + target.offsetHeight === target.scrollHeight
    ) {
      target.scrollTo(0, target.scrollHeight);

      dispatch(
        BookingExperiencesCreators.getExperiencesRequest({
          unit_id: unitId,
          page: paginationExperiences.current_page === 0 ? 1 : paginationExperiences.current_page + 1,
        })
      );
    }
  };

  const handleSearchExperience = (title: string) =>
    dispatch(
      BookingExperiencesCreators.getExperiencesRequest({
        unit_id: unitId,
        title: title,
      })
    );

  return (
    <S.FilterSection>
      <S.VisibilityFilterContent>
        <span className="visibility-label">Visualizar dados referentes à:</span>
        <S.VisibilityControl>
          <VisibilitySwitch
            label="Experiências"
            checked={salesFilter.visibility.experience}
            unauthorized={hasReservationModule === false}
            disabled={salesFilter.visibility.schedule === false && salesFilter.visibility.noshow === false}
            onChange={(value: boolean) => handleChangeVisibility('experience', value)}
          />
          <VisibilitySwitch
            label="Reservas pagas"
            checked={salesFilter.visibility.schedule}
            unauthorized={hasReservationModule === false}
            disabled={salesFilter.visibility.experience === false && salesFilter.visibility.noshow === false}
            onChange={(value: boolean) => handleChangeVisibility('schedule', value)}
          />
          <VisibilitySwitch
            label="No-Shows"
            checked={salesFilter.visibility.noshow}
            unauthorized={hasReservationModule === false}
            disabled={salesFilter.visibility.experience === false && salesFilter.visibility.schedule === false}
            onChange={(value: boolean) => handleChangeVisibility('noshow', value)}
          />
        </S.VisibilityControl>
      </S.VisibilityFilterContent>
      <S.Divider />
      <S.GeneralFilterContent>
        <S.SelectWrapper>
          <label htmlFor="experience-filter">Experiência</label>
          <DebouncedSelect
            allowClear
            disabled={hasReservationModule === false}
            loading={loadingExperiences}
            onChange={handleUpdateExperienceFilter}
            placeholder="Selecione uma experiência"
            handleLoadMore={handleSearchExperience}
            onClear={() => handleUpdateExperienceFilter({ value: '' })}
            onPopupScroll={paginationExperiences?.is_last_page === false ? onScrollExperienceSelect : () => null}
            data={listExperiences.map((experience) => ({
              label: experience.title,
              value: experience.id,
            }))}
          />
        </S.SelectWrapper>
        <S.SelectWrapper>
          <label htmlFor="payment-way-filter">Tipo de pagamento</label>
          <Select
            allowClear
            id="payment-way-filter"
            placeholder="Selecione um tipo de pagamento"
            disabled={hasReservationModule === false}
            onChange={handleUpdatePaymentWayFilter}
            value={salesFilter.paymentType}
          >
            <Select.Option value="credit">Cartão de crédito</Select.Option>
            <Select.Option value="pix">PIX</Select.Option>
          </Select>
        </S.SelectWrapper>
        <S.DatePickerWrapper>
          <label htmlFor="date-range">Período</label>
          <S.FieldsContent>
            <S.Select
              defaultValue={30}
              disabled={hasReservationModule === false}
              onChange={(value: any) => {
                if (value === 'customDate') {
                  return setShowRangePicker(true);
                }

                onChangeDate({ value: value as number });

                return setShowRangePicker(false);
              }}
            >
              <Select.Option value={7}>Últimos 7 dias</Select.Option>
              <Select.Option value={30}>Últimos 30 dias</Select.Option>
              <Select.Option value={60}>Últimos 60 dias</Select.Option>
              <Select.Option value={90}>Últimos 90 dias</Select.Option>
              <Select.Option value={'customDate'}>Personalizar</Select.Option>
            </S.Select>
            {showRangePicker && (
              <DatePicker.RangePicker
                id="date-range"
                format="DD/MM/YYYY"
                onChange={(dates: any) => handleFilterCustomDate(dates)}
              />
            )}
          </S.FieldsContent>
        </S.DatePickerWrapper>
      </S.GeneralFilterContent>
    </S.FilterSection>
  );
};

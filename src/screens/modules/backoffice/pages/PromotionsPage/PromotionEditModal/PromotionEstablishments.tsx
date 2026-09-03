import { Trash } from '@styled-icons/bootstrap/Trash';
import { Download } from '@styled-icons/boxicons-regular/Download';
import { Search } from '@styled-icons/evil/Search';
import { Checkbox, Input, Popover } from 'antd';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import { Creators as UnityCreators } from 'src/store/modules/unity/actions';
import type { UnityItemProps } from 'src/store/modules/unity/reducer';
import { FormItem, InputNumber } from 'src/stories/entry';
import Loading from 'src/stories/feedback/Loading';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import { getStringIgnoringAccents, notification } from 'src/utils/helpers';
import type { StepProps } from '.';
import type { AddedUnitOfForm, CurrentStepProps } from '../PromotionAdditionModal';
import * as S from './styles';

export function PromotionEstablishments({ promotion, handleChangeEditionPromotion, promotionType }: StepProps) {
  const step: CurrentStepProps = '2';

  const dispatch = useDispatch();
  const {
    unity,
    promotions: {
      isLoading,
      promotions: { csvModel, unitsDataFromCsv },
    },
  } = useSelector((state: RootType) => state);
  const csvModelDownload = useRef<HTMLAnchorElement | null>(null);

  const [searchedUnit, setSearchedUnit] = useState<string>('');
  const [allUnits, setAllUnits] = useState<UnityItemProps[]>([]);
  const [unitsPage, setUnitsPage] = useState<number>(1);
  const [shouldResetUnitsData, setShouldResetUnitsData] = useState<boolean>(false);
  const [promotionsBeforeFiltering, setPromotionsBeforeFiltering] = useState<AddedUnitOfForm[]>([]);

  const [searchedUnitFromCsv, setSearchedUnitFromCsv] = useState<string>('');

  const csvInputRef = useRef<HTMLInputElement | null>(null);
  const [csv, setCsv] = useState<File | null>(null);

  const pageIsLoading = unity.loading || isLoading;

  const shouldShowLoadMoreUnitsButton = !unity.loading && !unity.pagination?.is_last_page;

  const shouldShowLoading = unity.loading && !unity.pagination?.is_last_page;

  const nextUnitPage = unitsPage + 1;

  const handleLoadMore = (loadMode: 'filterByQuery' | 'generalFiltering') => {
    if (unity?.pagination?.is_last_page) {
      notification.success('Todas as unidades foram carregadas!', '');
      return;
    }
    if (loadMode === 'filterByQuery') {
      setShouldResetUnitsData(false);
      handleFilterUnits(nextUnitPage);
      return;
    }

    setUnitsPage(nextUnitPage);
    dispatch(UnityCreators.getUnitsRequest({ page: nextUnitPage }));
  };

  const handleAddAddedUnits = (unity: AddedUnitOfForm) =>
    handleChangeEditionPromotion([...promotion.addedUnits, unity]);

  const handleRemoveAddedUnits = (id: string) =>
    handleChangeEditionPromotion(promotion.addedUnits.filter((item) => item.unit_id !== id));

  const handleFilterUnits = (page: number) => {
    setUnitsPage(page);
    dispatch(
      UnityCreators.getUnitsRequest({
        page: page,
        unitName: searchedUnit.trim(),
      })
    );
  };

  const handleFilterAddedUnits = () => {
    setPromotionsBeforeFiltering(promotion.addedUnits);
    handleChangeEditionPromotion(
      promotion.addedUnits.filter((unit) =>
        getStringIgnoringAccents(unit.name).includes(getStringIgnoringAccents(searchedUnitFromCsv))
      )
    );
  };

  const handleChangeUnit = (checked: boolean, unity: UnityItemProps) => {
    if (checked && !promotion.addedUnits.find((currentUnit) => currentUnit.unit_id === unity.id)) {
      handleAddAddedUnits({
        unit_id: unity.id,
        name: unity.name,
        rescue_limit: null,
      });
    }
    if (!checked && !promotion.defaultValues?.units.find((unit) => unity.id === unit.unit_id)) {
      handleRemoveAddedUnits(unity.id);
    }
  };

  useEffect(() => {
    dispatch(UnityCreators.getUnitsRequest({ page: 1 }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (shouldShowLoadMoreUnitsButton) setAllUnits((oldValues) => [...oldValues, ...unity.data]);
  }, [shouldShowLoadMoreUnitsButton, unity.data]);

  useEffect(() => {
    if (shouldResetUnitsData) setAllUnits(unity.data);
  }, [shouldResetUnitsData, unity.data]);

  useEffect(() => {
    if (csv) dispatch(PromotionCreators.importUnitsDataFromCsvRequest(csv));
  }, [csv]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (unitsDataFromCsv) handleChangeEditionPromotion(unitsDataFromCsv);
  }, [unitsDataFromCsv]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (csvModel) csvModelDownload.current?.click();
  }, [csvModel]);

  const helperForImportCSVContent = (
    <>
      <S.HelperForImportCSVContent>
        <Title level={3}>Importar via csv</Title>

        <p>Baixe o modelo para inserir os dados via csv</p>

        <Button
          type="primary"
          htmlType="button"
          size="small"
          icon={<Download size={22} />}
          onClick={() =>
            !csvModel ? dispatch(PromotionCreators.getCsvModelForAddUnitsRequest()) : csvModelDownload.current?.click()
          }
        >
          Baixar modelo
        </Button>

        {csvModel && (
          <a
            ref={csvModelDownload}
            href={window.URL.createObjectURL(csvModel)}
            target="_blank"
            rel="noreferrer"
            download="modelo-estabelecimentos-a-adicionar.csv"
            hidden
          />
        )}
      </S.HelperForImportCSVContent>
    </>
  );

  return (
    <S.ContentWrapper promotionType={promotionType} step={step}>
      <S.LeftContent>
        <S.TitleWrapper>
          <Title level={4}>Selecione estabelecimentos</Title>

          <S.Description>Selecione os estabelecimentos que deseja adicionar a promoção.</S.Description>
        </S.TitleWrapper>

        <S.SearchBox>
          <S.SearchBoxDescription>
            {promotion.addedUnits.length} de {allUnits.length}
          </S.SearchBoxDescription>

          <S.SearchBoxInputWrapper>
            <FormItem label="Busca" minHeight="4rem">
              <Input
                value={searchedUnit}
                onChange={({ target: { value } }) => {
                  setSearchedUnit(value);
                  if (!value) {
                    setShouldResetUnitsData(false);
                    setAllUnits([]);
                    setUnitsPage(1);
                    dispatch(UnityCreators.getUnitsRequest({ page: 1 }));
                  }
                }}
                placeholder="Digite o nome do restaurante"
              />
            </FormItem>

            <Button
              type="primary"
              htmlType="button"
              size="small"
              icon={<Search size={22} />}
              onClick={() => {
                setShouldResetUnitsData(true);
                handleFilterUnits(1);
              }}
              disabled={pageIsLoading || !searchedUnit}
            >
              Buscar
            </Button>
          </S.SearchBoxInputWrapper>

          <S.SearchBoxResultWrapper>
            {allUnits.map((unity) => (
              <S.SearchBoxResult key={unity.name}>
                <div className="left-content">
                  <Checkbox
                    checked={!!promotion.addedUnits.find((item) => item.unit_id === unity.id)}
                    onChange={({ target: { checked } }) => handleChangeUnit(checked, unity)}
                  />
                  {unity.name}
                </div>
              </S.SearchBoxResult>
            ))}

            {shouldShowLoadMoreUnitsButton && (
              <Button
                type="primary"
                htmlType="button"
                size="small"
                icon={<Search size={22} />}
                onClick={() => handleLoadMore(searchedUnit ? 'filterByQuery' : 'generalFiltering')}
              >
                Carregar mais
              </Button>
            )}

            {shouldShowLoading && (
              <S.LoadingWrapper>
                <Loading /> Carregando
              </S.LoadingWrapper>
            )}
          </S.SearchBoxResultWrapper>
        </S.SearchBox>
      </S.LeftContent>

      <S.RightContent step={step}>
        <S.TitleWrapper>
          <Title level={4}>Estabelecimentos adicionados</Title>

          <S.Description>Confira os estabelecimentos e preencha a bonificação para cada restaurante.</S.Description>
        </S.TitleWrapper>

        <S.SearchBox>
          <S.SearchBoxDescriptionWrapper>
            <S.SearchBoxDescription>
              {promotion.addedUnits.length} de {allUnits.length}
            </S.SearchBoxDescription>

            <S.SearchBoxDescriptionButtons>
              <Popover content={helperForImportCSVContent}>
                <Button variant="outlined" htmlType="button" onClick={() => csvInputRef?.current?.click()}>
                  {csv?.name ?? 'importar via csv'}
                </Button>
              </Popover>

              <input
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                hidden
                ref={csvInputRef}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e?.target?.files) {
                    const targetFile = e?.target?.files[0];
                    if (targetFile) setCsv(targetFile);
                  }
                }}
              />

              <Button
                type="primary"
                htmlType="button"
                size="small"
                onClick={() => setCsv(null)}
                disabled={pageIsLoading || !csv}
              >
                <Trash size={22} />
                remover
              </Button>
            </S.SearchBoxDescriptionButtons>
          </S.SearchBoxDescriptionWrapper>

          <S.SearchBoxInputWrapper>
            <FormItem title="Busca" minHeight="4rem">
              <label>Busca:</label>

              <Input
                value={searchedUnitFromCsv}
                onChange={({ target: { value } }) => {
                  setSearchedUnitFromCsv(value);
                  if (!value) {
                    handleChangeEditionPromotion(promotionsBeforeFiltering);
                    setPromotionsBeforeFiltering([]);
                  }
                }}
                placeholder="Digite o nome do restaurante"
              />
            </FormItem>

            <Button
              type="primary"
              htmlType="button"
              size="small"
              icon={<Search size={22} />}
              onClick={handleFilterAddedUnits}
              disabled={pageIsLoading || !searchedUnitFromCsv || !promotion.addedUnits}
            >
              Buscar
            </Button>
          </S.SearchBoxInputWrapper>

          <S.SearchBoxResultWrapper>
            {promotion.addedUnits.map((unity) => (
              <S.SearchBoxResult
                key={unity.name}
                disabled={!!promotion.defaultValues?.units.find((unit) => unity.unit_id === unit.unit_id)}
              >
                <div className="left-content">
                  <Checkbox onChange={({ target: { checked } }) => checked && handleRemoveAddedUnits(unity.unit_id)} />
                  {unity.name}
                </div>

                <S.QuantityUnityBox>
                  <InputNumber
                    className="quantity-unity"
                    type="number"
                    min={0}
                    placeholder="00"
                    value={unity.rescue_limit ?? undefined}
                    onChange={(value) =>
                      handleChangeEditionPromotion(
                        promotion.addedUnits.map((oldUnit) => {
                          if (oldUnit.unit_id === unity.unit_id) {
                            return Object.assign(oldUnit, value && { rescue_limit: value });
                          }
                          return oldUnit;
                        })
                      )
                    }
                  />
                  un
                </S.QuantityUnityBox>
              </S.SearchBoxResult>
            ))}
          </S.SearchBoxResultWrapper>
        </S.SearchBox>
      </S.RightContent>
    </S.ContentWrapper>
  );
}

import { Search } from '@styled-icons/evil/Search';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { UnitOfPromotion } from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { FormItem, InputNumber } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Paragraph, Title } from 'src/stories/typography';
import { getStringIgnoringAccents } from 'src/utils/helpers';
import type { CurrentStepProps, StepProps } from '.';
import * as S from './styles';

export function Step2({ promotion }: StepProps) {
  const step: CurrentStepProps = '2';

  const {
    promotions: { isLoading },
  } = useSelector((state: RootType) => state);

  const [searchedUnit, setSearchedUnit] = useState<string>('');
  const [allUnits, setAllUnits] = useState<UnitOfPromotion[]>([]);

  useEffect(() => {
    if (promotion.units) setAllUnits(promotion.units);
  }, [promotion.units]);

  const handleFilterUnits = () =>
    setAllUnits((oldValues) =>
      oldValues.filter((unit) =>
        getStringIgnoringAccents(unit.name).includes(
          getStringIgnoringAccents(searchedUnit)
        )
      )
    );

  return (
    <S.ContentWrapper step={step}>
      <S.RightContent step={step}>
        <S.TitleWrapper>
          <Title level={4}>Estabelecimentos adicionados</Title>

          <S.Description>Confira os estabelecimentos.</S.Description>
        </S.TitleWrapper>

        <S.SearchBox>
          <S.SearchBoxDescriptionWrapper>
            <S.SearchBoxDescription>
              {allUnits.length} estabelecimentos
            </S.SearchBoxDescription>
          </S.SearchBoxDescriptionWrapper>

          <S.SearchBoxInputWrapper>
            <FormItem title="Busca" minHeight="4rem">
              <label>Busca:</label>

              <Input
                placeholder="Digite o nome do restaurante"
                value={searchedUnit}
                onChange={({ target: { value } }) => {
                  setSearchedUnit(value);
                  if (!value) setAllUnits(promotion.units);
                }}
              />
            </FormItem>

            <Button
              htmlType="button"
              icon={<Search size={16} />}
              onClick={handleFilterUnits}
              disabled={isLoading || !searchedUnit}
            >
              Buscar
            </Button>
          </S.SearchBoxInputWrapper>

          <S.SearchBoxResultWrapper>
            {allUnits.length ? (
              allUnits.map((unit) => (
                <S.SearchBoxResult key={unit.unit_id}>
                  <div className="left-content">{unit.name}</div>

                  <S.QuantityUnityBox>
                    <InputNumber
                      type="number"
                      className="quantity-unity"
                      value={unit.rescue_limit}
                      readOnly
                    />
                    un
                  </S.QuantityUnityBox>
                </S.SearchBoxResult>
              ))
            ) : (
              <Paragraph>Não há estabelecimentos no momento</Paragraph>
            )}
          </S.SearchBoxResultWrapper>
        </S.SearchBox>
      </S.RightContent>
    </S.ContentWrapper>
  );
}

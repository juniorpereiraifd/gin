import dayjs from 'dayjs';
import { Search } from '@styled-icons/evil/Search';
import { Email } from '@styled-icons/material-outlined/Email';
import { PriceTag3 } from '@styled-icons/remix-line/PriceTag3';
import { Smartphone } from '@styled-icons/remix-line/Smartphone';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type {
  CustomerData,
  ProductOfCustomer,
} from 'src/store/modules/promotions/reducer';
import type { RootType } from 'src/store/modules/rootReducer';
import { FormItem } from 'src/stories/entry';
import { Button } from 'src/stories/general/Button';
import { Title } from 'src/stories/typography';
import {
  getPhoneNumberFormatted,
  getStringIgnoringAccents,
} from 'src/utils/helpers';
import { HistoryCard } from './HistoryCard';
import { PromotionCard } from './PromotionCard';
import { MOCK_PEOPLE_BY_UNIT, MOCK_PEOPLE_FALLBACK } from 'src/configs/devMockPeople';
import * as S from './styles';

interface CustomerDetailsModalProps {
  showModal: boolean;
  onCloseModal: () => void;
  customer: CustomerData | null;
}

export function CustomerDetailsModal({
  showModal,
  onCloseModal,
  customer,
}: CustomerDetailsModalProps) {
  const dispatch = useDispatch();
  const {
    promotions: {
      isLoading,
      customers: { currentPromotions, historyPromotions },
    },
    hall: { loading, unity },
  } = useSelector((state: RootType) => state);

  const [searchedPromotion, setSearchedPromotion] = useState<string>('');
  const [promotionsData, setPromotionsData] = useState<ProductOfCustomer[]>([]);
  const [historyPromotionsData, setHistoryPromotionsData] = useState<
    ProductOfCustomer[]
  >([]);

  const modalIsLoading = loading || isLoading;

  const peopleReservations =
    import.meta.env.DEV && customer
      ? MOCK_PEOPLE_BY_UNIT[customer.unit_id] ?? MOCK_PEOPLE_FALLBACK
      : [];

  const hasValidTelephone = unity?.telephone
    ? unity.telephone.length >= 12 && unity.telephone.length <= 13
    : false;

  const handleFilterSearchedPromotion = () =>
    setPromotionsData((oldValues) =>
      oldValues.filter((promotion) =>
        getStringIgnoringAccents(promotion.title).includes(
          getStringIgnoringAccents(searchedPromotion)
        )
      )
    );

  const getPromotionDetailsData = (id: string) => {
    dispatch(
      PromotionCreators.getPromotionDetailsRequest({
        id,
        type: 'current',
        pagination: 0,
      })
    );
    dispatch(
      PromotionCreators.getPromotionDetailsRequest({
        id,
        type: 'historic',
        pagination: 0,
      })
    );
  };

  useEffect(() => {
    if (currentPromotions.data) setPromotionsData(currentPromotions.data);
  }, [currentPromotions.data]);

  useEffect(() => {
    if (historyPromotions.data)
      setHistoryPromotionsData(historyPromotions.data);
  }, [historyPromotions.data]);

  return (
    <S.CustomerDetailsModal
      open={showModal}
      onCancel={onCloseModal}
      footer={null}
    >
      <S.Header>
        <S.Img
          src={unity?.profile_image}
          alt={customer?.name}
          title={customer?.name}
        />

        <S.Details>
          <Title level={4}>{customer?.name}</Title>

          <S.InfoDetails>
            <p>
              <Email size={16} title="Email" />
              {unity?.financial_email
                ? unity?.financial_email
                : 'Email não encontrado'}
            </p>

            <p>
              <Smartphone size={16} title="Telefone" />
              {hasValidTelephone
                ? getPhoneNumberFormatted(
                    unity?.telephone as string,
                    'withoutCountry'
                  )
                : 'Telefone inválido ou inexistente'}
            </p>
          </S.InfoDetails>
        </S.Details>
      </S.Header>

      {import.meta.env.DEV && (
        <S.People title="Clientes que reservaram">
          <S.TitleWrapper>
            <PriceTag3 size={18} />
            <Title level={4}>Clientes que reservaram</Title>
          </S.TitleWrapper>

          <S.PeopleList>
            {peopleReservations.map((person) => (
              <S.PeopleCard key={person.id}>
                <S.PeopleMain>
                  <Title level={5}>{person.name}</Title>
                  <S.PeopleGuests>
                    {person.guests} {person.guests === 1 ? 'pessoa' : 'pessoas'}
                  </S.PeopleGuests>
                </S.PeopleMain>

                <S.PeopleMeta>
                  <span className="promotion">{person.promotion}</span>
                  <span className="date">
                    {dayjs(person.date).format('DD/MM/YYYY')}
                  </span>
                  <span className={`status ${person.status}`}>{person.status}</span>
                </S.PeopleMeta>
              </S.PeopleCard>
            ))}
          </S.PeopleList>
        </S.People>
      )}

      <S.Promotions title="Promoções">
        <S.TitleWrapper>
          <PriceTag3 size={18} />
          <Title level={4}>Promoções</Title>
        </S.TitleWrapper>

        <S.InputWrapper>
          <FormItem label="Busca" minHeight="4rem">
            <Input
              value={searchedPromotion}
              onChange={({ target: { value } }) => {
                setSearchedPromotion(value.trim());
                if (!value) {
                  getPromotionDetailsData(customer?.unit_id as string);
                }
              }}
              placeholder="Digite o nome da promoção"
            />
          </FormItem>

          <Button
            htmlType="button"
            icon={<Search size={22} />}
            onClick={handleFilterSearchedPromotion}
            disabled={modalIsLoading || !searchedPromotion}
          >
            Buscar
          </Button>
        </S.InputWrapper>

        <S.PromotionList>
          {promotionsData.map((promotion) => (
            <PromotionCard promotion={promotion} key={promotion.id} />
          ))}
        </S.PromotionList>
      </S.Promotions>

      <S.History title="Histórico">
        <Title level={6}>Histórico</Title>

        {historyPromotionsData.length ? (
          historyPromotionsData.map((promotion) => (
            <HistoryCard promotion={promotion} key={promotion.id} />
          ))
        ) : (
          <HistoryCard withoutData />
        )}
      </S.History>
    </S.CustomerDetailsModal>
  );
}

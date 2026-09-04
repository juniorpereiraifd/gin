import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { Search } from '@styled-icons/evil/Search';
import { Add } from '@styled-icons/ionicons-outline/Add';
import { RootType } from 'src/store/modules/rootReducer';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Title } from 'src/stories/typography';
import { Button } from 'src/stories/general/Button';
import { Input } from 'src/stories/entry';
import { PageContainer } from 'src/components/PageContainer';
import { BoxContrasted } from 'src/components/BoxContrasted';
import { createReservationId } from 'src/configs/devMockReservations';
import type {
  ReservationData,
  ReservationStatus,
} from 'src/configs/devMockReservations';
import { ReservationCard } from './components/ReservationCard';
import { AddReservationModal } from './components/AddReservationModal';
import * as S from './styles';

type BoardTab = 'received' | 'seated' | 'canceled';

type ReservationInput = Omit<ReservationData, 'id' | 'createdAt' | 'status'>;

const TAB_LABELS: Record<BoardTab, string> = {
  received: 'Recebidas',
  seated: 'Sentadas',
  canceled: 'Canceladas',
};

export function ReservationBoardPage() {
  const { unitId } = useParams<'unit'>();
  const {
    hall: { unity },
  } = useSelector((state: RootType) => state);

  const [reservations, setReservations] = useState<ReservationData[]>([]);
  const [tab, setTab] = useState<BoardTab>('received');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ReservationData | null>(null);

  const viewingDate = dayjs().format('DD [de] MMMM [de] YYYY');
  const bookingDay = dayjs().format('DD/MM/YYYY');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return reservations.filter(
      (r) =>
        r.status === tab && (!q || r.name.toLowerCase().includes(q))
    );
  }, [reservations, tab, search]);

  const totalGuests = filtered.reduce((acc, r) => acc + r.guests, 0);
  const counts: Record<BoardTab, number> = {
    received: reservations.filter((r) => r.status === 'received').length,
    seated: reservations.filter((r) => r.status === 'seated').length,
    canceled: reservations.filter((r) => r.status === 'canceled').length,
  };

  // Garante o reset do estado local quando troca de unidade.
  useEffect(() => {
    setReservations([]);
    setTab('received');
    setSearch('');
  }, [unitId]);

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (reservation: ReservationData) => {
    setEditing(reservation);
    setModalOpen(true);
  };

  const handleSubmit = (input: ReservationInput) => {
    if (editing) {
      setReservations((old) =>
        old.map((r) => (r.id === editing.id ? { ...editing, ...input } : r))
      );
    } else {
      const created: ReservationData = {
        ...input,
        id: createReservationId(),
        createdAt: new Date().toISOString(),
        status: 'received',
      };
      setReservations((old) => [...old, created]);
      setTab('received');
    }
    setEditing(null);
  };

  const handleSeat = (id: string) => {
    setReservations((old) =>
      old.map((r) => (r.id === id ? { ...r, status: 'seated' as ReservationStatus } : r))
    );
  };

  const handleCancel = (id: string) => {
    setReservations((old) =>
      old.map((r) => (r.id === id ? { ...r, status: 'canceled' as ReservationStatus } : r))
    );
  };

  return (
    <PageContainer>
      <S.PageHeading>
        <PageTitle>Reservas</PageTitle>

        <S.RestaurantHeader>
          {unity?.profile_image && (
            <S.RestaurantLogo src={unity.profile_image} alt={unity.name} />
          )}
          <S.RestaurantInfo>
            <Title level={4}>{unity?.name ?? 'Restaurante'}</Title>
            <S.RestaurantAddress>{unity?.full_address ?? unity?.location}</S.RestaurantAddress>
          </S.RestaurantInfo>
        </S.RestaurantHeader>
      </S.PageHeading>

      <BoxContrasted>
        <S.BoardHeader>
          <S.NavTabs>
            <S.NavItem active>Reserva</S.NavItem>
            <S.NavItem disabled>Fila de espera</S.NavItem>
            <S.NavItem disabled>Passantes</S.NavItem>
          </S.NavTabs>

          <Button icon={<Add size={18} />} onClick={handleOpenCreate}>
            Adicionar
          </Button>
        </S.BoardHeader>

        <S.Toolbar>
          <S.SearchBox>
            <Search size={18} />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar reservas"
              bordered={false}
            />
          </S.SearchBox>

          <S.Tabs>
            {(Object.keys(TAB_LABELS) as BoardTab[]).map((key) => (
              <S.TabButton key={key} active={tab === key} onClick={() => setTab(key)}>
                {TAB_LABELS[key]} · {counts[key]}
              </S.TabButton>
            ))}
          </S.Tabs>
        </S.Toolbar>

        <S.SummaryLine>
          <span>
            {filtered.length} {filtered.length === 1 ? 'reserva' : 'reservas'} (
            {totalGuests} {totalGuests === 1 ? 'pessoa' : 'pessoas'})
          </span>
          <span className="visualizing">
            Visualizando: <b>{bookingDay}</b>
          </span>
        </S.SummaryLine>

        {filtered.length > 0 ? (
          <S.List>
            {filtered.map((r) => (
              <ReservationCard
                key={r.id}
                reservation={r}
                onSeat={handleSeat}
                onCancel={handleCancel}
                onEdit={handleEdit}
              />
            ))}
          </S.List>
        ) : (
          <S.EmptyState>
            <strong>Nenhuma reserva {TAB_LABELS[tab].toLowerCase()} este dia!</strong>
            <span>{viewingDate}</span>
          </S.EmptyState>
        )}
      </BoxContrasted>

      <AddReservationModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </PageContainer>
  );
}

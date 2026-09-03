import { Add } from '@styled-icons/ionicons-outline/Add';
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Creators as HallCreators } from 'src/store/modules/hall/actions';
import { RootType } from 'src/store/modules/rootReducer';
import { Creators as ShiftCreators } from 'src/store/modules/shift/actions';
import Loading from 'src/stories/feedback/Loading';
import { Button } from 'src/stories/general/Button';
import HallCard from 'src/stories/general/HallCard';
import * as S from './styles';
import { PageTitle } from 'src/stories/typography/PageTitle';
import { Switch } from 'src/stories/entry/Switch';
import { PageContainer } from 'src/components/PageContainer';
import { ShiftSection } from './ShiftSection';
import { CreateHallModal } from './CreateHallModal';

export const HallsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    hall: { loading, loadingHall, data, unity, pagination },
  } = useSelector((state: RootType) => state);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [showInactiveHalls, setShowInactiveHalls] = useState(false);

  useEffect(() => {
    if (unity) {
      dispatch(
        HallCreators.getHallsRequest({
          page: 1,
          reset: true,
          active: showInactiveHalls,
        })
      );
      dispatch(ShiftCreators.getShiftsRequest());
    }
  }, [dispatch, showInactiveHalls, unity]);

  useEffect(() => {
    if (!loading && unity && !loadingHall) {
      setFirstLoad(false);
      if (pagination?.is_last_page) {
        setHasMore(false);
      }
    }
  }, [loading, loadingHall, pagination?.is_last_page, unity]);

  const handleLoadMore = () => {
    if (pagination?.is_last_page) {
      setHasMore(false);
      return;
    }

    dispatch(
      HallCreators.getHallsRequest({
        page: pagination?.current_page + 1,
        active: showInactiveHalls,
      })
    );
  };

  return (
    <PageContainer sideColumn>
      <div>
        <S.TitleWrapper>
          <PageTitle>Salões</PageTitle>
          <Button icon={<Add size={20} />} onClick={() => setIsModalVisible(true)}>
            Adicionar Salão
          </Button>
        </S.TitleWrapper>
        <S.FilterHalls>
          <Switch
            defaultChecked={showInactiveHalls}
            label="Exibir salões inativos"
            onChange={(e) => {
              setShowInactiveHalls(e);
              setHasMore(true);
            }}
          />
        </S.FilterHalls>
      </div>
      <S.HallsSection>
        <CreateHallModal open={isModalVisible} setOpen={setIsModalVisible} />
        {loadingHall && firstLoad ? (
          <div
            className="loader"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <Loading /> Carregando
          </div>
        ) : (
          <S.ContainerListHall id="scrollableDiv">
            <InfiniteScroll
              dataLength={data.length}
              next={handleLoadMore}
              hasMore={!loadingHall && hasMore}
              scrollableTarget="scrollableDiv"
              loader={
                <div
                  className="loader"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <Loading /> Carregando
                </div>
              }
            >
              {data.length > 0 ? (
                <S.HallsList>
                  {data.map((hall) => (
                    <HallCard
                      key={hall.id}
                      name={hall.name}
                      schedule={hall.schedules}
                      onClick={() => navigate(`/units/${unity?.id}/reservation/halls/${hall.id}/edit`)}
                      showStatus={true}
                      statusValue={hall.active}
                      hallId={hall.id}
                    />
                  ))}
                </S.HallsList>
              ) : (
                <S.ListEmptyText>
                  <span>Nenhum salão encontrado</span>
                </S.ListEmptyText>
              )}
            </InfiniteScroll>
          </S.ContainerListHall>
        )}
      </S.HallsSection>
      <ShiftSection />
    </PageContainer>
  );
};

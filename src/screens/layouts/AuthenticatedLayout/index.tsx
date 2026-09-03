import { ReactNode, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { PromotionCreators } from 'src/store/modules/promotions/actions';
import type { RootType } from 'src/store/modules/rootReducer';
import Header from 'src/screens/components/Header';
import { OptInEnterPromotion } from 'src/screens/components/OptInEnterPromotion';
import { useOctadesk } from 'src/hooks/useOctadesk';
import * as S from './styles';
import { generateHashID } from 'src/utils/helpers';

interface LayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isValidRoute = location.pathname !== '/units';

  const {
    auth: { user },
    hall: { unity },
    promotions: { optInEnterPromotionModal },
  } = useSelector((state: RootType) => state);

  const populateUserGuiding = useCallback(async () => {
    if (user?.id !== undefined && user.created_at !== undefined) {
      const hashId = await generateHashID([
        typeof user.id === 'number' ? user.id.toString() : user.id,
        user.created_at,
      ]);

      window.userGuiding.identify(hashId, {
        created_at: user?.created_at,
        ...(unity !== null && {
          id_company: String(unity.id),
          company: {
            id: String(unity.id),
          },
        }),
      });
    }
  }, [user, unity]);

  useEffect(() => {
    populateUserGuiding();
  }, [user, unity]);

  useOctadesk();

  useEffect(() => {
    if (optInEnterPromotionModal && !isValidRoute) {
      dispatch(PromotionCreators.handleToggleOptinEnterPromotion());
      dispatch(PromotionCreators.resetParticipatingPromotions());
    }

    if (unity?.id && isValidRoute) {
      dispatch(
        PromotionCreators.checkParticipatingPromotionsRequest({
          unitId: unity.id,
          participating: 'pending',
        })
      );
    }
  }, [unity?.id, location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <S.Wrapper>
      <Header />
      <S.Content>{children}</S.Content>
      <OptInEnterPromotion />
    </S.Wrapper>
  );
};

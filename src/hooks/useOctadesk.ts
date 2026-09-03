import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootType } from 'src/store/modules/rootReducer';
import { buildOctadeskIdentity } from 'src/store/modules/auth/selectors';
import { identifyOctadeskUser, loadOctadeskChat } from 'src/services/octadesk';

const UNIT_PATH_PATTERN = /\/units\/([A-Za-z0-9]+)/;
const NON_UNIT_PATH_SEGMENTS = ['create'];

const getUnitIdFromPath = (pathname: string) => {
  const unitId = pathname.match(UNIT_PATH_PATTERN)?.[1] ?? '';

  return NON_UNIT_PATH_SEGMENTS.includes(unitId) ? '' : unitId;
};

export const useOctadesk = () => {
  const { pathname } = useLocation();
  const user = useSelector((state: RootType) => state.auth.user);
  const unity = useSelector((state: RootType) => state.hall.unity);
  const knownUnitNames = useRef<Record<string, string>>({});

  const unitIdFromPath = getUnitIdFromPath(pathname);
  const selectedUnitId = String(unity?.id ?? '');
  const unitId = unitIdFromPath !== '' ? unitIdFromPath : selectedUnitId;
  const loadedUnitName = selectedUnitId === unitId ? (unity?.name ?? '') : '';

  if (unitId !== '' && loadedUnitName !== '') {
    knownUnitNames.current[unitId] = loadedUnitName;
  }

  const unitName = loadedUnitName !== '' ? loadedUnitName : (knownUnitNames.current[unitId] ?? '');

  const identity = useMemo(() => buildOctadeskIdentity(user, { id: unitId, name: unitName }), [user, unitId, unitName]);

  useEffect(() => {
    if (identity.thirdPartyId === '') {
      return;
    }

    loadOctadeskChat(import.meta.env.VITE_OCTADESK_SUBDOMAIN ?? '', identity)
      .then(() => identifyOctadeskUser(identity))
      .catch(() => undefined);
  }, [identity]);
};

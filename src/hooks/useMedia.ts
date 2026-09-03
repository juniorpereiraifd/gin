import { useWindowSize as baseUseWindowSize } from 'react-use';
import { MEDIA_QUERY_VALUES, type BreakpointKey } from 'src/utils/constants';

export const useMedia = (initialBreakpoint: BreakpointKey, limitBreakpoint?: BreakpointKey) => {
  const { width } = baseUseWindowSize();

  if (!width) {
    return false;
  }

  const initialValue = MEDIA_QUERY_VALUES[initialBreakpoint];
  const limitValue = limitBreakpoint ? MEDIA_QUERY_VALUES[limitBreakpoint] : Infinity;

  return width >= initialValue && width < limitValue;
};

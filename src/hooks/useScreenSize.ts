import { useEffect, useState } from 'react';
import { ScreenClass, useScreenClass } from 'react-grid-system';

export function useScreenSize() {
  const [screen, setScreen] = useState<ScreenClass | null>(null);
  const size = useScreenClass();
  let isMobile = false;
  let isTablet = false;

  useEffect(() => {
    if (typeof window !== 'undefined') setScreen(size);
  }, [size]);

  if (screen) {
    isTablet = (['md'] as ScreenClass[]).includes(screen);
    isMobile = (['sm', 'xs'] as ScreenClass[]).includes(screen);
  }

  return { isTablet, isMobile };
}

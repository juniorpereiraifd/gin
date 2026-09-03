import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const HIGHLIGHT_DURATION_IN_MS = 2500;

export const useSectionHighlight = (sectionId: string, ready = true) => {
  const { hash } = useLocation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  useEffect(() => {
    if (hash !== `#${sectionId}` || sectionRef.current === null) {
      return;
    }

    sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setIsHighlighted(true);

    const highlightTimeout = setTimeout(() => setIsHighlighted(false), HIGHLIGHT_DURATION_IN_MS);

    return () => clearTimeout(highlightTimeout);
  }, [hash, sectionId, ready]);

  return { sectionRef, isHighlighted };
};

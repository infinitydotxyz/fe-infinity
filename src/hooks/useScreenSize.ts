import { useEffect, useState } from 'react';
const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;
const getIsTablet = () => typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024;
const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth > 1024;

export default function useScreenSize() {
  const [innerWidth, setInnerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [isTablet, setIsTablet] = useState(getIsTablet());
  const [isDesktop, setIsDesktop] = useState(getIsDesktop());

  useEffect(() => {
    const onResize = (ev: Event) => {
      setInnerWidth((ev.target as Window)?.innerWidth);
      setIsMobile(getIsMobile());
      setIsTablet(getIsTablet());
      setIsDesktop(getIsDesktop());
    };

    setInnerWidth(window.innerWidth);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { isMobile, isTablet, isDesktop, innerWidth };
}

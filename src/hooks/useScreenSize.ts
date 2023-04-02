import { useEffect, useState } from 'react';

const getIsMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768;
const getIsTablet = () => typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024;
const getIsDesktop = () => typeof window !== 'undefined' && window.innerWidth > 1024;

const getBreakpoint = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' => {
  if (typeof window === 'undefined' || !window) {
    return 'lg';
  } else if (window.innerWidth <= 640) {
    return 'xs';
  } else if (window.innerWidth <= 768) {
    return 'sm';
  } else if (window.innerWidth <= 1024) {
    return 'md';
  } else if (window.innerWidth <= 1280) {
    return 'lg';
  } else if (window.innerWidth <= 1536) {
    return 'xl';
  }
  return '2xl';
};

export default function useScreenSize() {
  const [innerWidth, setInnerWidth] = useState(0);
  const [isMobile, setIsMobile] = useState(getIsMobile());
  const [isTablet, setIsTablet] = useState(getIsTablet());
  const [isDesktop, setIsDesktop] = useState(getIsDesktop());

  const [screenSize, setScreenSize] = useState(getBreakpoint());

  useEffect(() => {
    const onResize = (ev: Event) => {
      setInnerWidth((ev.target as Window)?.innerWidth);
      setIsMobile(getIsMobile());
      setIsTablet(getIsTablet());
      setIsDesktop(getIsDesktop());
      setScreenSize(getBreakpoint());
    };

    setInnerWidth(window.innerWidth);
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { isMobile, isTablet, isDesktop, innerWidth, screenSize };
}

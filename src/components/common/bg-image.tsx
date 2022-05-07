import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  url?: string;
  center?: boolean; // false for bg-top
  className?: string;
}

export const BGImage = ({ url, center = true, className = '' }: Props) => {
  const [loaded, setLoaded] = useState(false);

  if (!url) {
    return <></>;
  }

  useEffect(() => {
    const img = new Image();
    let deleted = false;

    img.onload = () => {
      if (!deleted) {
        setLoaded(true);
      }
    };
    img.src = url;

    return () => {
      deleted = true;

      // trying to cancel load? not sure if this works
      img.src = '';
      img.onload = null;
    };
  }, []);

  return (
    <div
      className={twMerge(
        center ? 'bg-center' : 'bg-top',
        loaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-500 w-full h-full bg-cover bg-no-repeat',
        className
      )}
      style={{ backgroundImage: `url(${url})` }}
    />
  );
};

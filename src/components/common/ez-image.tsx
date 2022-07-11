import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { PLACEHOLDER_IMAGE } from 'src/utils';

interface Props {
  src?: string;
  center?: boolean; // false for bg-top
  cover?: boolean;
  className?: string;
}

export const EZImage = ({ src, center = true, cover = true, className = 'w-full h-full' }: Props) => {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    src = PLACEHOLDER_IMAGE;
  }

  src = src?.replace('storage.opensea.io', 'openseauserdata.com');

  useEffect(() => {
    const img = new Image();
    let deleted = false;

    if (src) {
      img.onload = () => {
        if (!deleted) {
          setLoaded(true);
        }
      };
      img.src = src;
    }

    return () => {
      deleted = true;
      // trying to cancel load? not sure if this works
      img.src = '';
      img.onload = null;
    };
  }, [src]);

  if (!src) {
    return <></>;
  }

  return (
    <div className={className}>
      <div
        className={twMerge(
          cover ? 'bg-cover' : 'bg-cntain',
          center ? 'bg-center' : 'bg-top',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500 w-full h-full bg-no-repeat'
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
};

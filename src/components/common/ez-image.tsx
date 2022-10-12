import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { MISSING_IMAGE_URL, replaceIPFSWithGateway } from 'src/utils';

interface Props {
  src?: string;
  center?: boolean; // false for bg-top
  cover?: boolean;
  className?: string;
  fade?: boolean;
  onClick?: () => void;
  missingImage?: string;
}

export const EZImage = ({
  src: _src,
  center = true,
  cover = true,
  fade = true,
  onClick,
  className = '',
  missingImage = MISSING_IMAGE_URL
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  let src = replaceIPFSWithGateway(_src ?? '');

  // avoid the console errors

  if (!src) {
    src = missingImage;
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

      img.onerror = () => {
        if (!deleted) {
          setError(true);
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

  let imgUrl = src;
  if (error) {
    imgUrl = missingImage;
  }

  return (
    <div
      className={twMerge('w-full h-full shrink-0', className)}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          e.stopPropagation();

          onClick();
        }
      }}
    >
      <div
        className={twMerge(
          cover ? 'bg-cover' : 'bg-contain',
          center ? 'bg-center' : 'bg-top',
          loaded ? 'opacity-100' : 'opacity-0',
          fade ? 'transition-opacity duration-500' : '',
          ' w-full h-full bg-no-repeat'
        )}
        style={{ backgroundImage: `url(${imgUrl})` }}
      />
    </div>
  );
};

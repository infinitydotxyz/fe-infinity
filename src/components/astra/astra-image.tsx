import { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { MISSING_IMAGE_URL, replaceIPFSWithGateway } from 'src/utils';
import { twMerge } from 'tailwind-merge';

interface Props {
  src?: string;
  center?: boolean; // false for bg-top
  cover?: boolean;
  className?: string;
  fade?: boolean;
  onClick?: () => void;
  missingImage?: string;
}

export const AImage = forwardRef(function AImage(
  {
    src: _src,
    center = true,
    cover = true,
    fade = true,
    onClick,
    className = '',
    missingImage = MISSING_IMAGE_URL
  }: Props,
  ref: ForwardedRef<HTMLImageElement>
) {
  const [loaded, setLoaded] = useState(false);

  let src = replaceIPFSWithGateway(_src ?? '');

  if (!src) {
    src = missingImage;
  }

  src = src?.replace('storage.opensea.io', 'openseauserdata.com');

  useEffect(() => {
    const signal = { aborted: false };
    if (ref && 'current' in ref && ref.current) {
      if (src) {
        ref.current.onload = () => {
          if (!signal.aborted) {
            setLoaded(true);
          }
        };

        ref.current.onerror = () => {
          if (!signal.aborted) {
            setLoaded(true);
            if (ref.current) {
              ref.current.src = missingImage;
            }
          }
        };

        ref.current.src = src;
      }
      return () => {
        signal.aborted = true;
      };
    }
  }, []);

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
      <img
        ref={ref}
        src={src}
        className={twMerge(
          cover ? 'bg-cover' : 'bg-contain',
          center ? 'bg-center' : 'bg-top',
          loaded ? 'opacity-100' : 'opacity-0',
          fade ? 'transition-opacity duration-500' : '',
          ' w-full h-full bg-no-repeat',
          className
        )}
      />
    </div>
  );
});

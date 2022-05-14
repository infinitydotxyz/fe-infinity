import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  src?: string;
  center?: boolean; // false for bg-top
  className?: string;
}

export const BGImage = ({ src, center = true, className = '' }: Props) => {
  const [loaded, setLoaded] = useState(false);

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
    <div className={twMerge('w-full h-full', className, 'bg-gray-100')}>
      <div
        className={twMerge(
          center ? 'bg-center' : 'bg-top',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500 w-full h-full bg-cover bg-no-repeat',
          className
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
    </div>
  );
};

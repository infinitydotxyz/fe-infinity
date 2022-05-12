import { ReactNode, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  src?: string;
  center?: boolean; // false for bg-top
  className?: string;
  children?: ReactNode;
}

export const BGImage = ({ src, center = true, className = '', children }: Props) => {
  const [loaded, setLoaded] = useState(false);

  if (!src) {
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
    img.src = src;

    return () => {
      deleted = true;

      // trying to cancel load? not sure if this works
      img.src = '';
      img.onload = null;
    };
  }, []);

  return (
    <div className={twMerge('', className, 'bg-gray-100')}>
      <div
        className={twMerge(
          center ? 'bg-center' : 'bg-top',
          loaded ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-500  bg-cover bg-no-repeat',
          className
        )}
        style={{ backgroundImage: `url(${src})` }}
      />
      {children}
    </div>
  );
};

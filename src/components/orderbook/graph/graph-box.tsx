import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { borderColor, gradientTW } from './graph-utils';

interface Props {
  children: ReactNode;
  className?: string;
}

export const GraphBox = ({ children, className = '' }: Props) => {
  return (
    <div className={twMerge('flex flex-col border rounded-xl px-8', gradientTW, borderColor, className)}>
      {children}
    </div>
  );
};

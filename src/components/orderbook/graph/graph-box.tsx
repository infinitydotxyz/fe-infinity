import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { borderColor, darkGradientTW, gradientTW } from './graph-utils';

interface Props {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export const GraphBox = ({ children, className = '', dark = false }: Props) => {
  return (
    <div
      className={twMerge(
        'relative flex flex-col border rounded-xl px-8 overflow-clip',
        borderColor,
        dark ? darkGradientTW : gradientTW,
        dark ? 'shadow-sm' : '',
        dark ? twMerge('rounded-3xl p-6') : '',
        className
      )}
    >
      {children}
    </div>
  );
};

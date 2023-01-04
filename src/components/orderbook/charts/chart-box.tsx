import { ReactNode } from 'react';
import { cardClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { chartHeight } from './chart-utils';

export enum ChartBoxTheme {
  White,
  Grey,
  Dark
}

interface ChartBoxProps {
  children: ReactNode;
  className?: string;
  noCSSStyles?: boolean;
}

export const ChartBox = ({ children, className = '', noCSSStyles: noStyle = false }: ChartBoxProps) => {
  return (
    <div
      className={twMerge('rounded-xl px-6 pt-5 pb-12', cardClr, className)}
      style={noStyle ? undefined : { height: chartHeight }}
    >
      {children}
    </div>
  );
};

import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { blackGradientTW, borderColor, greyGradientTW, whiteGradientTW } from './graph-utils';

export enum GraphBoxTheme {
  White,
  Grey,
  Dark
}

interface GraphBoxProps {
  children: ReactNode;
  className?: string;
  theme?: GraphBoxTheme;
}

export const GraphBox = ({ children, className = '', theme = GraphBoxTheme.Grey }: GraphBoxProps) => {
  let themeColors = '';
  switch (theme) {
    case GraphBoxTheme.White:
      themeColors = `border-gray-200 ${greyGradientTW}`;
      break;
    case GraphBoxTheme.Grey:
      themeColors = `${borderColor} ${whiteGradientTW}`;
      break;
    case GraphBoxTheme.Dark:
      themeColors = `${blackGradientTW}`;
      break;
  }

  return (
    <div className={twMerge('relative flex flex-col border rounded-xl p-6 overflow-clip', themeColors, className)}>
      {children}
    </div>
  );
};

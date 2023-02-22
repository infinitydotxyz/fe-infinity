import { MotionValue } from 'framer-motion';
import { ReactNode } from 'react';

export type DockContextType = {
  hovered: boolean;
  width: number | undefined;
};

export type DockItemProps = {
  key?: string;
  id?: string;
  highlighted?: boolean;
  children?: ReactNode;
  className?: string;
};

export type IconProps = {
  className?: string;
  height?: string | number;
  width?: string | number;
};

export type MouseType = {
  position: {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
  velocity: {
    x: MotionValue<number>;
    y: MotionValue<number>;
  };
};

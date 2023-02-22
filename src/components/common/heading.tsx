import React from 'react';
import { twMerge } from 'tailwind-merge';

export type HeadingType = 'h6' | 'h5' | 'h4' | 'h3' | 'h2' | 'h1';

const sizes: Record<HeadingType, string> = {
  h1: 'text-7xl',
  h2: 'text-6xl',
  h3: 'text-5xl',
  h4: 'text-4xl',
  h5: 'text-3xl',
  h6: 'text-2xl'
};

interface Props {
  as?: HeadingType;
  className?: string;
  children?: React.ReactNode;
}

export const Heading: React.FC<Props> = ({ as = 'h1', children, className }) => {
  const Component = as;
  return <Component className={twMerge(sizes[as], className)}>{children}</Component>;
};

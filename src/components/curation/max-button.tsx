import React from 'react';
import { twMerge } from 'tailwind-merge';
import { Button, ButtonProps } from '../common';

export type MaxButtonProps = Omit<ButtonProps, 'children'>;

export const MaxButton: React.FC<MaxButtonProps> = ({ className, ...props }) => {
  return (
    <Button {...props} size="small" className={twMerge('rounded-full py-3 px-2', className)}>
      Max
    </Button>
  );
};

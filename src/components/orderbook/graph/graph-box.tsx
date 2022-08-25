import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  children: ReactNode;
  className?: string;
}

export const GraphBox = ({ children, className = '' }: Props) => {
  return (
    <div className={twMerge('flex flex-col bg-white bg-opacity-5 border border-[#034] rounded-xl px-8', className)}>
      {children}
    </div>
  );
};

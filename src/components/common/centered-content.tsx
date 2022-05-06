import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const CenteredContent = ({ children }: Props) => {
  return <div className="h-full w-full flex justify-center items-center text-theme-light-800 text-xl">{children}</div>;
};

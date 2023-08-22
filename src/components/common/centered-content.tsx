import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export const CenteredContent = ({ children }: Props) => {
  return <div className="h-full w-full flex justify-center items-center">{children}</div>;
};

export const CenterFixed = ({ children }: Props) => {
  return (
    <div className="top-0 left-16 right-0 bottom-0 fixed flex justify-center items-center pointer-events-none">
      {children}
    </div>
  );
};

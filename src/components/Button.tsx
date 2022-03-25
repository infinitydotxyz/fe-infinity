import { ReactElement } from 'react';

interface Props {
  children?: ReactElement | ReactElement[] | string;
  onClick?: () => void;
}

export function Button({ children, onClick }: Props): JSX.Element {
  return (
    <button type='button' className='rounded-full bg-black text-white px-4 py-1 text-sm  ' onClick={onClick}>
      <span className='sr-only'>Close panel</span>
      {children}
    </button>
  );
}

export function OutlineButton({ children, onClick }: Props): JSX.Element {
  return (
    <button type='button' className='rounded-md bg-white text-black hover:text-gray-500  ' onClick={onClick}>
      <span className='sr-only'>Close panel</span>
      {children}
    </button>
  );
}

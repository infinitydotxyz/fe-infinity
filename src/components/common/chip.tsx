import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props {
  left?: ReactElement;
  content: string | ReactElement;
  right?: ReactElement;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Chip({ left, content, right, active, onClick, className }: Props) {
  const activeCx = active === true ? 'bg-gray-900 text-white' : '';
  return (
    <button
      className={twMerge(
        `flex justify-center items-center m-1 font-medium font-heading py-2 px-4 rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200 ${activeCx} ${
          className ?? ''
        }`
      )}
      onClick={onClick}
    >
      {left && <div className="pl-3">{left}</div>}
      <div className={`text-xs font-normal leading-none max-w-full flex-initial px-2`}>{content}</div>
      {right && <div className="flex flex-auto flex-row-reverse pr-3">{right}</div>}
    </button>
  );
}

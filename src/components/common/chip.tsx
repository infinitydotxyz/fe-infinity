import { ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from '../../utils/ui-constants';

interface Props {
  left?: ReactElement;
  content: string | ReactElement;
  right?: ReactElement;
  iconOnly?: boolean;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip = ({ left, content, right, iconOnly, active, onClick, className = '' }: Props) => {
  const activeCx = active === true ? 'bg-gray-900 text-white' : '';
  return (
    <button
      className={twMerge(
        inputBorderColor,
        'flex justify-center items-center m-1 font-medium font-heading px-4 h-[50px] rounded-full border cursor-pointer hover:bg-gray-200',
        `${iconOnly ? 'w-[50px] p-2' : ''} ${activeCx} ${className}`
      )}
      onClick={onClick}
    >
      {left && <div className="pl-3">{left}</div>}

      <div className={`font-zagmamono leading-none max-w-full flex-initial px-2`}>{content}</div>

      {right && <div className="flex flex-auto flex-row-reverse pr-3">{right}</div>}
    </button>
  );
};

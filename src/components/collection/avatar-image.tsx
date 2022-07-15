import { twMerge } from 'tailwind-merge';
import { EZImage } from '../common';

const sizes = {
  medium: 'w-28 h-28',
  large: 'w-32 h-32'
};

export interface Props {
  url?: string;
  onClick?: () => void;
  size?: keyof typeof sizes;
  className?: string;
}

export const AvatarImage = ({ url, onClick, className, size = 'medium' }: Props) => {
  return (
    <EZImage src={url} className={twMerge('rounded-[50%] overflow-clip', sizes[size], className)} onClick={onClick} />
  );
};

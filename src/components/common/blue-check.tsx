import { twMerge } from 'tailwind-merge';
import { SVG } from './svg';

interface Props {
  className?: string;
}

export const BlueCheck = ({ className = '' }: Props) => {
  return <SVG.blueCheck className={twMerge('h-4 w-4 shrink-0', className)} />;
};

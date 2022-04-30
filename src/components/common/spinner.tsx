import { twMerge } from 'tailwind-merge';
import { SVG } from './svg';

interface Props {
  className: string;
}

export const Spinner = ({ className }: Props) => {
  return (
    <SVG.spinner
      className={twMerge(`mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 ${className}`)}
    />
  );
};

import { largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { SVG } from './svg';

interface Props {
  className?: string;
}

export const Spinner = ({ className }: Props) => {
  return (
    <SVG.spinner
      className={twMerge(largeIconButtonStyle, ' text-gray-200 animate-spin dark:text-gray-600 fill-black', className)}
    />
  );
};

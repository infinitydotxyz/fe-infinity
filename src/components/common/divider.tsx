import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const Divider = ({ className = 'my-4' }: Props): JSX.Element => {
  return <div className={twMerge('h-px w-full border-t', borderColor, className)} />;
};

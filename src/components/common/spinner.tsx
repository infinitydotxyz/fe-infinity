import { PuffLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const Spinner = ({ className }: Props) => {
  return (
    <span className={twMerge(`w-24 h-24 ${className}`)}>
      <PuffLoader size={45} color="#ccc" />
    </span>
  );
};

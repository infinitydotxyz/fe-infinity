import { PuffLoader } from 'react-spinners';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const Spinner = ({ className = '' }: Props) => {
  return (
    <div className={twMerge(`w-[45px] h-[45px] ${className}`)}>
      <PuffLoader size={45} color="#ccc" />
    </div>
  );
};

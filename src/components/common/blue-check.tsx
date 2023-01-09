import { BsPatchCheckFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';

interface Props {
  className?: string;
}

export const BlueCheck = ({ className = '' }: Props) => {
  return <BsPatchCheckFill className={twMerge(className, 'text-blue-500')} />;
};

export const BlueCheckInline = () => {
  return <BlueCheck className="inline ml-1 mb-0.5" />;
};

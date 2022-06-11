import { twMerge } from 'tailwind-merge';

export interface Props {
  className?: string;
}

export const Spacer: React.FC<Props> = ({ className }) => {
  return <div className={twMerge('flex-1', className)} />;
};

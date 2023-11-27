import { BlueCheckIcon } from '../../icons';

interface Props {
  className?: string;
}

export const BlueCheck = ({ className = '' }: Props) => {
  return <BlueCheckIcon className={className} />;
};

export const BlueCheckInline = () => {
  return <BlueCheck className="inline ml-1 mb-0.5" />;
};

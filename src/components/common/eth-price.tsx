import { twMerge } from 'tailwind-merge';

interface Props {
  label: string;
  className?: string;
  rowClassName?: string;
  ethClassName?: string;
  labelClassName?: string;
}

export const EthSymbol = 'Ξ';

export const EthPrice = ({
  label,
  className = '',
  rowClassName = '',
  ethClassName = '',
  labelClassName = ''
}: Props): JSX.Element => {
  return (
    <div className={className}>
      <div className={twMerge(`flex items-center ${rowClassName}`)}>
        <div className={`pr-2 font-bold ${ethClassName}`}>{EthSymbol}</div>

        <div className={labelClassName}>{label}</div>
      </div>
    </div>
  );
};

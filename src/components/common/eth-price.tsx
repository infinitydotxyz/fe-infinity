import { twMerge } from 'tailwind-merge';

interface Props {
  label: string;
  className?: string;
  rowClassName?: string;
  ethClassName?: string;
  labelClassName?: string;
  onRight?: boolean;
}

export const EthSymbol = 'Ξ';

export const EthPrice = ({
  label,
  className = '',
  rowClassName = '',
  ethClassName = '',
  labelClassName = '',
  onRight = false
}: Props): JSX.Element => {
  return (
    <div className={className}>
      <div className={twMerge(`flex items-center ${rowClassName}`)}>
        {onRight && (
          <>
            <div className={labelClassName}>{label}</div>

            <div className={`ml-1 font-bold ${ethClassName}`}>{EthSymbol}</div>
          </>
        )}

        {!onRight && (
          <>
            <div className={`mr-1 font-bold ${ethClassName}`}>{EthSymbol}</div>

            <div className={labelClassName}>{label}</div>
          </>
        )}
      </div>
    </div>
  );
};

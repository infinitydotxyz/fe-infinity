interface Props {
  label: string;
  className?: string;
  ethClassName?: string;
  labelClassName?: string;
}

export const EthSymbol = 'Ξ';

export const EthPrice = ({ label, className = '', ethClassName = '', labelClassName = '' }: Props): JSX.Element => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <div className={`pr-2 font-extrabold ${ethClassName}`}>{EthSymbol}</div>

        <div className={labelClassName}>{label}</div>
      </div>
    </div>
  );
};

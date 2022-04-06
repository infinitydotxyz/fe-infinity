interface Props {
  label: string;
  className?: string;
}

export const EthSymbol = 'Ξ';

export function EthPrice({ label, className = 'pr-2 font-bold' }: Props): JSX.Element {
  return (
    <div className="flex items-center">
      <div className={className}>{EthSymbol}</div>
      <div>{label}</div>
    </div>
  );
}

interface Props {
  className?: string;
}

export const Divider = ({ className = 'my-4' }: Props): JSX.Element => {
  return <div className={`h-px w-full bg-gray-200 ${className}`} />;
};

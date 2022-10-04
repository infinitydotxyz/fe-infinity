import { State } from 'src/utils/state';
import { twMerge } from 'tailwind-merge';

const inactive = {
  'border-radius': '50%',
  height: '1rem',
  width: '1rem'
};

const active = {
  ...inactive,
  'box-shadow': '0 0 0 0 rgba(0, 0, 0, 1)',
  transform: 'scale(1)',
  animation: 'pulse 2s infinite'
};

const color = {
  [State.Active]: 'bg-blue-500',
  [State.Inactive]: 'bg-gray-500',
  [State.Complete]: 'bg-green-500'
};

interface Props {
  className?: string;
  state: State;
  ref?: React.RefObject<HTMLDivElement>;
}

export const PulseIcon = ({ className, state, ref }: Props) => {
  return (
    <span
      className={twMerge(color[state], className)}
      style={state === State.Active ? active : inactive}
      ref={ref}
    ></span>
  );
};

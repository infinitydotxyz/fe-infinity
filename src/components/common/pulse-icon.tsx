import { State } from 'src/utils/state';
import { twMerge } from 'tailwind-merge';

const inactive = {
  borderRadius: '50%',
  height: '1rem',
  width: '1rem'
};

const active = {
  ...inactive,
  boxShadow: '0 0 0 0 rgba(0, 0, 0, 1)',
  transform: 'scale(1)',
  animation: 'pulse 2s infinite'
};

const colorsByState = {
  [State.Active]: 'bg-blue-500',
  [State.Inactive]: 'bg-gray-500',
  [State.Complete]: 'bg-green-500'
};

export enum PulseIconColor {
  Red = 'bg-red-500',
  Blue = 'bg-blue-500',
  Orange = 'bg-orange-500',
  Green = 'bg-green-500',
  Gray = 'bg-gray-500'
}

type Props =
  | {
      className?: string;
      state: State;
      ref?: React.RefObject<HTMLDivElement>;
    }
  | {
      className?: string;
      color: PulseIconColor;
      isPulsing: boolean;
      ref?: React.RefObject<HTMLDivElement>;
    };

export const PulseIcon = (props: Props) => {
  const color = 'color' in props ? props.color : colorsByState[props.state];
  const isPulsing = 'isPulsing' in props ? props.isPulsing : props.state === State.Active;
  return (
    <span className={twMerge(color, props.className)} style={isPulsing ? active : inactive} ref={props.ref}></span>
  );
};

import { RoundRectBar } from '../round-rect-bar';
import { StackedBarProps } from './types';

export const StackedBar: React.FC<StackedBarProps> = ({ color, height, radius, width, x, y, ...props }) => {
  // TODO: create custom candle-like shape to mimic Apple's chart.
  return (
    <>
      {height === 0 ||
        (height > 0 && (
          <RoundRectBar
            x={x}
            y={y}
            width={width}
            height={Math.max(height, 1)}
            tl={radius}
            tr={radius}
            br={0}
            bl={0}
            fill={color}
            {...props}
          />
        ))}
    </>
  );
};

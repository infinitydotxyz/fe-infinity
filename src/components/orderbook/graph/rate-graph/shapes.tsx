import { RoundRectBar } from '../round-rect-bar';
import { StackedBarProps } from './types';

export const candleStickColor = '#FFFFFF';
export const candleStickGradientId = 'candle-stick-gradient';

export const CandleStick: React.FC<StackedBarProps> = ({ color, height, radius, width, x, y, ...props }) => {
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
            br={radius}
            bl={radius}
            fill={color}
            {...props}
          />
        ))}
    </>
  );
};

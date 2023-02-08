export interface ChartDimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  boundedWidth: number;
  boundedHeight: number;
}

export const chartHeight = 400;

export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(num, max));
};

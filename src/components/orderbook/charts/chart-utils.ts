interface ChartDimensions {
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

export const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }): ChartDimensions => {
  const margin = {
    top: 10,
    right: 0,
    bottom: 50,
    left: 60
  };

  return {
    margin,
    boundedWidth: width - margin.left - margin.right,
    boundedHeight: height - margin.top - margin.bottom
  };
};

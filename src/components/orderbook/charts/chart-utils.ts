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

export const textColor = '#333333';
export const textColorTW = 'text-[#333333]';
export const textLight = '#777';
export const accentColor = '#92deff';
export const accentAltColor = '#e8adad';
export const axisLineColor = `${textColor}88`;

// for GraphBox
export const borderColor = 'border-gray-200';
export const hoverStrokeColor = '#62aeff';

export const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }): ChartDimensions => {
  const margin = {
    top: 10,
    right: 0,
    bottom: 60,
    left: 60
  };

  return {
    margin,
    boundedWidth: width - margin.left - margin.right,
    boundedHeight: height - margin.top - margin.bottom
  };
};

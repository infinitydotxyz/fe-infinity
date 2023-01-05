import { SaleEntry } from './demoData';

interface Dimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  boundedWidth: number;
  boundedHeight: number;
}

function getDimensions({ width, height }: { width: number; height: number }): Dimensions {
  const margin = {
    top: 10,
    right: 0,
    bottom: 60,
    left: 70
  };

  return {
    margin,
    boundedWidth: width - margin.left - margin.right,
    boundedHeight: height - margin.top - margin.bottom
  };
}

const yAccessor = (d: SaleEntry) => d.salePrice ?? 0;
const xAccessor = (d: SaleEntry) => new Date(d.timestamp ?? 0);

export { getDimensions, yAccessor, xAccessor };

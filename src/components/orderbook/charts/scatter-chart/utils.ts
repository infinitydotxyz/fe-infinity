import { WeatherEntry } from './demoData';

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
    top: 100,
    right: 10,
    bottom: 60,
    left: 70
  };

  return {
    margin,
    boundedWidth: width - margin.left - margin.right,
    boundedHeight: height - margin.top - margin.bottom
  };
}

const yAccessor = (d: WeatherEntry) => d.humidity;
const xAccessor = (d: WeatherEntry) => d.dewPoint;
const cloudAccessor = (d: WeatherEntry) => d.cloudCover;

export { getDimensions, yAccessor, xAccessor, cloudAccessor };

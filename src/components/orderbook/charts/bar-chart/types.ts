import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { ChartData } from '../chart-utils';

export type BarChartData = {
  data: ChartData[];
  axisLabel: string;
  tooltip?: React.ReactNode;
  start: number;
  end: number;
};

export enum BarChartType {
  Offers = 'offers',
  Listings = 'listings'
}

export type BarChartProps = {
  graphData: ChartData[];
  width: number;
  height: number;
  graphType: BarChartType;
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
  priceBucket: number;
};

export type ResponsiveBarChartProps = Omit<BarChartProps, 'width' | 'height'>;

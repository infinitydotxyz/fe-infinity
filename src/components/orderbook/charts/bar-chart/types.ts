import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { ChartData } from '../chart-utils';

export type RateGraphData = {
  data: ChartData[];
  axisLabel: string;
  tooltip?: React.ReactNode;
  start: number;
  end: number;
};

export enum RateGraphType {
  Offers = 'offers',
  Listings = 'listings'
}

export type RateGraphProps = {
  graphData: ChartData[];
  width: number;
  height: number;
  graphType: RateGraphType;
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
  priceBucket: number;
};

export type ResponsiveRateGraphProps = Omit<RateGraphProps, 'width' | 'height'>;

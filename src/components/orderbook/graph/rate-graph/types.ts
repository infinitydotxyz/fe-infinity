import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphData } from '../graph-utils';

export type RateGraphData = {
  data: GraphData[];
  axisLabel: string;
  tooltip?: React.ReactNode;
  start: number;
  end: number;
};

export enum RateGraphType {
  Offers = 'offers',
  Listings = 'listings',
  Sales = 'sales'
}

export type RateGraphProps = {
  graphData: GraphData[];
  width: number;
  height: number;
  graphType: RateGraphType;
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
  priceBucket: number;
};

export type ResponsiveRateGraphProps = Omit<RateGraphProps, 'width' | 'height'>;

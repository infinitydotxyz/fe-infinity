import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphData } from '../graph-utils';
import { RoundRectProps } from '../round-rect-bar';

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
};

export type ResponsiveRateGraphProps = Omit<RateGraphProps, 'width' | 'height'>;

export type StackedBarProps = {
  y: number;
  x: number;
  width: number;
  color: string;
  radius: number;
  height: number;
} & Pick<RoundRectProps, 'onMouseEnter' | 'onMouseLeave' | 'onMouseMove' | 'onClick'>;

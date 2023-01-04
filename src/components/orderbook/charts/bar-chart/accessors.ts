import { ChartData } from '../chart-utils';
import { RateGraphData } from './types';

export const getPriceValue = (d: ChartData) => d.price;
export const getOrder = (d: ChartData) => d.order;
export const getOrderCount = (d: RateGraphData) => d.data.length;
export const getAxisLabel = (d: RateGraphData) => d.axisLabel;

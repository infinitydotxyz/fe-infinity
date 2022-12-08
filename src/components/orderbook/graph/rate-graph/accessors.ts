import { GraphData } from '../graph-utils';
import { RateGraphData } from './types';

export const getPriceValue = (d: GraphData) => d.price;
export const getOrder = (d: GraphData) => d.order;
export const getOrderCount = (d: RateGraphData) => d.data.length;
export const getAxisLabel = (d: RateGraphData) => d.axisLabel;

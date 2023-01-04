import { ChartData } from '../chart-utils';
import { BarChartData } from './types';

export const getPriceValue = (d: ChartData) => d.price;
export const getOrder = (d: ChartData) => d.order;
export const getOrderCount = (d: BarChartData) => d.data.length;
export const getAxisLabel = (d: BarChartData) => d.axisLabel;

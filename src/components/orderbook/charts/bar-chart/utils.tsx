import { numStr } from 'src/utils';
import { ChartData } from '../chart-utils';
import { getPriceValue } from './accessors';
import { BarChartData, BarChartType } from './types';

/**
 * Utility function to convert a raw `ChartData` array to a `RateGraphData` array of values.
 */
export function convertChartData(
  data: ChartData[],
  width: number,
  chartType: BarChartType,
  priceBucket: number
): BarChartData[] {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return [];
  }

  const newData: BarChartData[] = [];
  const columns = Math.ceil(width / columnWidth);
  const values = data.map(getPriceValue);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values) + priceBucket;
  const range = (maxPrice - minPrice) / columns;

  for (let i = 0; i < columns; i++) {
    newData.push({
      data: [],
      axisLabel: numStr(minPrice + i * range),
      start: minPrice + i * range,
      end: minPrice + (i + 1) * range
    });
  }

  for (const item of data) {
    const i = Math.floor((item.price - minPrice) / range);

    if (item.isSellOrder && chartType === BarChartType.Listings) {
      newData[i].data.push(item);
    } else if (!item.isSellOrder && chartType === BarChartType.Offers) {
      newData[i].data.push(item);
    }
  }

  return newData;
}

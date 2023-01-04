import { numStr } from 'src/utils';
import { ChartData } from '../chart-utils';
import { getPriceValue } from './accessors';
import { RateGraphData, RateGraphType } from './types';

/**
 * Utility function to convert a raw `GraphData` array to a `RateGraphData` array of values.
 */
export function convertGraphData(
  data: ChartData[],
  width: number,
  graphType: RateGraphType,
  priceBucket: number
): RateGraphData[] {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return [];
  }

  const newData: RateGraphData[] = [];
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

    if (item.isSellOrder && graphType === RateGraphType.Listings) {
      newData[i].data.push(item);
    } else if (!item.isSellOrder && graphType === RateGraphType.Offers) {
      newData[i].data.push(item);
    }
  }

  return newData;
}

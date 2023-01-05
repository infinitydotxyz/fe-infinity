import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { AnimatedAxis, AnimatedBarSeries, AnimatedGrid, Tooltip, XYChart } from '@visx/xychart';
import React, { useMemo, useState } from 'react';
import { EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { numStr } from 'src/utils';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from './chart-box';
import { useChartTheme } from './use-theme';

export enum BarChartType {
  Offers = 'offers',
  Listings = 'listings'
}

export type ChartEntry = {
  isSellOrder: boolean;
  price: number;
  order: SignedOBOrder;
};

export type ResponsiveBarChartProps = Omit<BarChartProps, 'width' | 'height'>;

const barChartMargins = {
  top: 30,
  right: 0,
  bottom: 30,
  left: -40
};

type BarChartEntry = {
  data: ChartEntry[];
  axisLabel: string;
  tooltip?: React.ReactNode;
  start: number;
  end: number;
};

type BarChartProps = {
  graphData: ChartEntry[];
  width?: number;
  height?: number;
  graphType: BarChartType;
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
  priceBucket?: number;
};

const getPriceValue = (d: ChartEntry) => d.price;
const getOrder = (d: ChartEntry) => d.order;
const getOrderCount = (d: BarChartEntry) => d.data.length;
const getAxisLabel = (d: BarChartEntry) => d.axisLabel;

const priceBuckets = [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 100];

/**
 * Utility function to convert a raw `ChartData` array to a `BarChartData` array of values.
 */
function convertChartData(
  data: ChartEntry[],
  width: number,
  chartType: BarChartType,
  priceBucket: number
): BarChartEntry[] {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return [];
  }

  const newData: BarChartEntry[] = [];
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

export const ResponsiveBarChart = ({ graphData, graphType, onClick, onSelection }: BarChartProps) => {
  const [selectedPriceBucket, setSelectedPriceBucket] = useState(0.01);

  return (
    <ChartBox className="h-full">
      <select
        onChange={(e) => setSelectedPriceBucket(+e.target.value)}
        className={twMerge(
          'form-select rounded-full bg-transparent border-ring-gray-400 focus:ring-gray-400 focus:border-none float-right',
          textClr
        )}
      >
        {priceBuckets.map((filter) => (
          <option value={filter} selected={filter === selectedPriceBucket}>
            {filter} {EthSymbol}
          </option>
        ))}
      </select>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <BarChart
            graphData={graphData}
            graphType={graphType}
            priceBucket={selectedPriceBucket}
            width={width}
            height={height}
            onClick={onClick}
            onSelection={onSelection}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  graphData,
  width: outerWidth,
  height: outerHeight,
  graphType,
  onSelection,
  priceBucket
}) => {
  const { theme } = useChartTheme();
  const width = outerWidth ?? 0 - barChartMargins.left - barChartMargins.right;
  const height = outerHeight ?? 0 - barChartMargins.top - barChartMargins.bottom;

  const data = convertChartData(graphData, width, graphType, priceBucket ?? 0.01);
  const axisLabels = data.map(getAxisLabel);

  if (data.every((d) => d.data.length === 0)) {
    return <strong className={twMerge(textClr, 'h-full flex justify-center items-center')}>No {graphType} data</strong>;
  }

  return (
    <XYChart
      width={outerWidth}
      height={outerHeight}
      xScale={{ type: 'band', range: [0, width], round: true, domain: axisLabels, padding: 0.8 }}
      yScale={{
        type: 'linear',
        range: [height, 10], // NOTE: I don't know why, but removing the second item from this array makes the top of the chart look 'cut off' ¯\_(ツ)_/¯
        round: true,
        domain: [0, Math.max(...data.map(getOrderCount))]
      }}
      theme={theme}
    >
      <AnimatedAxis
        orientation="bottom"
        top={height}
        tickFormat={(v) => `${v}`}
        hideAxisLine={true}
        tickValues={axisLabels}
        label={`${EthSymbol} price`}
        labelOffset={15}
        hideZero={true}
      />
      <AnimatedAxis
        orientation="left"
        tickFormat={(v) => `${parseInt(v)}`}
        hideAxisLine={true}
        label={`# ${graphType}`}
        labelOffset={10}
        // animationTrajectory="center"
      />
      <AnimatedGrid columns={false} strokeDasharray="6,6" />
      <AnimatedBarSeries
        data={data}
        dataKey={graphType}
        xAccessor={getAxisLabel}
        yAccessor={getOrderCount}
        radius={10}
        radiusAll
        onPointerDown={({ event, datum }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isLeftMouseClick = (event as unknown as any).button === 0;
          if (isLeftMouseClick) {
            // onClick(datum.start.toString(), datum.end.toString());
            if (datum.data.length) {
              onSelection(datum.data.map(getOrder), 0);
            }
          }
        }}
        onPointerMove={({ datum }) => {
          if (datum.data.length) {
            onSelection(datum.data.map(getOrder), 0);
          }
        }}
      />

      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => {
          const nearest = tooltipData?.nearestDatum?.datum as unknown as BarChartEntry;
          const from = `${numStr(nearest.start)} ${EthSymbol}`;
          const to = `${numStr(nearest.end)} ${EthSymbol}`;
          const title = `${nearest.data.length} ${graphType}`;
          const items = useMemo<SimpleTableItem[]>(
            () => [
              { title: 'from:', value: <div>{from}</div> },
              { title: 'to:', value: <div>{to}</div> }
            ],
            [from, to]
          );

          return (
            <>
              <div className="mb-1">
                <span>{title}</span>
              </div>
              <div className="w-full">
                <SimpleTable items={items} rowClassName="mb-1" />
              </div>
            </>
          );
        }}
      />
    </XYChart>
  );
};

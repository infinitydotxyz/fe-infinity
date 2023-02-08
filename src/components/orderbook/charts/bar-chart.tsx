import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { AnimatedAxis, AnimatedBarSeries, AnimatedGrid, Tooltip, XYChart } from '@visx/xychart';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';
import { EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { numStr } from 'src/utils';
import { borderColor, secondaryBgColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import tailwindConfig from '../../../settings/tailwind/elements/foundations';
import { ChartBox } from './chart-box';
import { getChartDimensions } from './chart-utils';
import { useChartTheme } from './use-theme';

export enum BarChartType {
  Offers = 'Offers',
  Listings = 'Listings'
}

export interface ResponsiveBarChartProps extends Omit<BarChartProps, 'width' | 'height' | 'selectedPriceBucket'> {
  graphType: BarChartType;
}

interface BarChartProps {
  graphData: CollectionOrder[];
  selectedPriceBucket: number;
  width: number;
  height: number;
  graphType: BarChartType;
  fetchData: (minPrice: string, maxPrice: string) => void;
  displayDetails: (orders: CollectionOrder[], index: number) => void;
}

type BarChartEntry = {
  data: CollectionOrder[];
  axisLabel: string;
  tooltip: React.ReactNode;
  start: number;
  end: number;
};

const getPriceValue = (d: CollectionOrder) => d.priceEth;
const getOrder = (d: CollectionOrder) => d;
const getOrderCount = (d: BarChartEntry) => d.data.length;
const getAxisLabel = (d: BarChartEntry) => d.axisLabel;

const priceBuckets = [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 100];

/**
 * Utility function to convert a raw `ChartData` array to a `BarChartData` array of values.
 */
function convertRawDataToChartData(
  data: CollectionOrder[],
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
      end: minPrice + (i + 1) * range,
      tooltip: ''
    });
  }

  for (const item of data) {
    const i = Math.floor((item.priceEth - minPrice) / range);

    if (item.isSellOrder && chartType === BarChartType.Listings) {
      newData[i].data.push(item);
    } else if (!item.isSellOrder && chartType === BarChartType.Offers) {
      newData[i].data.push(item);
    }
  }

  return newData;
}

export const ResponsiveBarChart = ({ graphData, graphType, fetchData, displayDetails }: ResponsiveBarChartProps) => {
  const [selectedPriceBucket, setSelectedPriceBucket] = useState(1);
  return (
    <ChartBox className="h-full">
      <div className="flex justify-between mb-4">
        <div className="ml-6 font-medium mt-3">{graphType}</div>
        <select
          onChange={(e) => setSelectedPriceBucket(+e.target.value)}
          className={twMerge('form-select rounded-lg bg-transparent focus:border-none focus:outline-none text-sm')}
        >
          {priceBuckets.map((filter) => (
            <option value={filter} selected={filter === selectedPriceBucket}>
              {filter} {EthSymbol}
            </option>
          ))}
        </select>
      </div>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <BarChart
            graphData={graphData}
            graphType={graphType}
            width={width}
            height={height}
            fetchData={fetchData}
            selectedPriceBucket={selectedPriceBucket}
            displayDetails={displayDetails}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  graphData,
  width,
  height,
  graphType,
  fetchData,
  displayDetails,
  selectedPriceBucket
}) => {
  const { boundedWidth, boundedHeight } = getChartDimensions({
    width,
    height
  });

  const data = convertRawDataToChartData(graphData, boundedWidth, graphType, selectedPriceBucket);
  const axisLabels = data.map(getAxisLabel);

  if (data.every((d) => d.data.length === 0)) {
    return (
      <strong className={twMerge(textColor, 'h-full flex justify-center items-center')}>No {graphType} data</strong>
    );
  }

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const { theme: chartTheme } = useChartTheme();

  return (
    <XYChart
      width={width}
      height={height}
      xScale={{ type: 'band', range: [0, boundedWidth], round: true, domain: axisLabels, padding: 0.85 }}
      yScale={{
        type: 'linear',
        range: [boundedHeight, 0],
        round: true,
        domain: [0, Math.max(...data.map(getOrderCount))]
      }}
      theme={chartTheme}
    >
      <AnimatedAxis
        numTicks={5}
        orientation="bottom"
        tickFormat={(v) => `${v}`}
        hideAxisLine={true}
        hideTicks={true}
        top={boundedHeight}
        tickLabelProps={() => ({
          fill: themeToUse.disabled,
          fontWeight: 700,
          fontSize: 12,
          textAnchor: 'middle'
        })}
      />
      <AnimatedAxis
        numTicks={5}
        orientation="left"
        tickFormat={(v) => `${parseInt(v)}`}
        hideAxisLine={true}
        hideTicks={true}
        tickLabelProps={() => ({
          fill: themeToUse.disabled,
          fontWeight: 700,
          fontSize: 12,
          textAnchor: 'end',
          verticalAnchor: 'middle'
        })}
      />
      <AnimatedGrid columns={false} strokeDasharray="6,6" stroke={themeToUse.disabledFade} numTicks={6} />
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
            fetchData(datum.start.toString(), datum.end.toString());
            displayDetails(datum.data.map(getOrder), 0);
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
            <div className={twMerge(borderColor, secondaryBgColor, 'border rounded-lg p-2')}>
              <div className="mb-1 p-1">
                <span>{title}</span>
              </div>
              <div className="w-full p-1">
                <SimpleTable items={items} rowClassName="mb-2" valueClassName="ml-2" />
              </div>
            </div>
          );
        }}
      />
    </XYChart>
  );
};

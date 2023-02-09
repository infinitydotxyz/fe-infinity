import { CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { AnimatedAxis, AnimatedBarSeries, AnimatedGrid, Tooltip, XYChart } from '@visx/xychart';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';
import { ASwitchButton } from 'src/components/astra/astra-button';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { EthSymbol, SimpleTable, SimpleTableItem } from 'src/components/common';
import { numStr } from 'src/utils';
import {
  borderColor,
  saleDataPointColor,
  secondaryBgColor,
  secondaryTextColor,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { ChartBox } from './chart-box';
import { BarChartType } from './types';
import { useChartTheme } from './use-theme';

export interface ResponsiveBarChartProps extends Omit<BarChartProps, 'width' | 'height' | 'selectedPriceBucket'> {
  graphType: BarChartType;
}

interface BarChartProps {
  data: CollectionOrder[];
  selectedPriceBucket: number;
  width: number;
  height: number;
  graphType: BarChartType;
  displayDetails: (orders: CollectionOrder[], index: number) => void;
  hideOutliers?: boolean;
}

type BarChartEntry = {
  data: CollectionOrder[];
  axisLabel: string;
  tooltip: React.ReactNode;
  start: number;
  end: number;
};

const getPriceValue = (d: CollectionOrder) => d?.priceEth;
const getOrderCount = (d: BarChartEntry) => d?.data?.length;
const getAxisLabel = (d: BarChartEntry) => d?.axisLabel;

const priceBuckets = [0.1, 0.5, 1, 5, 10, 100];

/**
 * Utility function to convert a raw `ChartData` array to a `BarChartData` array of values.
 */
function convertRawDataToChartData(
  data: CollectionOrder[],
  width: number,
  priceBucket: number,
  hideOutliers = true
): { listings: BarChartEntry[]; minPrice: number; maxPrice: number } {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return { listings: [], minPrice: 0, maxPrice: 0 };
  }

  const listings: BarChartEntry[] = [];
  const values = data
    .filter((v) => v.isSellOrder)
    .map(getPriceValue)
    .sort((a, b) => a - b);

  let dataToRender = data;
  let minPrice = Math.min(...values);
  let maxPrice = Math.max(...values);

  if (hideOutliers) {
    const lowerHalfMedian = values[Math.floor(values.length / 4)];
    const upperHalfMedian = values[Math.floor((values.length * 3) / 4)];
    const iqr = upperHalfMedian - lowerHalfMedian;
    const lowerThreshold = lowerHalfMedian - 1.5 * iqr;
    const upperThreshold = upperHalfMedian + 1.5 * iqr;
    const nonOutliers = values.filter((v) => v >= lowerThreshold && v <= upperThreshold);
    dataToRender = data.filter((v) => v.priceEth >= lowerThreshold && v.priceEth <= upperThreshold);
    minPrice = Math.min(...nonOutliers);
    maxPrice = Math.max(...nonOutliers);
  }

  const numBars = Math.ceil((maxPrice - minPrice) / priceBucket);

  for (let i = 0; i <= numBars; i++) {
    listings.push({
      data: [],
      axisLabel: numStr(Math.floor(minPrice + (i + 1) * priceBucket)),
      start: minPrice + i * priceBucket,
      end: minPrice + (i + 1) * priceBucket,
      tooltip: ''
    });
  }

  for (const item of dataToRender) {
    const i = Math.floor((item.priceEth - minPrice) / priceBucket);
    if (item.isSellOrder) {
      listings[i].data.push(item);
    }
  }

  return { listings, minPrice, maxPrice };
}

export const ResponsiveBarChart = ({ data, graphType, displayDetails }: ResponsiveBarChartProps) => {
  const [selectedPriceBucket, setSelectedPriceBucket] = useState(1);
  const [showOutliers, setShowOutliers] = useState(false);
  return (
    <ChartBox className="h-full">
      <div className="flex justify-between mb-4">
        <div className="ml-6">
          <div className="font-medium mt-3 font-heading text-lg">{graphType}</div>
          <div className={twMerge(secondaryTextColor, 'font-medium text-sm')}>{data.length} listings</div>
        </div>

        <div className="items-center flex space-x-6">
          <div className="flex items-center space-x-2">
            <ASwitchButton
              checked={showOutliers}
              onChange={() => {
                setShowOutliers(!showOutliers);
              }}
            ></ASwitchButton>

            <span className={twMerge('text-sm font-medium', secondaryTextColor)}>Outliers</span>
          </div>

          <ADropdown
            hasBorder={true}
            alignMenuRight
            innerClassName="w-[100px]"
            menuItemClassName="py-2"
            label={selectedPriceBucket + ' ' + EthSymbol}
            items={priceBuckets.map((bucket) => ({
              label: numStr(bucket),
              onClick: () => setSelectedPriceBucket(bucket)
            }))}
          />
        </div>
      </div>

      <ParentSize debounceTime={10}>
        {({ width }) => (
          <BarChart
            data={data}
            graphType={graphType}
            width={width}
            height={300}
            selectedPriceBucket={selectedPriceBucket}
            displayDetails={displayDetails}
            hideOutliers={!showOutliers}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  graphType,
  displayDetails,
  selectedPriceBucket,
  hideOutliers
}) => {
  const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }) => {
    const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 60
    };

    return {
      margin,
      boundedWidth: width - margin.left - margin.right,
      boundedHeight: height - margin.top - margin.bottom
    };
  };

  const { boundedWidth, boundedHeight } = getChartDimensions({
    width,
    height
  });

  const chartData = convertRawDataToChartData(data, boundedWidth, selectedPriceBucket, hideOutliers);

  if (chartData.listings.every((d) => d.data.length === 0)) {
    return <strong className={twMerge(textColor, 'h-full flex justify-center items-center')}>No {graphType}</strong>;
  }

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];
  const { theme: chartTheme } = useChartTheme();
  const [hoveredBarIndex, setHoveredBarIndex] = useState(-1);

  return (
    <XYChart
      width={width}
      height={height}
      xScale={{
        type: 'linear',
        range: [0, boundedWidth],
        round: true,
        domain: [chartData.minPrice, chartData.maxPrice]
      }}
      yScale={{
        type: 'linear',
        range: [boundedHeight, 0],
        round: true,
        domain: [0, Math.max(...chartData.listings.map(getOrderCount))]
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
        data={chartData.listings}
        dataKey="listings"
        xAccessor={getAxisLabel}
        barPadding={0.4}
        yAccessor={getOrderCount}
        colorAccessor={(_, i) => (i === hoveredBarIndex ? saleDataPointColor : undefined)}
        onPointerMove={({ index }) => setHoveredBarIndex(index)}
        onPointerDown={({ event, datum, index }) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const isLeftMouseClick = (event as unknown as any).button === 0;
          if (isLeftMouseClick) {
            displayDetails(datum.data, 0);
            setHoveredBarIndex(index);
          }
        }}
      />

      <Tooltip
        renderTooltip={({ tooltipData }) => {
          const nearest = tooltipData?.nearestDatum?.datum as unknown as BarChartEntry;
          const from = `${numStr(nearest.start)} ${EthSymbol}`;
          const to = `${numStr(nearest.end)} ${EthSymbol}`;
          const title = `${nearest.data.length} ${graphType}`;
          const items = useMemo<SimpleTableItem[]>(
            () => [
              { title: 'From:', value: <div>{from}</div> },
              { title: 'To:', value: <div>{to}</div> }
            ],
            [from, to]
          );

          return (
            <div className={twMerge(borderColor, secondaryBgColor, 'border rounded-lg p-2')}>
              <div className="mb-1 p-1">
                <span>{title}</span>
              </div>
              <div className="w-full p-1">
                <SimpleTable
                  items={items}
                  rowClassName={twMerge('mb-2 font-medium', secondaryTextColor)}
                  valueClassName={twMerge('ml-2', textColor)}
                />
              </div>
            </div>
          );
        }}
      />
    </XYChart>
  );
};

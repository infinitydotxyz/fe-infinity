import React, { useState } from 'react';
import { AnimatedAxis, AnimatedBarSeries, AnimatedGrid, Tooltip, XYChart } from '@visx/xychart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { getAxisLabel, getOrder, getOrderCount } from './accessors';
import { BarChartData, BarChartProps as BarChartProps, ResponsiveBarChartProps } from './types';
import { convertChartData } from './utils';
import { TooltipRenderer } from '../tooltip';
import { numStr } from 'src/utils';
import { EthSymbol } from 'src/components/common';
import { useChartTheme } from './use-theme';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from '../chart-box';

const rateGraphMargins = {
  top: 30,
  right: 0,
  bottom: 30,
  left: 0
};

const priceBuckets = [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 100];

export const ResponsiveBarChart: React.FC<Omit<ResponsiveBarChartProps, 'priceBucket'>> = (props) => {
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
        {({ width, height }) => <BarChart {...props} priceBucket={selectedPriceBucket} width={width} height={height} />}
      </ParentSize>
    </ChartBox>
  );
};

const BarChart: React.FC<BarChartProps> = ({
  graphData,
  width: outerWidth,
  height: outerHeight,
  graphType,
  onClick,
  onSelection,
  priceBucket
}) => {
  const { theme } = useChartTheme();
  const width = outerWidth - rateGraphMargins.left - rateGraphMargins.right;
  const height = outerHeight - rateGraphMargins.top - rateGraphMargins.bottom;

  const data = convertChartData(graphData, width, graphType, priceBucket);
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
        labelOffset={25}
        hideZero={true}
      />
      <AnimatedAxis
        orientation="left"
        tickFormat={(v) => `${v}`}
        hideAxisLine={true}
        label={`# ${graphType}`}
        labelOffset={15}
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
            onClick(datum.start.toString(), datum.end.toString());
          }
        }}
        onPointerMove={({ datum }) => {
          if (datum.data.length) {
            onSelection(datum.data.map(getOrder), datum.data.length - 1);
          }
        }}
      />
      <Tooltip
        snapTooltipToDatumX
        snapTooltipToDatumY
        showVerticalCrosshair
        showSeriesGlyphs
        renderTooltip={({ tooltipData }) => {
          const nearest = tooltipData?.nearestDatum?.datum as unknown as BarChartData;
          return (
            <TooltipRenderer
              title={`${nearest.data.length} ${graphType}`}
              from={`${numStr(nearest.start)} ${EthSymbol}`}
              to={`${numStr(nearest.end)} ${EthSymbol}`}
            />
          );
        }}
      />
    </XYChart>
  );
};

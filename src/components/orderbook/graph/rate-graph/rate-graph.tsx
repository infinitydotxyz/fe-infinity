import React from 'react';
import { AnimatedAxis, AnimatedBarSeries, AnimatedGrid, Tooltip, XYChart } from '@visx/xychart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { getAxisLabel, getOrder, getOrderCount } from './accessors';
import { RateGraphData, RateGraphProps as RateGraphProps, ResponsiveRateGraphProps } from './types';
import { convertGraphData } from './utils';
import { Tooltip as TooltipRenderer } from '../tooltip';
import { numStr } from 'src/utils';
import { EthSymbol } from 'src/components/common';
import { useChartTheme } from './use-theme';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

const rateGraphMargins = {
  top: 30,
  right: 0,
  bottom: 30,
  left: 0
};

export const ResponsiveRateGraph: React.FC<ResponsiveRateGraphProps> = (props) => {
  return (
    <ParentSize debounceTime={10}>
      {({ width, height }) => <RateGraph {...props} width={width} height={height} />}
    </ParentSize>
  );
};

export const RateGraph: React.FC<RateGraphProps> = ({
  graphData,
  width: outerWidth,
  height: outerHeight,
  graphType,
  onClick,
  onSelection
}) => {
  const { theme } = useChartTheme();
  const width = outerWidth - rateGraphMargins.left - rateGraphMargins.right;
  const height = outerHeight - rateGraphMargins.top - rateGraphMargins.bottom;

  const data = convertGraphData(graphData, width, graphType);
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
        label="Price in ETH"
        labelOffset={25}
        hideZero={true}
      />
      <AnimatedAxis
        orientation="left"
        tickFormat={(v) => `${v}`}
        hideAxisLine={true}
        label={`Number of ${graphType}`}
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
          const nearest = tooltipData?.nearestDatum?.datum as unknown as RateGraphData;
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

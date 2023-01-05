import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { Text } from '@visx/text';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { voronoi } from '@visx/voronoi';
import { extent } from 'd3';
import { MouseEvent, TouchEvent, useCallback, useMemo, useState } from 'react';
import { EthSymbol } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from './chart-box';

export enum ScatterChartType {
  Sales = 'sales'
}

export interface SaleEntry {
  timestamp?: number;
  collectionAddress?: string;
  collectionName?: string;
  tokenId?: string;
  tokenImage?: string;
  salePrice?: number;
}

export type ResponsiveScatterChartProps = Omit<ScatterChartProps, 'width' | 'height'>;

type ScatterChartProps = {
  width?: number;
  height?: number;
  graphType: ScatterChartType;
  timeBucket?: string;
  data: SaleEntry[];
  onSelection: (sale: SaleEntry) => void;
  onNilSelection: () => void;
};

interface Dimensions {
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  boundedWidth: number;
  boundedHeight: number;
}

const getDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }): Dimensions => {
  const margin = {
    top: 10,
    right: 0,
    bottom: 60,
    left: 70
  };

  return {
    margin,
    boundedWidth: width - margin.left - margin.right,
    boundedHeight: height - margin.top - margin.bottom
  };
};

const yAccessor = (d: SaleEntry) => d.salePrice ?? 0;
const xAccessor = (d: SaleEntry) => new Date(d.timestamp ?? 0);

const timeBuckets = ['1h', '24h', '1d', '1w', '1m', '1y'];

export const ResponsiveScatterChart = ({ onSelection, data, graphType, onNilSelection }: ScatterChartProps) => {
  const [selectedTimeBucket, setSelectedTimeBucket] = useState('1w');

  return (
    <ChartBox className="h-full">
      <select
        onChange={(e) => setSelectedTimeBucket(e.target.value)}
        className={twMerge(
          'form-select rounded-full bg-transparent border-ring-gray-400 focus:ring-gray-400 focus:border-none float-right',
          textClr
        )}
      >
        {timeBuckets.map((filter) => (
          <option value={filter} selected={filter === selectedTimeBucket}>
            {filter}
          </option>
        ))}
      </select>
      <ParentSize debounceTime={10}>
        {({ width, height }) => (
          <ScatterChart
            data={data}
            graphType={graphType}
            timeBucket={selectedTimeBucket}
            width={width}
            height={height}
            onSelection={onSelection}
            onNilSelection={onNilSelection}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

function ScatterChart({ width, height, data, onSelection, onNilSelection }: ScatterChartProps) {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<SaleEntry>({
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: {}
  });

  const { margin, boundedWidth, boundedHeight } = getDimensions({
    width,
    height
  });

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, boundedWidth],
        domain: extent(data, xAccessor) as [Date, Date],
        nice: true
      }),
    [boundedWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [boundedHeight, 0],
        domain: extent(data, yAccessor) as [number, number],
        nice: true
      }),
    [boundedHeight]
  );

  const voronoiLayout = useMemo(() => {
    return voronoi<SaleEntry>({
      x: (d) => xScale(xAccessor(d)),
      y: (d) => yScale(yAccessor(d)),
      width: boundedWidth,
      height: boundedHeight
    })(data);
  }, [boundedWidth, boundedHeight, xScale, yScale]);

  const voronoiPolygons = useMemo(() => voronoiLayout.polygons(), [voronoiLayout]);

  const handleMouseMove = useCallback(
    (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
      const point = localPoint(e);
      if (!point) {
        return hideTooltip();
      }

      const { x, y } = point;
      const neighborRadius = 100;
      const closest = voronoiLayout.find(x - margin.left, y - margin.top, neighborRadius);

      if (!closest) {
        return;
      }

      showTooltip({
        tooltipLeft: xScale(xAccessor(closest.data)) + margin.left,
        tooltipTop: yScale(yAccessor(closest.data)) + margin.top,
        tooltipData: {
          ...closest.data
        }
      });
      onSelection(closest.data);
    },
    [xScale, yScale, voronoiLayout, voronoiPolygons]
  );

  const cloudsColorScale = useMemo(
    () =>
      scaleLinear<string>({
        range: ['black'] // todo: based on theme
      }),
    []
  );

  const dots = useMemo(
    () =>
      data.map((d) => (
        <Circle key={d.timestamp} fill={'black'} cx={xScale(xAccessor(d))} cy={yScale(yAccessor(d))} r={5} />
      )),
    [xScale, yScale, cloudsColorScale]
  );

  const axisLeftLabel = (
    <Text textAnchor="middle" verticalAnchor="end" angle={-90} y={boundedHeight / 2} x={0} dx={-50}>
      Price
    </Text>
  );

  const axisBottomLabel = (
    <Text textAnchor="middle" verticalAnchor="start" y={boundedHeight} x={boundedWidth / 2} dy={30}>
      Date
    </Text>
  );

  return (
    <div>
      <svg
        width={width}
        height={height}
        onTouchStart={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => hideTooltip()}
        role="figure"
      >
        <Group top={margin.top} left={margin.left}>
          <AxisLeft
            numTicks={4}
            scale={yScale}
            top={0}
            tickLabelProps={() => ({
              fill: '#1c1917',
              fontSize: 10,
              textAnchor: 'end',
              verticalAnchor: 'middle',
              x: -10
            })}
          />
          {axisLeftLabel}
          <AxisBottom
            top={boundedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fill: '#1c1917',
              fontSize: 11,
              textAnchor: 'middle'
            })}
          />
          {axisBottomLabel}
          {dots}
        </Group>
      </svg>

      <ToolTip
        isTooltipOpen={tooltipOpen}
        left={tooltipLeft}
        top={tooltipTop}
        data={tooltipData}
        onNilSelection={onNilSelection}
      />
    </div>
  );
}

interface Props2 {
  left: number;
  top: number;
  data?: SaleEntry;
  isTooltipOpen: boolean;
  onNilSelection: () => void;
}

function ToolTip({ left, top, data, isTooltipOpen, onNilSelection }: Props2) {
  if (!isTooltipOpen) {
    onNilSelection();
  }
  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 10,
        backgroundColor: 'black',
        opacity: isTooltipOpen ? 1 : 0,
        transition: 'all 0.1s ease-out',
        color: 'white'
      }}
      left={left}
      top={top}
    >
      <div className="flex flex-col space-y-2">
        <div>
          {data?.salePrice} {EthSymbol}
        </div>
        <div>{new Date(data?.timestamp ?? 0).toLocaleDateString()}</div>
      </div>
    </TooltipWithBounds>
  );
}

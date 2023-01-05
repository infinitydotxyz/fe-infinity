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
import { EZImage } from 'src/components/common';
import { cardClr, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from './chart-box';

export enum ScatterChartType {
  Sales = 'sales'
}

export interface SaleData {
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
  data: SaleData[];
  displayDetails: (sale: SaleData) => void;
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

const yAccessor = (d: SaleData) => d.salePrice ?? 0;
const xAccessor = (d: SaleData) => new Date(d.timestamp ?? 0);

const timeBuckets = ['1h', '24h', '1d', '1w', '1m', '1y'];

export const ResponsiveScatterChart = ({ displayDetails, data, graphType }: ScatterChartProps) => {
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
            displayDetails={displayDetails}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

function ScatterChart({ width, height, data, displayDetails }: ScatterChartProps) {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<SaleData>({
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
    return voronoi<SaleData>({
      x: (d) => xScale(xAccessor(d)),
      y: (d) => yScale(yAccessor(d)),
      width: boundedWidth,
      height: boundedHeight
    })(data);
  }, [boundedWidth, boundedHeight, xScale, yScale]);

  const voronoiPolygons = useMemo(() => voronoiLayout.polygons(), [voronoiLayout]);

  const getClosestPoint = (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
    const point = localPoint(e);
    if (!point) {
      return hideTooltip();
    }

    const { x, y } = point;
    const neighborRadius = 100;
    const closest = voronoiLayout.find(x - margin.left, y - margin.top, neighborRadius);

    return closest;
  };

  const handleMouseMove = useCallback(
    (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
      const closest = getClosestPoint(e);
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
    },
    [xScale, yScale, voronoiLayout, voronoiPolygons]
  );

  const handleMouseClick = useCallback(
    (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
      const closest = getClosestPoint(e);
      if (!closest) {
        return;
      }
      displayDetails(closest.data);
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
        onMouseDown={handleMouseClick}
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

      <ToolTip isTooltipOpen={tooltipOpen} left={tooltipLeft} top={tooltipTop} data={tooltipData} />
    </div>
  );
}

interface Props2 {
  left: number;
  top: number;
  data?: SaleData;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data, isTooltipOpen }: Props2) {
  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        background: 'white',
        opacity: isTooltipOpen ? 1 : 0,
        transition: 'all 0.1s ease-out'
      }}
      left={left}
      top={top}
    >
      <div className={twMerge(cardClr, textClr, 'flex flex-col p-1')} style={{ aspectRatio: '3.5 / 5' }}>
        <div className="flex-1 rounded-2xl overflow-clip">
          <EZImage src={data?.tokenImage} />
        </div>

        <div className="font-bold truncate ml-1 mt-1">{data?.tokenId}</div>

        <div className={twMerge(textClr, 'flex flex-row space-x-3 m-1')}>
          <div className="flex flex-col">
            <div className="truncate">Sale price</div>
            <div className="truncate">{data?.salePrice}</div>
          </div>
          <div className="flex flex-col">
            <div className="truncate">Date</div>
            <div className="truncate">{new Date(data?.timestamp ?? 0).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </TooltipWithBounds>
  );
}

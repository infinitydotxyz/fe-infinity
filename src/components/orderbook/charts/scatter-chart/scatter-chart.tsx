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
import { ChartBox } from '../chart-box';
import { demoData, SaleEntry } from './demoData';
import { getDimensions, xAccessor, yAccessor } from './utils';

export enum ScatterChartType {
  Sales = 'sales'
}

type ScatterChartProps = {
  width: number;
  height: number;
  graphType: ScatterChartType;
  timeBucket: string;
};

const timeBuckets = ['1h', '24h', '1d', '1w', '1m', '1y'];

export type ResponsiveScatterChartProps = Omit<ScatterChartProps, 'width' | 'height'>;

export const ResponsiveSalesScatterChart: React.FC<Omit<ResponsiveScatterChartProps, 'timeBucket'>> = (props) => {
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
          <ScatterChart {...props} timeBucket={selectedTimeBucket} width={width} height={height} />
        )}
      </ParentSize>
    </ChartBox>
  );
};

function ScatterChart({ width, height }: ScatterChartProps) {
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
        domain: extent(demoData, xAccessor) as [Date, Date],
        nice: true
      }),
    [boundedWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [boundedHeight, 0],
        domain: extent(demoData, yAccessor) as [number, number],
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
    })(demoData);
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
      demoData.map((d) => (
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
        <title>Sales</title>
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
  data?: SaleEntry;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data, isTooltipOpen }: Props2) {
  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        display: 'flex',
        flexDirection: 'column',
        rowGap: 10,
        backgroundColor: 'grey',
        opacity: isTooltipOpen ? 1 : 0,
        transition: 'all 0.1s ease-out'
      }}
      left={left}
      top={top}
    >
      <div className={twMerge(cardClr, 'rounded-2xl flex flex-col')} style={{ aspectRatio: '3 / 5' }}>
        <div className="relative flex-1">
          <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-2xl overflow-clip">
            <EZImage src={data?.tokenImage} className="transition-all" />
          </div>
        </div>

        <div className="font-bold truncate ml-1 mt-1">{data?.tokenId}</div>

        <div className={twMerge(textClr, 'flex flex-row space-x-3 m-1')}>
          <div className="flex flex-col">
            <div className="truncate">Sale price</div>
            <div className="truncate">{data?.salePrice}</div>
          </div>
          <div className="flex flex-col">
            <div className="truncate">Sale price</div>
            <div className="truncate">{data?.salePrice}</div>
          </div>
        </div>
      </div>
    </TooltipWithBounds>
  );
}

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
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from '../chart-box';
import { demoData, WeatherEntry } from './demoData';
import { cloudAccessor, getDimensions, xAccessor, yAccessor } from './utils';

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
  } = useTooltip<TooltipData>({
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
        domain: extent(demoData, xAccessor) as [number, number],
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
    return voronoi<WeatherEntry>({
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
          dewPoint: closest.data.dewPoint,
          date: new Date(closest.data.date)
        }
      });
    },
    [xScale, yScale, voronoiLayout, voronoiPolygons]
  );

  const cloudsColorScale = useMemo(
    () =>
      scaleLinear<string>({
        range: ['black'], // todo: based on theme
        domain: extent(demoData, cloudAccessor) as [number, number]
      }),
    []
  );

  const dots = useMemo(
    () =>
      demoData.map((d) => (
        <Circle
          key={d.date}
          fill={cloudsColorScale(cloudAccessor(d))}
          cx={xScale(xAccessor(d))}
          cy={yScale(yAccessor(d))}
          r={5}
        />
      )),
    [xScale, yScale, cloudsColorScale]
  );

  const axisLeftLabel = (
    <Text textAnchor="middle" verticalAnchor="end" angle={-90} y={boundedHeight / 2} x={0} dx={-50}>
      Relative humidity
    </Text>
  );

  const axisBottomLabel = (
    <Text textAnchor="middle" verticalAnchor="start" y={boundedHeight} x={boundedWidth / 2} dy={30}>
      Dew point (°F)
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
        <title>Scatterplot looking at the relation between relative humidity and dew point</title>
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

interface TooltipData {
  dewPoint?: number;
  date?: Date;
}

interface Props2 {
  left: number;
  top: number;
  data?: TooltipData;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data = {}, isTooltipOpen }: Props2) {
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
      <span>
        <span>
          <span role="img" aria-label="date">
            📅
          </span>{' '}
          date:{' '}
        </span>
        {data.date &&
          new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short'
          }).format(data.date)}
      </span>
      <span>
        <span>
          <span role="img" aria-label="temperature">
            💧
          </span>{' '}
          dew point:{' '}
        </span>
        {data.dewPoint}
      </span>
    </TooltipWithBounds>
  );
}

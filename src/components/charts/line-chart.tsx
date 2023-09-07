import { useEffect, useMemo, useState, TouchEvent, MouseEvent, Fragment } from 'react';
import useScreenSize from 'src/hooks/useScreenSize';
import { secondaryBgColor, secondaryTextColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from './chart-box';
import { format } from 'date-fns';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { extent } from 'd3';
import { scaleLinear, scaleTime } from '@visx/scale';
import { LinePath, Circle } from '@visx/shape';
import { ChartDimensions } from './chart-utils';
import { AnimatedAxis, AnimatedGridRows } from '@visx/react-spring';
import { useTheme } from 'next-themes';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { Group } from '@visx/group';
import { voronoi } from '@visx/voronoi';
import { localPoint } from '@visx/event';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { nFormatter } from 'src/utils';

export interface DataPoint {
  id: string;
  dataSetId: string;
  x: number;
  y: number;
}

type AxisType = 'DATE' | 'LINEAR';

export interface DataSet {
  id: string;
  yUnits: string;
  dataPoints: DataPoint[];
  name: string;
  color: string;
  showUnits: boolean;
}

interface LineChartProps {
  title: string;
  subTitle: string;
  dataSets: DataSet[];
  xAxisType: AxisType;
  children?: React.ReactNode;
}

function Chart({
  width,
  height,
  dataSets: dataSets,
  xAxisType
}: {
  width: number;
  height: number;
  dataSets: DataSet[];
  xAxisType: AxisType;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMouseMove = (event: any) => {
      setMousePos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<DataPoint>({
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: {
      id: '',
      dataSetId: '',
      x: 0,
      y: 0
    }
  });
  const [tooltipDataSet, setTooltipDataSet] = useState<DataSet | null>(null);
  useEffect(() => {
    if (!tooltipData) {
      setTooltipDataSet(null);
      return;
    }
    const dataSet = dataSets.find((item) => item.id === tooltipData.dataSetId);
    setTooltipDataSet(dataSet ?? null);
  }, [tooltipData]);

  const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }): ChartDimensions => {
    const margin = {
      top: 10,
      right: 0,
      bottom: 50,
      left: 45
    };

    return {
      margin,
      boundedWidth: width - margin.left - margin.right,
      boundedHeight: height - margin.top - margin.bottom
    };
  };

  const { margin, boundedWidth, boundedHeight } = getChartDimensions({
    width,
    height
  });

  const yAccessor = (datum: DataPoint) => datum.y;
  const xAccessor = (datum: DataPoint) => {
    switch (xAxisType) {
      case 'DATE': {
        return new Date(datum.x);
      }
      default: {
        return datum.x;
      }
    }
  };

  const xScale = useMemo(() => {
    switch (xAxisType) {
      case 'LINEAR': {
        return scaleLinear<number>({
          domain: extent(dataSets.map((item) => item.dataPoints).flat(), xAccessor) as [number, number],
          range: [0, boundedWidth],
          nice: true
        });
      }
      case 'DATE': {
        return scaleTime<number>({
          range: [0, boundedWidth],
          domain: extent(dataSets.map((item) => item.dataPoints).flat(), xAccessor) as [Date, Date],
          nice: true
        });
      }
    }
  }, [dataSets, boundedHeight, xAxisType]);

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [boundedHeight, 0],
        domain: extent(dataSets.map((item) => item.dataPoints).flat(), yAccessor) as [number, number],
        nice: true
      }),
    [dataSets, boundedHeight]
  );

  const voronoiLayout = useMemo(() => {
    return voronoi<DataPoint>({
      x: (d) => xScale(xAccessor(d)),
      y: (d) => yScale(yAccessor(d)),
      width: boundedWidth,
      height: boundedHeight
    })(dataSets.map((item) => item.dataPoints).flat());
  }, [boundedWidth, boundedHeight, xScale, yScale]);

  const getClosestPoint = (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
    const point = localPoint(e);
    if (!point) {
      return hideTooltip();
    }

    const { x, y } = point;
    const neighborRadius = 20;
    const closest = voronoiLayout.find(x - margin.left, y - margin.top, neighborRadius);

    return closest;
  };

  const handleMouseMove = (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
    const closest = getClosestPoint(e);
    if (!closest) {
      return;
    }
    showTooltip({
      tooltipLeft: mousePos.x,
      tooltipTop: mousePos.y,
      tooltipData: {
        ...closest.data
      }
    });
  };

  const dots = useMemo(() => {
    return (
      <>
        {dataSets.map((dataSet) => {
          return (
            <Fragment key={dataSet.id}>
              <LinePath
                data={dataSet.dataPoints}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke={dataSet.color}
                strokeWidth={1}
              />
              {dataSet.dataPoints.map((d: DataPoint) => (
                <Circle
                  key={d.id}
                  fill={dataSet.color}
                  cx={xScale(xAccessor(d))}
                  cy={yScale(yAccessor(d))}
                  r={4}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </Fragment>
          );
        })}
      </>
    );
  }, [xScale, yScale, dataSets]);

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];

  return (
    <div>
      <svg
        onTouchStart={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => hideTooltip()}
        width={width}
        height={height}
        style={{ transition: 'all 0.7s ease-in-out' }}
      >
        <Group top={margin.top} left={margin.left}>
          <AnimatedGridRows
            scale={yScale}
            width={boundedWidth}
            stroke={themeToUse.disabledFade}
            strokeDasharray="6,6"
            numTicks={6}
          />
          <AnimatedAxis
            orientation="left"
            numTicks={5}
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickLabelProps={() => ({
              fill: themeToUse.disabled,
              fontWeight: 700,
              fontSize: 12,
              textAnchor: 'end',
              verticalAnchor: 'middle'
            })}
          />
          <AnimatedAxis
            orientation="bottom"
            numTicks={5}
            top={boundedHeight}
            hideAxisLine={true}
            hideTicks={true}
            scale={xScale}
            tickLabelProps={() => ({
              fill: themeToUse.disabled,
              fontWeight: 700,
              fontSize: 12,
              textAnchor: 'middle'
            })}
          />
          {dots}
        </Group>
      </svg>
      <TooltipWithBounds
        key={tooltipOpen ? 1 : 0} // needed for bounds to update correctly
        style={{
          ...defaultStyles,
          background: 'none',
          zIndex: 100,
          borderRadius: 9,
          padding: 0,
          opacity: tooltipOpen ? 1 : 0,
          transition: 'all 0.1s ease-out'
        }}
        left={tooltipLeft}
        top={tooltipTop}
      >
        <div className={twMerge(secondaryBgColor, textColor, 'flex flex-col p-2 rounded-lg')}>
          <div className={twMerge('flex flex-row space-x-3')}>
            <div className="flex flex-col space-y-1">
              <div className={twMerge('font-medium text-xs', secondaryTextColor)}>{tooltipDataSet?.name}</div>
              <div className="truncate">{`${nFormatter(tooltipData?.y, 2)} ${
                tooltipDataSet?.showUnits ? tooltipDataSet.yUnits : ''
              }`}</div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Date</div>
              <div className="truncate">{format(new Date(tooltipData?.x ?? 0), 'MMM dd yyyy')}</div>
            </div>
          </div>
        </div>
      </TooltipWithBounds>
    </div>
  );
}

export function LineChart({ dataSets, title, subTitle, children, xAxisType }: LineChartProps) {
  const { isDesktop } = useScreenSize();

  return (
    <ChartBox className="h-full">
      <div className="md:flex justify-between mb-4">
        <div>
          <div className="font-medium mt-3 font-heading text-lg">{title}</div>
          <div className={twMerge(secondaryTextColor, 'font-medium text-sm')}>{subTitle}</div>
        </div>
        {children}
      </div>
      <ParentSize debounceTime={10}>
        {({ width }) => (
          <Chart dataSets={dataSets} width={width} height={isDesktop ? 300 : 270} xAxisType={xAxisType} />
        )}
      </ParentSize>
    </ChartBox>
  );
}

import { NftSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import { LegendItem, LegendLabel, LegendOrdinal } from '@visx/legend';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scaleOrdinal, scaleTime } from '@visx/scale';
import { Circle } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { voronoi } from '@visx/voronoi';
import { extent } from 'd3';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { MouseEvent, TouchEvent, useCallback, useMemo } from 'react';
import { EthSymbol } from 'src/components/common';
import {
  listingDataPointColor,
  bidDataPointColor,
  saleDataPointColor,
  secondaryBgColor,
  secondaryTextColor,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { ChartBox } from './chart-box';
import { SalesAndOrdersDataPointType, ScatterChartType } from './types';

export interface SalesAndOrdersChartData {
  timestamp: number;
  collectionAddress: string;
  collectionName: string;
  tokenId: string;
  tokenImage: string;
  priceEth: number;
  dataType: SalesAndOrdersDataPointType;
}

export interface ResponsiveSalesAndOrdersChartProps extends Omit<SalesAndOrdersChartProps, 'width' | 'height'> {
  graphType: ScatterChartType.SalesAndOrders;
}

interface SalesAndOrdersChartProps {
  width: number;
  height: number;
  saleColor?: string;
  listingColor?: string;
  bidColor?: string;
  data: NftSaleAndOrder[];
}

export const ResponsiveSalesAndOrdersChart = ({ data, graphType }: ResponsiveSalesAndOrdersChartProps) => {
  const ordinalColorScale = scaleOrdinal({
    domain: ['Sale', 'Listing', 'Bid'],
    range: [saleDataPointColor, listingDataPointColor, bidDataPointColor]
  });

  return (
    <ChartBox className="h-full">
      <div className="flex items-center mb-4 space-x-2">
        <div className={twMerge('font-medium')}>{graphType}</div>
        <div className={twMerge('text-xs', secondaryTextColor)}>(Not all bids are shown to reduce noise)</div>
      </div>

      <ParentSize debounceTime={10} style={{ height: '95%' }}>
        {({ width, height }) => (
          <SalesAndOrdersChart
            data={data}
            width={width}
            height={height}
            saleColor={saleDataPointColor}
            listingColor={listingDataPointColor}
            bidColor={bidDataPointColor}
          />
        )}
      </ParentSize>

      <div className="flex flex-row justify-center w-full mt-[-20px]">
        <LegendOrdinal scale={ordinalColorScale} labelFormat={(label) => `${label}`}>
          {(labels) => (
            <div className="flex flex-row items-center">
              {labels.map((label, i) => (
                <LegendItem key={`legend-ordinal-${i}`} margin="0 5px">
                  <svg width={20} height={20}>
                    <Circle fill={label.value} r={5} cx={10} cy={10} />
                  </svg>
                  <LegendLabel margin="10px">{label.text}</LegendLabel>
                </LegendItem>
              ))}
            </div>
          )}
        </LegendOrdinal>
      </div>
    </ChartBox>
  );
};

function SalesAndOrdersChart({ width, height, data, saleColor, listingColor, bidColor }: SalesAndOrdersChartProps) {
  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<NftSaleAndOrder>({
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: {
      timestamp: 0,
      priceEth: 0,
      dataType: 'Sale'
    }
  });

  const getChartDimensions = ({ width = 0, height = 0 }: { width?: number; height?: number }) => {
    const margin = {
      top: 10,
      right: 45,
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

  const yAccessor = (d: NftSaleAndOrder) => d.priceEth;
  const xAccessor = (d: NftSaleAndOrder) => new Date(d.timestamp);

  const xScale = useMemo(
    () =>
      scaleTime<number>({
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
    return voronoi<NftSaleAndOrder>({
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
        tooltipLeft: xScale(xAccessor(closest.data)) + 2 * margin.left,
        tooltipTop: yScale(yAccessor(closest.data)) + 50 * margin.top,
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
    },
    [xScale, yScale, voronoiLayout, voronoiPolygons]
  );

  const dots = useMemo(
    () =>
      data.map((d) => {
        if (d.dataType === 'Sale') {
          return (
            <Circle
              key={`${d.timestamp}:${d.dataType}:${d.priceEth}`}
              fill={saleColor}
              cx={xScale(xAccessor(d))}
              cy={yScale(yAccessor(d))}
              r={5}
            />
          );
        } else if (d.dataType === 'Listing') {
          return (
            <Circle
              key={`${d.timestamp}:${d.dataType}:${d.priceEth}`}
              fill={listingColor}
              cx={xScale(xAccessor(d))}
              cy={yScale(yAccessor(d))}
              r={5}
            />
          );
        } else if (d.dataType === 'Offer') {
          return (
            <Circle
              key={`${d.timestamp}:${d.dataType}:${d.priceEth}`}
              fill={bidColor}
              cx={xScale(xAccessor(d))}
              cy={yScale(yAccessor(d))}
              r={5}
            />
          );
        }
      }),
    [xScale, yScale]
  );

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const themeToUse = tailwindConfig.colors[darkMode ? 'dark' : 'light'];

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
          <GridRows
            scale={yScale}
            width={boundedWidth}
            height={boundedHeight}
            stroke={themeToUse.disabledFade}
            strokeDasharray="6,6"
            numTicks={6}
          />
          <AxisLeft
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
          <AxisBottom
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

      <ToolTip
        isTooltipOpen={tooltipOpen}
        left={tooltipLeft}
        top={tooltipTop}
        data={tooltipData}
        saleColor={saleColor}
        listingColor={listingColor}
        bidColor={bidColor}
      />
    </div>
  );
}

interface Props2 {
  left: number;
  top: number;
  data?: NftSaleAndOrder;
  saleColor?: string;
  listingColor?: string;
  bidColor?: string;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data, saleColor, listingColor, bidColor, isTooltipOpen }: Props2) {
  const circleColor = () => {
    const dataType = data?.dataType;
    if (dataType === 'Sale') {
      return saleColor;
    } else if (dataType === 'Listing') {
      return listingColor;
    } else if (dataType === 'Offer') {
      return bidColor;
    }
  };

  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        background: 'none',
        borderRadius: 9,
        padding: 0,
        opacity: isTooltipOpen ? 1 : 0,
        transition: 'all 0.1s ease-out'
      }}
      left={left}
      top={top}
    >
      <div className={twMerge(secondaryBgColor, textColor, 'flex flex-col p-2 space-y-2 rounded-lg')}>
        <div className={twMerge('flex flex-row space-x-1 items-center ml-[-5px]')}>
          <svg width={20} height={20}>
            <Circle fill={circleColor()} r={5} cx={10} cy={10} />
          </svg>
          <div>{data?.dataType}</div>
        </div>

        <div className={twMerge('flex flex-row space-x-3')}>
          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Price</div>
            <div className="truncate">
              {data?.priceEth} {EthSymbol}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Date</div>
            <div className="truncate">{format(new Date(data?.timestamp ?? 0), 'MMM dd yyyy')}</div>
          </div>
        </div>
      </div>
    </TooltipWithBounds>
  );
}

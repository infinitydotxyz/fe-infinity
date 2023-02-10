import { HistoricalSalesTimeBucket } from '@infinityxyz/lib-frontend/types/core';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { AnimatedAxis, AnimatedGridRows } from '@visx/react-spring';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Circle } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { voronoi } from '@visx/voronoi';
import { extent } from 'd3';
import { format } from 'date-fns';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { MouseEvent, TouchEvent, useEffect, useMemo, useState } from 'react';
import { ASwitchButton } from 'src/components/astra/astra-button';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { EZImage } from 'src/components/common';
import { BasicTokenInfo } from 'src/utils/types';
import { secondaryBgColor, secondaryTextColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import tailwindConfig from '../../settings/tailwind/elements/foundations';
import { ChartBox } from './chart-box';
import { ChartDimensions } from './chart-utils';
import { ScatterChartType } from './types';

export interface SalesChartData {
  timestamp: number;
  collectionAddress: string;
  collectionName: string;
  tokenId: string;
  tokenImage: string;
  salePrice: number;
}

interface ResponsiveSalesChartProps extends Omit<SalesChartProps, 'width' | 'height'> {
  graphType: ScatterChartType.Sales;
}

interface SalesChartProps {
  width: number;
  height: number;
  data: SalesChartData[];
  hideOutliers?: boolean;
}

export const ResponsiveSalesChart = ({ data, graphType }: ResponsiveSalesChartProps) => {
  const [selectedTimeBucket, setSelectedTimeBucket] = useState(HistoricalSalesTimeBucket.ONE_MONTH);
  const [showOutliers, setShowOutliers] = useState(false);
  const [numSales, setNumSales] = useState(data.length);
  const [chartData, setChartData] = useState<SalesChartData[]>(data);

  useEffect(() => {
    const nowTimestamp = Date.now();
    let prevTimestamp = nowTimestamp;
    switch (selectedTimeBucket) {
      case HistoricalSalesTimeBucket.ONE_HOUR:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60;
        break;
      case HistoricalSalesTimeBucket.SIX_HOURS:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 6;
        break;
      case HistoricalSalesTimeBucket.ONE_DAY:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24;
        break;
      case HistoricalSalesTimeBucket.TWO_DAYS:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 2;
        break;
      case HistoricalSalesTimeBucket.ONE_WEEK:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 7;
        break;
      case HistoricalSalesTimeBucket.ONE_MONTH:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 30;
        break;
      default:
        break;
    }

    const filteredData = data.filter((v) => v.timestamp >= prevTimestamp);
    setChartData(filteredData);
    setNumSales(filteredData.length);
  }, [selectedTimeBucket]);

  return (
    <ChartBox className="h-full">
      <div className="flex justify-between mb-4">
        <div className="ml-5">
          <div className="font-medium mt-3 font-heading text-lg">{graphType}</div>
          <div className={twMerge(secondaryTextColor, 'font-medium text-sm')}>{numSales} sales</div>
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
            label={selectedTimeBucket}
            items={Object.values(HistoricalSalesTimeBucket).map((bucket) => ({
              label: bucket,
              onClick: () => setSelectedTimeBucket(bucket)
            }))}
          />
        </div>
      </div>

      <ParentSize debounceTime={10}>
        {({ width }) => (
          <SalesChart
            key={`${selectedTimeBucket}-${showOutliers}`}
            data={chartData}
            width={width}
            height={300}
            hideOutliers={!showOutliers}
          />
        )}
      </ParentSize>
    </ChartBox>
  );
};

function SalesChart({ width, height, data, hideOutliers }: SalesChartProps) {
  const [selectedSale, setSelectedSale] = useState<SalesChartData>();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
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

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: selectedSale?.tokenId ?? '',
    collectionAddress: selectedSale?.collectionAddress ?? '',
    chainId: '1' // todo dont hardcode
  };

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<SalesChartData>({
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: {
      timestamp: 0,
      collectionAddress: '',
      collectionName: '',
      tokenId: '',
      tokenImage: '',
      salePrice: 0
    }
  });

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

  let dataToRender = data;
  const values = dataToRender.map((d) => d.salePrice).sort((a, b) => a - b);
  if (hideOutliers) {
    const lowerHalfMedian = values[Math.floor(values.length / 4)];
    const upperHalfMedian = values[Math.floor((values.length * 3) / 4)];
    const iqr = upperHalfMedian - lowerHalfMedian;
    const lowerThreshold = lowerHalfMedian - 1.5 * iqr;
    const upperThreshold = upperHalfMedian + 1.5 * iqr;
    dataToRender = dataToRender.filter((v) => v.salePrice >= lowerThreshold && v.salePrice <= upperThreshold);
  }

  const yAccessor = (d: SalesChartData) => d.salePrice;
  const xAccessor = (d: SalesChartData) => new Date(d.timestamp);

  const xScale = useMemo(
    () =>
      scaleTime<number>({
        range: [0, boundedWidth],
        domain: extent(dataToRender, xAccessor) as [Date, Date],
        nice: true
      }),
    [boundedWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [boundedHeight, 0],
        domain: extent(dataToRender, yAccessor) as [number, number],
        nice: true
      }),
    [boundedHeight]
  );

  const voronoiLayout = useMemo(() => {
    return voronoi<SalesChartData>({
      x: (d) => xScale(xAccessor(d)),
      y: (d) => yScale(yAccessor(d)),
      width: boundedWidth,
      height: boundedHeight
    })(dataToRender);
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

  const handleMouseClick = (e: TouchEvent<SVGSVGElement> | MouseEvent<SVGSVGElement>) => {
    const closest = getClosestPoint(e);
    if (!closest) {
      return;
    }
    const { pathname, query } = router;
    query['tokenId'] = closest.data.tokenId;
    query['collectionAddress'] = closest.data.collectionAddress;
    router.replace({ pathname, query }, undefined, { shallow: true });
    setSelectedSale(closest.data);
  };

  const dots = useMemo(
    () =>
      dataToRender.map((d) => (
        <Circle
          key={`${d.timestamp}:${d.tokenId}:${d.salePrice}`}
          fill={tailwindConfig.colors.brand.primaryFade}
          cx={xScale(xAccessor(d))}
          cy={yScale(yAccessor(d))}
          r={5}
          style={{ cursor: 'pointer' }}
        />
      )),
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

      <ToolTip isTooltipOpen={tooltipOpen} left={tooltipLeft} top={tooltipTop} data={tooltipData} />
      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
    </div>
  );
}

interface Props2 {
  left: number;
  top: number;
  data?: SalesChartData;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data, isTooltipOpen }: Props2) {
  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        background: 'none',
        zIndex: 100,
        borderRadius: 9,
        padding: 0,
        opacity: isTooltipOpen ? 1 : 0,
        transition: 'all 0.1s ease-out'
      }}
      left={left}
      top={top}
    >
      <div
        className={twMerge(secondaryBgColor, textColor, 'flex flex-col p-2 rounded-lg')}
        style={{ aspectRatio: '3.5 / 5' }}
      >
        <div className="flex-1 rounded-lg overflow-clip">
          <EZImage src={data?.tokenImage} />
        </div>

        <div className="truncate py-2">{data?.tokenId}</div>

        <div className={twMerge('flex flex-row space-x-3')}>
          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Sale price</div>
            <div className="truncate">{data?.salePrice}</div>
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

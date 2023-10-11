import { HistoricalSalesTimeBucket } from '@infinityxyz/lib-frontend/types/core';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { AnimatedAxis, AnimatedGridColumns, AnimatedGridRows } from '@visx/react-spring';
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
import { EthSymbol, EZImage } from 'src/components/common';
import { ellipsisString } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { BasicTokenInfo } from 'src/utils/types';
import {
  chartAxisLabelDarkColor,
  chartAxisLabelLightColor,
  gridDarkColor,
  gridLightColor,
  saleDataPointDarkColor,
  saleDataPointLightColor,
  secondaryBgColor,
  secondaryTextColor,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { ChartDimensions } from './chart-utils';
import { ScatterChartType } from './types';
import useScreenSize from 'src/hooks/useScreenSize';

export interface SalesChartData {
  id: string;
  timestamp: number;
  collectionAddress: string;
  collectionSlug: string;
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
  const { isDesktop } = useScreenSize();

  const { theme } = useTheme();
  const darkMode = theme === 'dark';

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
  }, [selectedTimeBucket, data]);

  return (
    <div className="h-full">
      <div className="xl:flex justify-between py-5 items-center">
        <div className="flex items-end gap-1">
          <div className={twMerge('font-medium font-heading text-xl', darkMode ? 'text-white' : 'text-neutral-200')}>
            {graphType}
          </div>
          <div className={twMerge(secondaryTextColor, 'font-medium text-sm !text-neutral-100')}>{numSales} sales</div>
        </div>

        <div className="items-center flex gap-[10px]">
          <div className="flex items-center space-x-[10px]">
            <span className={twMerge('text-sm font-medium !text-neutral-200 dark:!text-white')}>Outliers</span>

            <ASwitchButton
              checked={showOutliers}
              onChange={() => {
                setShowOutliers(!showOutliers);
              }}
            ></ASwitchButton>
          </div>

          <ADropdown
            hasBorder={false}
            alignMenuRight
            innerClassName="w-[100px]"
            menuItemClassName="py-1 px-2"
            menuButtonClassName="py-1 px-[10px]"
            label={selectedTimeBucket}
            className="py-0 px-0"
            menuParentButtonClassName="px-0 py-0 border border-light-customBorder dark:border-dark-customBorder rounded h-[32px]"
            items={Object.values(HistoricalSalesTimeBucket).map((bucket) => ({
              label: bucket,
              onClick: () => setSelectedTimeBucket(bucket)
            }))}
          />
        </div>
      </div>

      <div className="rounded-lg bg-neutral-4000 dark:bg-neutral-900 pt-5 px-2.5">
        <ParentSize debounceTime={10}>
          {({ width }) => (
            <SalesChart
              key={`${selectedTimeBucket}-${showOutliers}-${chartData.length}`}
              data={[
                {
                  id: '0',
                  timestamp: new Date().getTime(),
                  collectionAddress: '0',
                  collectionSlug: '0',
                  collectionName: '0',
                  tokenId: '0',
                  tokenImage: '0',
                  salePrice: 0
                },
                ...chartData
              ]}
              width={width}
              height={isDesktop ? 576 : 270}
              hideOutliers={!showOutliers}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

function SalesChart({ width, height, data, hideOutliers }: SalesChartProps) {
  const [selectedSale, setSelectedSale] = useState<SalesChartData>();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

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
    collectionSlug: selectedSale?.collectionSlug ?? '',
    chainId
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
      id: '',
      timestamp: 0,
      collectionAddress: '',
      collectionSlug: '',
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

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const dots = useMemo(
    () =>
      dataToRender.map((d: SalesChartData) => (
        <Circle
          key={d.id}
          fill={darkMode ? saleDataPointDarkColor : saleDataPointLightColor}
          cx={xScale(xAccessor(d))}
          cy={yScale(yAccessor(d))}
          r={7.5}
          style={{ cursor: 'pointer' }}
        />
      )),
    [xScale, yScale, darkMode]
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
        style={{ transition: 'all 0.7s ease-in-out' }}
      >
        <Group top={margin.top} left={margin.left}>
          <AnimatedGridRows scale={yScale} width={boundedWidth} stroke={darkMode ? gridDarkColor : gridLightColor} />
          <AnimatedGridColumns
            scale={xScale}
            height={boundedHeight}
            stroke={darkMode ? gridDarkColor : gridLightColor}
          />
          <AnimatedAxis
            orientation="left"
            numTicks={10}
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickLabelProps={() => ({
              fill: darkMode ? chartAxisLabelDarkColor : chartAxisLabelLightColor,
              fontWeight: 400,
              fontSize: 12,
              textAnchor: 'end',
              verticalAnchor: 'middle'
            })}
          />
          <AnimatedAxis
            orientation="bottom"
            numTicks={4}
            top={boundedHeight}
            hideAxisLine={true}
            hideTicks={true}
            scale={xScale}
            tickLabelProps={() => ({
              fill: darkMode ? chartAxisLabelDarkColor : chartAxisLabelLightColor,
              fontWeight: 400,
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

        <div className="truncate py-2">{ellipsisString(data?.tokenId)}</div>

        <div className={twMerge('flex flex-row space-x-3')}>
          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Sale price</div>
            <div className="truncate">
              {data?.salePrice} {EthSymbol}
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

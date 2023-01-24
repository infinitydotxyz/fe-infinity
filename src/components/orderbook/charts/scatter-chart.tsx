import { AxisBottom, AxisLeft } from '@visx/axis';
import { localPoint } from '@visx/event';
import { GridRows } from '@visx/grid';
import { Group } from '@visx/group';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { scaleLinear, scaleTime } from '@visx/scale';
import { Circle } from '@visx/shape';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { voronoi } from '@visx/voronoi';
import { extent } from 'd3';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { MouseEvent, TouchEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { TokenCardModal } from 'src/components/astra/token-grid/token-card-modal';
import { EZImage } from 'src/components/common';
import { BasicTokenInfo } from 'src/utils/types';
import { cardColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ChartBox } from './chart-box';
import { getChartDimensions } from './chart-utils';

export enum ScatterChartType {
  Sales = 'Sales'
}

export enum TimeBuckets {
  ONE_HOUR = '1h',
  ONE_DAY = '1d',
  ONE_WEEK = '7d',
  ONE_MONTH = '30d',
  ONE_YEAR = '1y'
}

export interface SaleData {
  timestamp: number;
  collectionAddress: string;
  collectionName: string;
  tokenId: string;
  tokenImage: string;
  salePrice: number;
}

export interface ResponsiveScatterChartProps extends Omit<ScatterChartProps, 'width' | 'height'> {
  selectedTimeBucket: string;
  fetchData: (timeBucket: string) => void;
  graphType: ScatterChartType;
}

interface ScatterChartProps {
  width: number;
  height: number;
  data: SaleData[];
}

export const ResponsiveScatterChart = ({
  data,
  graphType,
  selectedTimeBucket,
  fetchData
}: ResponsiveScatterChartProps) => {
  return (
    <ChartBox className="h-full">
      <div className="flex justify-between mb-4">
        <div className="ml-5 font-bold mt-3">{graphType}</div>
        <select
          onChange={(e) => fetchData(e.target.value)}
          className={twMerge('form-select rounded-lg bg-transparent focus:border-none float-right', textColor)}
        >
          {Object.values(TimeBuckets).map((filter) => (
            <option value={filter} selected={filter === selectedTimeBucket}>
              {filter}
            </option>
          ))}
        </select>
      </div>
      <ParentSize debounceTime={10}>
        {({ width, height }) => <ScatterChart data={data} width={width} height={height} />}
      </ParentSize>
    </ChartBox>
  );
};

function ScatterChart({ width, height, data }: ScatterChartProps) {
  const [selectedSale, setSelectedSale] = useState<SaleData>();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

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
  } = useTooltip<SaleData>({
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

  const { margin, boundedWidth, boundedHeight } = getChartDimensions({
    width,
    height
  });

  const yAccessor = (d: SaleData) => d.salePrice;
  const xAccessor = (d: SaleData) => new Date(d.timestamp);

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
      const { pathname, query } = router;
      query['tokenId'] = closest.data.tokenId;
      query['collectionAddress'] = closest.data.collectionAddress;
      router.replace({ pathname, query }, undefined, { shallow: true });
      setSelectedSale(closest.data);
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

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: selectedSale?.tokenId ?? '',
    collectionAddress: selectedSale?.collectionAddress ?? '',
    chainId: '1' // todo dont hardcode
  };

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
            stroke="#777"
            strokeDasharray="6,6"
            numTicks={6}
          />
          <AxisLeft
            numTicks={5}
            hideAxisLine={true}
            hideTicks={true}
            scale={yScale}
            tickLabelProps={() => ({
              fontSize: 14,
              textAnchor: 'end',
              verticalAnchor: 'middle',
              x: -20
            })}
          />
          <AxisBottom
            numTicks={5}
            top={boundedHeight}
            hideAxisLine={true}
            hideTicks={true}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 14,
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
      <div className={twMerge(cardColor, textColor, 'flex flex-col p-1')} style={{ aspectRatio: '3.5 / 5' }}>
        <div className="flex-1 rounded-lg overflow-clip">
          <EZImage src={data?.tokenImage} />
        </div>

        <div className="font-bold truncate ml-1 mt-1">{data?.tokenId}</div>

        <div className={twMerge(textColor, 'flex flex-row space-x-3 m-1')}>
          <div className="flex flex-col">
            <div className="truncate">Sale price</div>
            <div className="truncate">{data?.salePrice}</div>
          </div>
          <div className="flex flex-col">
            <div className="truncate">Date</div>
            <div className="truncate">{format(new Date(data?.timestamp ?? 0), 'MMM dd yyyy')}</div>
          </div>
        </div>
      </div>
    </TooltipWithBounds>
  );
}

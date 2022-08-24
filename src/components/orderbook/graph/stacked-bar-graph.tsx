import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Orientation } from '@visx/axis';
import { TextProps } from '@visx/text';
import { AnimatedAxis } from '@visx/react-spring';
import { useTooltip, defaultStyles, useTooltipInPortal } from '@visx/tooltip';
import { numStr } from 'src/utils';
import { RoundRectBar } from './round-rect-bar';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import {
  axisLineColor,
  barColorLight,
  barColorSolid,
  GraphData,
  orangeColor,
  orangeTextColor,
  textColor
} from './graph-utils';

type BarGraphData = {
  listings: GraphData[];
  offers: GraphData[];
  axisLabel: string;
  listingsTooltip: TooltipData;
  offersTooltip: TooltipData;
  start: number;
  end: number;
};

class TooltipData {
  lineOne: string;
  lineTwo: string;

  constructor(lineOne: string, lineTwo: string) {
    this.lineOne = lineOne;
    this.lineTwo = lineTwo;
  }

  content = () => {
    return (
      <>
        <div className="mb-2">
          <strong>{this.lineOne}</strong>
        </div>
        <div>{this.lineTwo}</div>
      </>
    );
  };
}

const tooltipStyles = {
  ...defaultStyles,

  minWidth: 60,
  backgroundColor: 'rgba(255,255,255,.9)',
  fontSize: '20px',

  color: 'black'
};

// accessors
const getPriceValue = (d: GraphData) => d.price;
const getCountValue = (d: BarGraphData) => d.listings.length + d.offers.length;
const getOffersCount = (d: BarGraphData) => d.offers.length;
const getListingsCount = (d: BarGraphData) => d.listings.length;

const barData = (data: GraphData[], width: number): BarGraphData[] => {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return [];
  }

  const newData: BarGraphData[] = [];
  const columns = Math.ceil(width / columnWidth);
  const values = data.map(getPriceValue);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values) + 0.05;
  const range = (maxPrice - minPrice) / columns;

  for (let i = 0; i < columns; i++) {
    newData.push({
      offers: [],
      listings: [],
      axisLabel: numStr(minPrice + i * range),
      offersTooltip: new TooltipData('', ''),
      listingsTooltip: new TooltipData('', ''),
      start: minPrice + i * range,
      end: minPrice + (i + 1) * range
    });
  }

  for (const item of data) {
    const i = Math.floor((item.price - minPrice) / range);

    if (item.isSellOrder) {
      newData[i].listings.push(item);
    } else {
      newData[i].offers.push(item);
    }
  }

  // set tooltip using count
  for (const item of newData) {
    item.listingsTooltip = new TooltipData(
      `${item.listings.length} listings`,
      `${numStr(item.start)}  to  ${numStr(item.end)}`
    );
    item.offersTooltip = new TooltipData(
      `${item.offers.length} offers`,
      `${numStr(item.start)}  to  ${numStr(item.end)}`
    );
  }

  return newData;
};

// =====================================================================

type Props = {
  data: GraphData[];
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
};

export function StackedBarGraph({ data, onClick, onSelection }: Props) {
  if (data.length > 0) {
    return (
      <ParentSize debounceTime={10}>
        {({ width }) => {
          return (
            <_StackedBarGraph
              graphData={data}
              width={width}
              height={620}
              onClick={onClick}
              onSelection={(orders, index) => onSelection(orders, index)}
            />
          );
        }}
      </ParentSize>
    );
  }

  return <></>;
}

// =====================================================================

type Props2 = {
  graphData: GraphData[];
  width: number;
  height: number;
  onClick: (minPrice: string, maxPrice: string) => void;
  onSelection: (orders: SignedOBOrder[], index: number) => void;
};

function _StackedBarGraph({ graphData, width: outerWidth, height: outerHeight, onClick, onSelection }: Props2) {
  const margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 80
  };

  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  const [data, setData] = useState<BarGraphData[]>([]);

  useEffect(() => {
    setData(barData(graphData, width));
  }, [graphData, outerWidth]);

  const tickLabelProps = () =>
    ({
      fill: textColor,
      fontSize: 16,
      fontFamily: 'sans-serif',
      textAnchor: 'middle',
      dy: 6
    } as const);

  const vertTickLabelProps = () =>
    ({
      fill: textColor,
      fontSize: 16,
      dx: -10,
      fontFamily: 'sans-serif',
      textAnchor: 'end',
      verticalAnchor: 'middle'
    } as const);

  const labelProps: Partial<TextProps> = {
    fill: orangeTextColor,
    fontSize: 20,
    fontFamily: 'sans-serif',
    textAnchor: 'middle'
  };

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();
  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: false
  });

  const axisLabels = data.map((d) => d.axisLabel);
  const countAxisLabels = data.map((d) => getCountValue(d));

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, width],
        round: true,
        domain: axisLabels,
        padding: 0.5
      }),
    [width, data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, Math.max(...data.map(getCountValue))]
      }),
    [height, data]
  );

  const barMeasurements = (data: BarGraphData, index: number, offers: boolean) => {
    const barHeight = height - (yScale(offers ? getOffersCount(data) : getListingsCount(data)) ?? 0);

    let bColor = offers ? 'url(#offers-bar-gradient)' : 'url(#bar-gradient)';
    let barRadius = 10;
    if (barHeight === 0) {
      barRadius = 0;
      bColor = barColorLight;
    }

    const barWidth = xScale.bandwidth();
    const barX = xScale(axisLabels[index]);
    const barY = height - barHeight;

    return { barY, barX, barWidth, bColor, barRadius, barHeight };
  };

  const stackedBar = (data: BarGraphData, index: number) => {
    const { barY, barX, barWidth, bColor, barRadius, barHeight } = barMeasurements(data, index, true);

    const {
      barY: lbarY,
      barX: lbarX,
      barWidth: lbarWidth,
      bColor: lbColor,
      barRadius: lbarRadius,
      barHeight: lbarHeight
    } = barMeasurements(data, index, false);

    const offerOrders = data.offers.map((x) => x.order);
    const listingOrders = data.listings.map((x) => x.order);

    return (
      <Fragment key={index}>
        <RoundRectBar
          key={`bar-${index}`}
          x={barX}
          y={barY}
          width={barWidth}
          height={Math.max(barHeight, 2)}
          tl={lbarHeight > 0 ? 0 : barRadius}
          tr={lbarHeight > 0 ? 0 : barRadius}
          br={0}
          bl={0}
          fill={bColor}
          onClick={() => {
            onClick(data.start.toString(), data.end.toString());
          }}
          onMouseMove={(event: React.MouseEvent) => {
            const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

            console.log('----------------------------------');
            console.log('containerY');
            console.log(containerY);
          }}
          onMouseEnter={(event: React.MouseEvent) => {
            const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left;
            const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

            onSelection(offerOrders, offerOrders.length - 1);
            showTooltip({
              tooltipLeft: containerX,
              tooltipTop: containerY,
              tooltipData: data.offersTooltip
            });
          }}
          onMouseLeave={() => {
            hideTooltip();
          }}
        />

        {lbarHeight > 0 && (
          <RoundRectBar
            key={`lbar-${index}`}
            x={lbarX}
            y={lbarY - barHeight}
            width={lbarWidth}
            height={lbarHeight}
            tl={lbarRadius}
            tr={lbarRadius}
            br={0}
            bl={0}
            fill={lbColor}
            onClick={() => {
              onClick(data.start.toString(), data.end.toString());
            }}
            onMouseMove={(event: React.MouseEvent) => {
              const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

              console.log('----------------------------------');
              console.log('containerY');
              console.log(containerY);
            }}
            onMouseEnter={(event: React.MouseEvent) => {
              const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left;
              const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

              onSelection(listingOrders, listingOrders.length - 1);

              showTooltip({
                tooltipLeft: containerX,
                tooltipTop: containerY,
                tooltipData: data.listingsTooltip
              });
            }}
            onMouseLeave={() => {
              hideTooltip();
            }}
          />
        )}
      </Fragment>
    );
  };

  return width < 10 ? null : (
    <>
      <svg ref={containerRef} width={outerWidth} height={outerHeight}>
        <LinearGradient from={barColorSolid} to={barColorSolid} toOpacity={0.3} fromOpacity={0.7} id="bar-gradient" />
        <LinearGradient
          from={orangeColor}
          to={orangeColor}
          toOpacity={0.3}
          fromOpacity={0.7}
          id="offers-bar-gradient"
        />

        <Group transform={`translate(${margin.left},${margin.top})`}>
          <AnimatedAxis
            key={`axis-center`}
            orientation={Orientation.bottom}
            top={height + 2}
            scale={xScale}
            tickFormat={(v) => `${v}`}
            stroke={axisLineColor}
            tickStroke={textColor}
            tickLineProps={{ strokeWidth: 1, opacity: 0.6, transform: 'translate(0,0)' }}
            hideAxisLine={true}
            tickLabelProps={tickLabelProps}
            tickValues={axisLabels}
            label="Price in ETH"
            labelProps={labelProps}
            labelOffset={20}
            animationTrajectory="center"
          />

          {data.map((d, index) => {
            return stackedBar(d, index);
          })}

          <AnimatedAxis
            key={`axis-vert`}
            orientation={Orientation.left}
            top={4}
            scale={yScale}
            tickFormat={(v) => `${v}`}
            stroke={axisLineColor}
            tickStroke={textColor}
            tickLineProps={{ strokeWidth: 1, opacity: 1, transform: 'translate(0,0)' }}
            // hideAxisLine={true}
            tickLabelProps={vertTickLabelProps}
            tickValues={countAxisLabels}
            label="Number of orders"
            labelProps={labelProps}
            labelOffset={36}
            animationTrajectory="center"
          />

          {data.map((d, index) => {
            return stackedBar(d, index);
          })}
        </Group>
      </svg>

      {tooltipOpen && (
        <TooltipInPortal key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>{(tooltipData as TooltipData).content()}</div>
        </TooltipInPortal>
      )}
    </>
  );
}
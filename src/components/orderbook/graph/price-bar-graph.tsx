import React, { useEffect, useMemo, useState } from 'react';
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
import { GraphData } from './graph-utils';

type BarGraphData = {
  count: number;
  axisLabel: string;
  tooltip: TooltipData;
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

  color: 'black'
};

// accessors
const getPriceValue = (d: GraphData) => d.price;
const getCountValue = (d: BarGraphData) => d.count;

const barData = (data: GraphData[], width: number): BarGraphData[] => {
  const columnWidth = 80;

  if (width < columnWidth || data.length === 0) {
    return [];
  }

  const type = data[0].isSellOrder ? 'listings' : 'offers';

  const newData: BarGraphData[] = [];
  const columns = Math.ceil(width / columnWidth);
  const values = data.map(getPriceValue);
  const minPrice = Math.min(...values);
  const maxPrice = Math.max(...values) + 0.05;
  const range = (maxPrice - minPrice) / columns;

  for (let i = 0; i < columns; i++) {
    newData.push({
      count: 0,
      axisLabel: numStr(minPrice + i * range),
      tooltip: new TooltipData('', ''),
      start: minPrice + i * range,
      end: minPrice + (i + 1) * range
    });
  }

  for (const item of data) {
    const i = Math.floor((item.price - minPrice) / range);

    newData[i].count = newData[i].count + 1;
  }

  // set tooltip using count
  for (const item of newData) {
    item.tooltip = new TooltipData(`${item.count} ${type}`, `${numStr(item.start)}  to  ${numStr(item.end)}`);
  }

  return newData;
};

// =====================================================================

type Props = {
  data: GraphData[];
  title: string;
  flip: boolean;
  onClick: (minPrice: string, maxPrice: string) => void;
};

export function PriceBarGraph({ data, title, flip, onClick }: Props) {
  if (data.length > 0) {
    return (
      <ParentSize>
        {({ width }) => {
          return (
            <_PriceBarGraph graphData={data} title={title} flip={flip} width={width} height={120} onClick={onClick} />
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
  title: string;
  width: number;
  height: number;
  flip: boolean;
  onClick: (minPrice: string, maxPrice: string) => void;
};

function _PriceBarGraph({ graphData, title, flip, width: outerWidth, height: outerHeight, onClick }: Props2) {
  const gap = 4;
  const margin = {
    top: flip ? 30 : gap,
    right: 40,
    bottom: flip ? gap : 30,
    left: 140
  };

  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  const [data, setData] = useState<BarGraphData[]>([]);

  useEffect(() => {
    setData(barData(graphData, width));
  }, [graphData, outerWidth]);

  // const offerColor = '255, 113, 243';
  const listingColor = '23, 203, 255';
  const offerColor = '23, 203, 255';
  const barColorSolid = flip ? `rgba(${listingColor}, 1)` : `rgba(${offerColor}, 1)`;
  const barColor = flip ? `rgba(${listingColor}, .9)` : `rgba(${offerColor}, .9)`;
  const textColor = flip ? `rgba(${listingColor}, .6)` : `rgba(${offerColor}, .6)`;
  const barColorLight = flip ? `rgba(${listingColor}, .5)` : `rgba(${offerColor}, .5)`;
  const barColorBG = flip ? `rgba(${listingColor}, .1)` : `rgba(${offerColor}, .1)`;

  const tickLabelProps = () =>
    ({
      fill: textColor,
      fontSize: 14,
      fontFamily: 'sans-serif',
      textAnchor: 'middle'
    } as const);

  const labelProps: Partial<TextProps> = {
    fill: textColor,
    fontSize: 14,
    fontFamily: 'sans-serif',
    textAnchor: 'middle'
  };

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();
  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: false
  });

  const axisLabels = data.map((d) => d.axisLabel);

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

  return width < 10 ? null : (
    <>
      <svg ref={containerRef} width={outerWidth} height={outerHeight}>
        <LinearGradient
          from={barColorSolid}
          to={barColorSolid}
          toOpacity={1}
          fromOpacity={0.8}
          id="bar-gradient-flipped"
        />
        <LinearGradient from={barColorSolid} to={barColorSolid} toOpacity={0.8} fromOpacity={1} id="bar-gradient" />

        <rect width={margin.left} y={flip ? 0 : gap} height={outerHeight - gap} fill={barColorBG} rx={6} />
        <text
          fill={barColor}
          dominantBaseline="central"
          fontSize="26"
          textAnchor="middle"
          x={margin.left / 2}
          y={outerHeight / 3}
        >
          {graphData.length.toString()}
        </text>
        <text
          fill={barColorLight}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="22"
          x={margin.left / 2}
          y={outerHeight / 1.6}
        >
          {title}
        </text>

        <Group transform={`translate(${margin.left},${margin.top})`}>
          <AnimatedAxis
            key={`axis-center`}
            orientation={flip ? Orientation.top : Orientation.bottom}
            top={flip ? -6 : height + 4}
            scale={xScale}
            tickFormat={(v) => `${v}`}
            stroke={textColor}
            tickStroke={textColor}
            tickLineProps={{ strokeWidth: 1, opacity: 0.6, transform: flip ? 'translate(0,2)' : 'translate(0,0)' }}
            hideAxisLine={true}
            tickLabelProps={tickLabelProps}
            tickValues={axisLabels}
            // label="Price in ETH"
            labelProps={labelProps}
            // labelOffset={6}
            animationTrajectory="center"
          />

          {data.map((d, index) => {
            let barHeight = height - (yScale(getCountValue(d)) ?? 0);

            let bColor = flip ? 'url(#bar-gradient-flipped)' : 'url(#bar-gradient)';
            let barRadius = 12;
            if (barHeight === 0) {
              barHeight = 2;
              barRadius = 0;
              bColor = barColorLight;
            }

            const barWidth = xScale.bandwidth();
            const barX = xScale(axisLabels[index]);
            const barY = flip ? 0 : height - barHeight;

            return (
              <RoundRectBar
                key={`bar-${index}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                tl={flip ? 0 : barRadius}
                tr={flip ? 0 : barRadius}
                br={flip ? barRadius : 0}
                bl={flip ? barRadius : 0}
                fill={bColor}
                onClick={() => {
                  onClick(d.start.toString(), d.end.toString());
                }}
                onMouseMove={() => {
                  // nothing
                }}
                onMouseEnter={(event: React.MouseEvent) => {
                  const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left;
                  const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;

                  showTooltip({
                    tooltipLeft: containerX,
                    tooltipTop: containerY,
                    tooltipData: d.tooltip
                  });
                }}
                onMouseLeave={() => {
                  hideTooltip();
                }}
              />
            );
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

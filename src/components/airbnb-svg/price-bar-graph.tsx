import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { scaleBand, scaleLinear } from '@visx/scale';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Orientation } from '@visx/axis';
import { TextProps } from '@visx/text';
import { AnimatedAxis } from '@visx/react-spring';
import { Tooltip, useTooltip, defaultStyles } from '@visx/tooltip';
import { numStr } from 'src/utils';

export type GraphData = {
  isSellOrder: boolean;
  price: number;
};

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
        <div className="mb-2">{this.lineOne}</div>
        <div>{this.lineTwo}</div>
      </>
    );
  };
}

const margin = {
  top: 40,
  right: 80,
  bottom: 60,
  left: 140
};

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white'
};

const barColor = 'rgba(23, 233, 217, .5)';
const barColorDark = 'rgba(23, 233, 217, .8)';

const tickLabelProps = () =>
  ({
    fill: barColorDark,
    fontSize: 14,
    fontFamily: 'sans-serif',
    textAnchor: 'middle'
  } as const);

const labelProps: Partial<TextProps> = {
  fill: barColorDark,
  fontSize: 14,
  fontFamily: 'sans-serif',
  textAnchor: 'middle'
};

// accessors
const getPriceValue = (d: GraphData) => d.price;
const getCountValue = (d: BarGraphData) => d.count;

type Props = {
  data: GraphData[];
  title: string;
};

export function PriceBarGraph({ data, title }: Props) {
  const [barGraphData, setBarGraphData] = useState<BarGraphData[]>([]);

  useEffect(() => {
    const newData: BarGraphData[] = [];
    const columns = 12;
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
      item.tooltip = new TooltipData(`${item.count} items`, `${numStr(item.start)} / ${numStr(item.end)}`);
    }

    setBarGraphData(newData);
  }, [data]);

  if (barGraphData.length > 0) {
    return (
      <ParentSize>
        {({ width }) => <_PriceBarGraph data={barGraphData} title={title} width={width} height={180} />}
      </ParentSize>
    );
  }

  return <></>;
}

// =====================================================================

type Props2 = {
  data: BarGraphData[];
  title: string;
  width: number;
  height: number;
};

function _PriceBarGraph({ data, title, width: outerWidth, height: outerHeight }: Props2) {
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

  const priceValues = data.map((d) => d.axisLabel);

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, width],
        round: true,
        domain: priceValues,
        padding: 0.2
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
      <svg width={outerWidth} height={outerHeight}>
        <LinearGradient id="teal" from="#134" to="#035" toOpacity={0.9} />
        <rect width={outerWidth} height={outerHeight} fill="url(#teal)" rx={14} />

        <text fill={barColor} dominant-baseline="central" font-size="24" x={32} y={outerHeight / 2}>
          {title}
        </text>

        <Group transform={`translate(${margin.left},${margin.top})`}>
          <AnimatedAxis
            key={`axis-center`}
            orientation={Orientation.bottom}
            top={height + 4}
            scale={xScale}
            tickFormat={(v) => `${v}`}
            stroke={barColorDark}
            tickStroke={barColorDark}
            tickLabelProps={tickLabelProps}
            tickValues={priceValues}
            label="Price in ETH"
            labelProps={labelProps}
            labelOffset={6}
            animationTrajectory="center"
          />

          {data.map((d, index) => {
            let barHeight = height - (yScale(getCountValue(d)) ?? 0);
            barHeight = barHeight < 2 ? 2 : barHeight;

            const barWidth = xScale.bandwidth();
            const barX = xScale(priceValues[index]);
            const barY = height - barHeight;

            return (
              <Bar
                key={`bar-${index}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={barColor}
                onClick={() => {
                  console.log(`clicked: ${JSON.stringify(Object.values(d), null, 2)}`);
                }}
                onMouseEnter={(event: React.MouseEvent) => {
                  showTooltip({
                    tooltipLeft: event.pageX,
                    tooltipTop: event.pageY,
                    tooltipData: d.tooltip
                  });
                }}
                //   onMouseMove={(event: React.MouseEvent) => console.log(event)}
                onMouseLeave={() => {
                  hideTooltip();
                }}
              />
            );
          })}
        </Group>
      </svg>

      {tooltipOpen && (
        <Tooltip key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <strong>{(tooltipData as TooltipData).content()}</strong>
        </Tooltip>
      )}
    </>
  );
}

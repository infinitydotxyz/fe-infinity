import React, { useEffect, useMemo, useState } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { scaleBand, scaleLinear, coerceNumber } from '@visx/scale';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Orientation } from '@visx/axis';
import { TextProps } from '@visx/text';
import { AnimatedAxis } from '@visx/react-spring';
import { Tooltip, useTooltip, defaultStyles } from '@visx/tooltip';

export type BubbleData = {
  id: string;
  isSellOrder: boolean;
  value: number;
  label: string;
  group: string;
  color: string;
  tooltip: string;
};

const margin = {
  top: 40,
  right: 40,
  bottom: 60,
  left: 40
};

const getMinMax = (vals: (number | { valueOf(): number })[]) => {
  const numericVals = vals.map(coerceNumber);
  return [Math.min(...numericVals), Math.max(...numericVals)];
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
// const getValueString = (d: BubbleData) => d.value.toString();
const getValue = (d: BubbleData) => d.value;

type Props = {
  data: BubbleData[];
};

export function PriceBarGraph({ data }: Props) {
  const [graphData, setGraphData] = useState<BubbleData[]>([]);

  useEffect(() => {
    const newData = [];

    for (const item of data) {
      newData.push(item);
    }

    setGraphData(newData);
  }, [data]);

  if (graphData.length > 0) {
    return <ParentSize>{({ width }) => <_Barrz data={graphData} width={width} height={400} />}</ParentSize>;
  }

  return <></>;
}

// =====================================================================

type Props2 = {
  data: BubbleData[];
  width: number;
  height: number;
};

function _Barrz({ data, width: outerWidth, height: outerHeight }: Props2) {
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();

  let cnt = 0;
  const priceValues = data.map(() => {
    const result = cnt;
    cnt += 2;

    return result;
  });

  const xScale = useMemo(
    () =>
      scaleBand<number>({
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
        domain: [0, Math.max(...data.map(getValue))]
      }),
    [height, data]
  );

  return width < 10 ? null : (
    <>
      <svg width={outerWidth} height={outerHeight}>
        <GradientTealBlue id="teal" />
        <rect width={outerWidth} height={outerHeight} fill="url(#teal)" rx={14} />

        <Group transform={`translate(${margin.left},${margin.top})`}>
          <AnimatedAxis
            key={`axis-center`}
            orientation={Orientation.bottom}
            top={height + 8}
            scale={xScale}
            tickFormat={(v) => `${v}`}
            stroke={barColorDark}
            tickStroke={barColorDark}
            tickLabelProps={tickLabelProps}
            tickValues={priceValues}
            label="Price in ETH"
            labelProps={labelProps}
            labelOffset={2}
            animationTrajectory="center"
          />

          {data.map((d, index) => {
            let barHeight = height - (yScale(getValue(d)) ?? 0);
            barHeight = barHeight < 4 ? 4 : barHeight;

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
          <strong>{tooltipData}</strong>
        </Tooltip>
      )}
    </>
  );
}

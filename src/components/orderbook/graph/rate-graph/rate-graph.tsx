import React, { useMemo } from 'react';
import { Group } from '@visx/group';
import { LinearGradient } from '@visx/gradient';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { useTooltip, useTooltipInPortal } from '@visx/tooltip';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { axisLineColorLight, textColorLight } from '../graph-utils';
import { tooltipStyles } from '../tooltip';
import { getAxisLabel, getOrder, getOrderCount } from './accessors';
import { RateGraphData, RateGraphProps as RateGraphProps, ResponsiveRateGraphProps } from './types';
import { convertGraphData } from './utils';
import { CandleStick, candleStickColor, candleStickGradientId } from './shapes';
import { labelStyle, rateGraphMargins, tickLabelStyle, verticalTickLabelStyle } from './styles';

export const ResponsiveRateGraph: React.FC<ResponsiveRateGraphProps> = (props) => {
  return (
    <ParentSize debounceTime={10} className="h-full">
      {({ width, height }) => <RateGraph {...props} width={width} height={height} />}
    </ParentSize>
  );
};

export const RateGraph: React.FC<RateGraphProps> = ({
  graphData,
  width: outerWidth,
  height: outerHeight,
  graphType,
  onClick,
  onSelection
}) => {
  const width = outerWidth - rateGraphMargins.left - rateGraphMargins.right;
  const height = outerHeight - rateGraphMargins.top - rateGraphMargins.bottom;

  const data = convertGraphData(graphData, width, graphType);
  const axisLabels = data.map(getAxisLabel);

  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();
  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: false
  });

  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, width],
        round: true,
        domain: axisLabels,
        padding: 0.7
      }),
    [width, data]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [height, 0],
        round: true,
        domain: [0, Math.max(...data.map(getOrderCount))]
      }),
    [height, data]
  );

  const getBarMeasurements = (data: RateGraphData, index: number) => {
    const barHeight = height - (yScale(getOrderCount(data)) ?? 0);

    let bColor = `url(#${candleStickGradientId})`;
    let barRadius = 10;
    if (barHeight === 0) {
      barRadius = 0;
      bColor = axisLineColorLight;
    }

    const barWidth = xScale.bandwidth();
    const barX = xScale(axisLabels[index]);
    const barY = height - barHeight;

    return { y: barY, x: barX || 0, width: barWidth, color: bColor, radius: barRadius, height: barHeight };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleMouseEnter = (event: React.MouseEvent, tooltip: any) => {
    const containerX = (event.clientX ?? 0) - containerBounds.left;
    const containerY = (event.clientY ?? 0) - containerBounds.top;
    showTooltip({
      tooltipLeft: containerX,
      tooltipTop: containerY,
      tooltipData: tooltip
    });
  };

  const handleMouseMove = (_: React.MouseEvent, orders: SignedOBOrder[], yRatio: number) => {
    const index = Math.ceil(orders.length * yRatio);
    onSelection(orders, index - 1);
  };

  if (width < 10) {
    return null;
  }

  return (
    <>
      <svg ref={containerRef} width={outerWidth} height={outerHeight} style={{ backgroundColor: '#26262A' }}>
        <LinearGradient
          from={candleStickColor}
          to={candleStickColor}
          toOpacity={1}
          fromOpacity={0.8}
          id={candleStickGradientId}
        />

        <Group transform={`translate(${rateGraphMargins.left},${rateGraphMargins.top})`}>
          <AxisBottom
            top={height + 5}
            scale={xScale}
            tickFormat={(v) => `${v}`}
            stroke={axisLineColorLight}
            tickStroke={textColorLight}
            tickLineProps={{ strokeWidth: 1, opacity: 0.6, transform: 'translate(0,0)' }}
            hideAxisLine={true}
            tickLabelProps={tickLabelStyle}
            tickValues={axisLabels}
            tickLength={5}
            label="Price in ETH"
            labelProps={labelStyle}
            labelOffset={30}
            hideZero={true}
            // animationTrajectory="center"
          />

          <AxisLeft
            left={50}
            scale={yScale}
            tickFormat={(v) => `${v}`}
            stroke={axisLineColorLight}
            tickStroke={textColorLight}
            tickLineProps={{ strokeWidth: 1, opacity: 1, transform: 'translate(0,0)' }}
            tickLength={5}
            hideAxisLine={true}
            tickLabelProps={verticalTickLabelStyle}
            label={`Number of ${graphType}`}
            labelProps={labelStyle}
            labelOffset={55}
            // animationTrajectory="center"
          />
          {data.map((d, index) => {
            return (
              <CandleStick
                {...getBarMeasurements(d, index)}
                key={index}
                onClick={() => onClick(d.start.toString(), d.end.toString())}
                onMouseMove={(event: React.MouseEvent, yRatio: number) =>
                  handleMouseMove(event, d.data.map(getOrder), yRatio)
                }
                onMouseEnter={(event: React.MouseEvent) => handleMouseEnter(event, d.tooltip)}
                onMouseLeave={hideTooltip}
              />
            );
          })}
        </Group>
      </svg>
      {tooltipOpen && (
        <TooltipInPortal top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <div>{tooltipData}</div>
        </TooltipInPortal>
      )}
    </>
  );
};

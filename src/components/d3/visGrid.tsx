import React from 'react';
import { Group } from '@visx/group';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { GridRows, GridColumns } from '@visx/grid';
import ParentSize from '@visx/responsive/lib/components/ParentSize';
import { Tooltip, useTooltip, defaultStyles } from '@visx/tooltip';
import { Zoom } from '@visx/zoom';
import { RectClipPath } from '@visx/clip-path';
import { GradientPinkBlue } from '@visx/gradient';
import { localPoint } from '@visx/event';
import { useForceUpdate } from 'framer-motion';

export const background = '#f3f3f3';

interface CTemperature {
  date: number;
  n: string;
}

interface DataPoint {
  x: number;
  y: number;
  tooltip: string;
  radius: number;
  color: string;
}

const cTemperature: CTemperature[] = [
  { date: Date.now(), n: '0' },
  { date: Date.parse('01/12/99'), n: '1' },
  { date: Date.parse('01/12/97'), n: '2' },
  { date: Date.parse('01/12/93'), n: '3' },
  { date: Date.parse('01/12/91'), n: '4' },
  { date: Date.parse('01/12/89'), n: '5' }
];

const date = (d: CTemperature) => new Date(d.date).valueOf();
const ny = (d: CTemperature) => Number(d.n);

// scales
const timeScale = scaleTime<number>({
  domain: [Math.min(...cTemperature.map(date)), Math.max(...cTemperature.map(date))]
});

const temperatureScale = scaleLinear<number>({
  domain: [Math.min(...cTemperature.map((d) => ny(d))), Math.max(...cTemperature.map((d) => ny(d)))],
  nice: true
});

const defaultMargin = { top: 70, right: 70, bottom: 70, left: 70 };

const tooltipStyles = {
  ...defaultStyles,
  minWidth: 60,
  backgroundColor: 'rgba(0,0,0,0.9)',
  color: 'white'
};

type Props = {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
};

export default function ThesholdExample() {
  return <ParentSize>{({ width }) => <_ThesholdExample width={width} height={400} />}</ParentSize>;
}

function _ThesholdExample({ width, height, margin = defaultMargin }: Props) {
  const { tooltipData, tooltipLeft, tooltipTop, tooltipOpen, showTooltip, hideTooltip } = useTooltip();
  const [forceUpdate] = useForceUpdate();

  if (width < 10) {
    return null;
  }

  const initialTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0,
    skewX: 0,
    skewY: 0
  };

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  timeScale.range([0, xMax]);
  temperatureScale.range([yMax, 0]);

  const circleForData = (data: DataPoint) => {
    return (
      <Group top={data.y} left={data.x} key={Math.random()}>
        <circle
          r={data.radius}
          fill={data.color}
          onMouseEnter={(event: React.MouseEvent) => {
            console.log(event);
            showTooltip({
              tooltipLeft: event.pageX,
              tooltipTop: event.pageY,
              tooltipData: data.tooltip
            });
          }}
          //   onMouseMove={(event: React.MouseEvent) => console.log(event)}
          onMouseLeave={(event: React.MouseEvent) => {
            console.log(event);
            hideTooltip();
          }}
          onClick={() => {
            console.log('node');
            forceUpdate();
          }}
        />
      </Group>
    );
  };

  const dataCircles = () => {
    return (
      <>
        {circleForData({ x: 20, y: 20, color: '#f0f', tooltip: 'fuck this', radius: 93 })}
        {circleForData({ x: 120, y: 20, color: '#0ff', tooltip: 'fuck you', radius: 53 })}
        {circleForData({ x: 320, y: 320, color: '#f00', tooltip: 'sdfsdf this', radius: 33 })}
        {circleForData({ x: 220, y: 20, color: '#00f', tooltip: 'fuck sdfsdf', radius: 13 })}
      </>
    );
  };

  return (
    <>
      <Zoom<SVGSVGElement>
        width={width}
        height={height}
        scaleXMin={0.1}
        scaleXMax={12}
        scaleYMin={0.1}
        scaleYMax={12}
        initialTransformMatrix={initialTransform}
      >
        {(zoom) => (
          <svg
            width={width}
            height={height}
            style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
            ref={zoom.containerRef}
          >
            <RectClipPath id="zoom-clip" width={width} height={height} />
            <GradientPinkBlue id="gradient" />
            <rect width={width} height={height} fill="url('#gradient')" />

            <Group left={margin.left} top={margin.top}>
              <GridRows scale={temperatureScale} width={xMax} height={yMax} stroke="#e0e0e0" />
              <GridColumns scale={timeScale} width={xMax} height={yMax} stroke="#e0e0e0" />
              <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
              <AxisBottom label="date" top={yMax} scale={timeScale} numTicks={width > 520 ? 10 : 5} />
              <AxisLeft label="price" scale={temperatureScale} />
              <text x="-70" y="15" transform="rotate(-90)" fill="#fff" fontSize={10}>
                Price (ETH)
              </text>
            </Group>

            <rect
              width={width}
              height={height}
              rx={14}
              fill="transparent"
              onTouchStart={zoom.dragStart}
              onTouchMove={zoom.dragMove}
              onTouchEnd={zoom.dragEnd}
              onMouseDown={zoom.dragStart}
              onMouseMove={zoom.dragMove}
              onMouseUp={zoom.dragEnd}
              onMouseLeave={() => {
                if (zoom.isDragging) {
                  zoom.dragEnd();
                }
              }}
              onDoubleClick={(event) => {
                console.log(event);
                const point = localPoint(event) || { x: 0, y: 0 };
                zoom.scale({ scaleX: 1, scaleY: 1, point });
                forceUpdate();
              }}
            />

            <Group transform={zoom.toString()}>{dataCircles()}</Group>
          </svg>
        )}
      </Zoom>

      {tooltipOpen && (
        <Tooltip key={Math.random()} top={tooltipTop} left={tooltipLeft} style={tooltipStyles}>
          <strong>{tooltipData}</strong>
        </Tooltip>
      )}
    </>
  );
}

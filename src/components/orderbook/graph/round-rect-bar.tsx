import React, { useRef, useState } from 'react';
import { clamp, hoverStrokeColor } from './graph-utils';

export interface RoundRectProps {
  width: number;
  height: number;
  tl?: number;
  tr?: number;
  br?: number;
  bl?: number;

  x?: number;
  y?: number;
  fill?: string;
  onClick?: () => void;

  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  onMouseMove: (event: React.MouseEvent, yRatio: number) => void;
}

export const RoundRectBar = ({
  x,
  y,
  width,
  height,
  tl = 0,
  tr = 0,
  br = 0,
  bl = 0,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  fill
}: RoundRectProps) => {
  const [mouseOver, setMouseOver] = useState(false);
  const ref = useRef<SVGPathElement>(null);

  const d =
    'M' +
    x +
    ',' +
    y +
    `m 0 ${tl}` +
    `q 0 -${tl} ${tl} -${tl}` +
    `l ${width - tl - tr} 0` +
    `q ${tr} 0 ${tr} ${tr}` +
    `l 0 ${height - tr - br}` +
    `q 0 ${br} -${br} ${br}` +
    `l -${width - br - bl} 0` +
    `q -${bl} 0 -${bl} -${bl}` +
    `z`;

  return (
    <path
      ref={ref}
      d={d}
      fill={fill}
      width={width}
      height={height}
      stroke={mouseOver ? hoverStrokeColor : 'transparent'}
      strokeWidth={3}
      x={x}
      y={y}
      onClick={onClick}
      onMouseMove={(e) => {
        const boundingRect = ref.current?.getBoundingClientRect();

        if (boundingRect) {
          let localY = e.clientY - boundingRect.top;
          localY = clamp(localY, 1, boundingRect.height);

          onMouseMove(e, localY / boundingRect.height);
        }
      }}
      onMouseEnter={(e) => {
        setMouseOver(true);
        onMouseEnter(e);
      }}
      onMouseLeave={(e) => {
        setMouseOver(false);
        onMouseLeave(e);
      }}
    />
  );
};

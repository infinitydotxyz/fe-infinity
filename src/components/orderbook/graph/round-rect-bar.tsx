import React, { useState } from 'react';
import { blueColor } from './graph-utils';

interface Props {
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
  onClick,
  fill
}: Props) => {
  const [mouseOver, setMouseOver] = useState(false);

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
      d={d}
      fill={fill}
      width={width}
      height={height}
      stroke={mouseOver ? blueColor : 'transparent'}
      strokeWidth={4}
      x={x}
      y={y}
      onClick={onClick}
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

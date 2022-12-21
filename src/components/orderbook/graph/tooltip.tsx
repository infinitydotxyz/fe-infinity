import { defaultStyles } from '@visx/tooltip';
import React, { useMemo } from 'react';
import { SimpleTable, SimpleTableItem } from 'src/components/common';

export type TooltipProps = {
  title: string;
  from: string;
  to: string;
};

export const Tooltip: React.FC<TooltipProps> = ({ title, from, to }) => {
  const items = useMemo<SimpleTableItem[]>(
    () => [
      { title: 'from:', value: <div>{from}</div> },
      { title: 'to:', value: <div>{to}</div> }
    ],
    [from, to]
  );

  return (
    <>
      <div className="mb-3">
        <strong>{title}</strong>
      </div>
      <div className="w-full">
        <SimpleTable items={items} valueClassName="font-bold" />
      </div>
    </>
  );
};

export const tooltipStyles = {
  ...defaultStyles,
  minWidth: 160,
  padding: '10px 15px',
  backgroundColor: 'rgba(255,255,255,.9)',
  fontSize: '16px',
  color: '#555'
};

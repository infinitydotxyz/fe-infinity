import React, { useMemo } from 'react';
import { SimpleTable, SimpleTableItem } from 'src/components/common';

export type TooltipProps = {
  title: string;
  from: string;
  to: string;
};

export const TooltipRenderer: React.FC<TooltipProps> = ({ title, from, to }) => {
  const items = useMemo<SimpleTableItem[]>(
    () => [
      { title: 'from:', value: <div>{from}</div> },
      { title: 'to:', value: <div>{to}</div> }
    ],
    [from, to]
  );

  return (
    <>
      <div className="mb-1">
        <span>{title}</span>
      </div>
      <div className="w-full">
        <SimpleTable items={items} rowClassName="mb-1" />
      </div>
    </>
  );
};

import BubbleChart from './bubble-chart';
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export type BubbleData = {
  id: string;
  value: number;
};

export const Bubbols = () => {
  const bubbleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const a = async () => {
      const data = (await d3.json('/bubbles.json')) as BubbleData[];

      if (bubbleRef.current && data && data.length > 0) {
        bubbleRef.current.replaceChildren(BubbleChart(data));
      }
    };

    a();
  }, []);

  return <div ref={bubbleRef}></div>;
};

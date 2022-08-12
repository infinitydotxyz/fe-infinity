import BubbleChart from './bubble-chart';
import { useEffect, useRef } from 'react';
import { useWindowSize } from 'src/hooks/useWindowSize';
// import * as d3 from 'd3';

export type BubbleData = {
  id: string;
  value: number;
  label: string;
  group: string;
};

interface Props {
  dataArray: BubbleData[];
  onClick: (value: number) => void;
}

export const PriceBubbles = ({ dataArray, onClick }: Props) => {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();

  useEffect(() => {
    const a = () => {
      if (bubbleRef.current && dataArray && dataArray.length > 0) {
        const divWidth = bubbleRef.current?.offsetWidth ?? 0;

        bubbleRef.current.replaceChildren(BubbleChart(dataArray, divWidth, onClick));
      }
    };

    a();
  }, [width, dataArray]);

  return <div ref={bubbleRef}></div>;
};

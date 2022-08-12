// import React from 'react';

import { BubbleData } from './git-bubbles';

export interface BubbleChartProps {
  data: BubbleData[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare class BubbleChart extends React.Component<BubbleChartProps, any> {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function BubbleChart(data: BubbleData[]): any;

export default BubbleChart;

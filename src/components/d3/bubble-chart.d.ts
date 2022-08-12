// import React from 'react';

import { BubbleData } from './price-bubbles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare class BubbleChart extends React.Component<BubbleChartProps, any> {}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare function BubbleChart(data: BubbleData[], width: number, onClick: (index: number) => void): any;

export default BubbleChart;

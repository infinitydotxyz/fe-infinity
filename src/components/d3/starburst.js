import * as Plot from '@observablehq/plot';
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

export const Starburst = () => {
  const headerRef = useRef();
  const [data, setData] = useState();

  useEffect(() => {
    d3.csv('/data.csv', d3.autoType).then(setData);
  }, []);

  useEffect(() => {
    if (data === undefined) {
      return;
    }
    const chart = Plot.plot({
      style: {
        background: 'transparent'
      },
      y: {
        grid: true
      },
      color: {
        type: 'diverging',
        scheme: 'burd'
      },
      marks: [Plot.ruleY([0]), Plot.dot(data, { x: 'Date', y: 'Anomaly', stroke: 'Anomaly' })]
    });
    headerRef.current.append(chart);
    return () => chart.remove();
  }, [data]);

  return (
    <div className="App">
      <header className="App-header" ref={headerRef}></header>
    </div>
  );
};

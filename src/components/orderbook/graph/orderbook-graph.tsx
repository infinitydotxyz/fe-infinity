import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { BiReset } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { GraphData } from './graph-utils';
import { Spinner } from 'src/components/common';

export const OrderbookGraph = () => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);

  const handleOnClick = (minPrice: string, maxPrice: string) => {
    updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);
  };

  useEffect(() => {
    const gdata = orders.map((x) => {
      const result: GraphData = {
        price: x.endPriceEth,
        isSellOrder: x.isSellOrder,
        order: x
      };
      return result;
    });
    setGraphData(gdata);
  }, [orders]);

  let content = <></>;
  const textStyle = 'flex items-center justify-center text-white opacity-50 h-80';

  if (isLoading) {
    content = (
      <div className={textStyle}>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    );
  } else if (graphData.length > 0) {
    content = (
      <>
        <StackedBarGraph data={graphData} onClick={handleOnClick} />

        <BiReset
          onClick={() => handleOnClick('', '')}
          className="text-white opacity-75 h-8 w-8 absolute top-3 left-4"
        />
      </>
    );
  } else {
    content = <div className={textStyle}>No data</div>;
  }

  return (
    <div className="w-full h-full relative p-4 flex flex-col mb-6 overflow-clip bg-black rounded-2xl">{content}</div>
  );
};

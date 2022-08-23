import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { BiReset } from 'react-icons/bi';
import { GraphData } from './price-bar-graph';
import { useEffect, useState } from 'react';

export const OrderbookGraph = () => {
  const { orders, updateFilters } = useOrderbook();
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

  return (
    <div className="w-full h-full relative p-4 flex flex-col mb-6 overflow-clip bg-black rounded-2xl">
      <StackedBarGraph data={graphData} onClick={handleOnClick} />

      <BiReset onClick={() => handleOnClick('', '')} className="text-white opacity-75 h-8 w-8 absolute top-3 left-4" />
    </div>
  );
};

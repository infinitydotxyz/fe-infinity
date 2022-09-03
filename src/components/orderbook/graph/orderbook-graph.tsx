import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { BiReset } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { GraphData, graphHeight, textAltColorTW } from './graph-utils';
import { Button, Spacer, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { NextPrevArrows } from './next-prev-arrows';
import { GraphBox } from './graph-box';

interface Props {
  className?: string;
}

export const OrderbookGraph = ({ className = '' }: Props) => {
  const { orders, updateFilters, isLoading, filters } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { minPrice, maxPrice } = filters;

  const handleOnClick = (minPrice: string, maxPrice: string) => {
    updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);
  };

  const resetButton = (large: boolean, className?: string) => {
    return (
      <div className={twMerge('text-black opacity-60', className)}>
        <Button
          disabled={!minPrice && !maxPrice}
          variant="round"
          size="plain"
          onClick={() => {
            handleOnClick('', '');
          }}
        >
          <BiReset className={large ? 'h-10 w-10' : 'h-8 w-8'} />
        </Button>
      </div>
    );
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
  const textStyle = 'flex items-center justify-center text-black opacity-60 font-bold text-lg';

  let showReset = false;
  let graph;
  if (isLoading) {
    graph = (
      <div className={textStyle} style={{ height: graphHeight }}>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    );
  } else {
    if (graphData.length === 0) {
      graph = (
        <div className={textStyle} style={{ height: graphHeight }}>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-3">No data</div>
            {resetButton(true)}
          </div>
        </div>
      );
    } else {
      showReset = true;
      graph = (
        <StackedBarGraph
          data={graphData}
          height={graphHeight}
          onClick={handleOnClick}
          onSelection={(orders, index) => {
            if (index !== selectedIndex) {
              setSelectedIndex(index);
            }

            let arrayEquals = false;
            if (orders.length === selectedOrders.length) {
              arrayEquals = orders.every((v, i) => v.id === selectedOrders[i].id);
            }

            if (!arrayEquals) {
              setSelectedOrders(orders);
            }
          }}
        />
      );
    }
  }

  content = (
    <div className={twMerge('flex flex-col  ', className)}>
      <div className="flex">
        <div className="flex-1 min-w-0   ">
          <div className="">
            {
              <GraphBox dark={true}>
                {showReset && resetButton(false, 'absolute right-2 top-2')}
                {graph}
              </GraphBox>
            }
          </div>

          <div className="flex px-8 mt-4">
            <GraphOrderFilters />
            <Spacer />
            <OrderbookGraphInfo className="" graphData={graphData} />
          </div>
        </div>
        <div className="w-96 flex flex-col space-y-2 ml-6">
          <NextPrevArrows orders={selectedOrders} index={selectedIndex} setIndex={setSelectedIndex} />
          <GraphOrderDetails orders={selectedOrders} index={selectedIndex} valueClassName={textAltColorTW} />
        </div>
      </div>
    </div>
  );

  return <div className={twMerge('w-full h-full relative flex flex-col       rounded-3xl')}>{content}</div>;
};

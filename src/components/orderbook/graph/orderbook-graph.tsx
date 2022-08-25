import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { BiReset } from 'react-icons/bi';
import { useEffect, useState } from 'react';
import { blueColorText, GraphData, graphHeight, orangeColorText, orangeColorTextLight } from './graph-utils';
import { Button, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { NextPrevArrows } from './next-prev-arrows';

export const OrderbookGraph = () => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

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
  const textStyle = 'flex items-center justify-center text-white opacity-60 font-bold text-lg';

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
            <Button
              variant="round"
              size="plain"
              onClick={() => {
                handleOnClick('', '');
              }}
            >
              <BiReset className="h-10 w-10" />
            </Button>
          </div>
        </div>
      );
    } else {
      graph = (
        <div className="">
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
        </div>
      );
    }
  }

  content = (
    <div className="flex flex-col">
      <div className="flex">
        <div className="flex-1 min-w-0 mb-5">
          <OrderbookGraphInfo className="mb-5" graphData={graphData} />
          {graph}
        </div>
        <div className="w-96 flex flex-col mt-2 space-y-4">
          <NextPrevArrows orders={selectedOrders} index={selectedIndex} setIndex={setSelectedIndex} />
          <GraphOrderDetails orders={selectedOrders} index={selectedIndex} valueClassName={orangeColorTextLight} />
          <GraphOrderFilters />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={twMerge(
        'bg-gradient-to-b from-[#111] via-[#000] to-[#111]',
        'w-full h-full relative p-8  flex flex-col overflow-clip   rounded-3xl'
      )}
    >
      <div className={twMerge(textStyle, 'text-xl absolute top-3 w-full')}>
        <div className="mr-3">{orders.length}</div>
        <div>Orders</div>
      </div>
      {content}
    </div>
  );
};

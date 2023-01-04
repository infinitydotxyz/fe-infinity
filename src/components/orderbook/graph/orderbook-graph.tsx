import { useOrderbook } from '../OrderbookContext';
import { useEffect, useState } from 'react';
import { GraphData } from './graph-utils';
import { Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { GraphBox } from './graph-box';
import { ResponsiveRateGraph, RateGraphType } from './rate-graph';
import { ResetButton } from './reset-button';
import { textClr } from 'src/utils/ui-constants';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookGraphProps = {
  className?: string;
};

export const OrderbookGraph: React.FC<OrderBookGraphProps> = ({ className = '' }) => {
  const { orders, updateFilters, isLoading, clearFilters, filters } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [defaultCollections, setDefaultCollections] = useState<string[]>([]);

  const { minPrice, maxPrice, collections } = filters;

  const handleOnClick = (minPrice: string, maxPrice: string): Promise<boolean> =>
    updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);

  const handleSelect = (orders: SignedOBOrder[], index: number) => {
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
  };

  const handleReset = () => clearFilters(['collections', 'minPrice', 'maxPrice']);

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
    // setGraphData(
    //   [...new Array(100)].map(
    //     () =>
    //       ({
    //         price: +(Math.random() * (10 - 0.01) + 0.01).toFixed(2),
    //         isSellOrder: Math.random() > 0.5,
    //         order: gdata[0].order
    //       } as GraphData)
    //   )
    // );

    // set defaultCollections
    const dcs: Set<string> = new Set<string>(defaultCollections);
    for (const gd of gdata) {
      for (const nft of gd.order.nfts) {
        dcs.add(`${nft.chainId}:${nft.collectionAddress}`);
      }
    }
    setDefaultCollections(Array.from(dcs));
  }, [orders]);

  return (
    <div className={twMerge('w-full h-full relative flex flex-col pr-7', className)}>
      <div className="w-[360px] flex ml-6 h-full"></div>
      <div className="flex">
        <div className="flex-1 min-w-0 space-y-4 my-4">
          {graphData.length === 0 && !isLoading && (
            <div className={infoBoxStyle}>
              <div className="flex flex-col items-center justify-center">
                <div className={twMerge('mb-3', textClr)}>No data</div>
                <ResetButton
                  large={true}
                  disabled={!minPrice && !maxPrice && !(collections && collections.length > 0)}
                  onClick={handleReset}
                />
              </div>
            </div>
          )}

          {/* TODO: Improve loading screen, it looks a bit jumpy cus both charts are re-rendered when the data changes. Perhaps add an individual loader per chart? */}
          {!isLoading && graphData.length > 0 && (
            <>
              <ResponsiveRateGraph
                graphType={RateGraphType.Offers}
                graphData={graphData}
                onClick={handleOnClick}
                onSelection={handleSelect}
              />

              <ResponsiveRateGraph
                graphType={RateGraphType.Listings}
                graphData={graphData}
                onClick={handleOnClick}
                onSelection={handleSelect}
              />

              {/* <GraphBox theme={GraphBoxTheme.White} className="h-full">
                <StackedBarGraph data={graphData} onClick={handleOnClick} onSelection={handleSelect} />
              </GraphBox> */}
            </>
          )}

          {isLoading && (
            <div className={twMerge(infoBoxStyle, textClr, 'pointer-events-none')}>
              <div className="flex flex-col items-center justify-center">
                <Spinner />
                <div className="mt-4">Loading...</div>
              </div>
            </div>
          )}
        </div>

        <div className="w-[360px] p-4">
          <div className="w-[360px] fixed pointer-events-none space-y-4">
            <GraphBox noCSSStyles className="space-y-2">
              <div className={twMerge(textClr, 'text-lg font-bold')}>Advanced filters</div>

              <GraphOrderFilters className="pointer-events-auto" />

              <div className="flex justify-between">
                <div className={twMerge(className)}>
                  <OrderbookGraphInfo graphData={graphData} />
                </div>
                <ResetButton
                  className="pointer-events-auto"
                  large={true}
                  disabled={!minPrice && !maxPrice && !(collections && collections.length > 0)}
                  onClick={handleReset}
                />
              </div>
            </GraphBox>

            <GraphOrderDetails
              orders={selectedOrders}
              index={selectedIndex}
              valueClassName="text-dark-gray-300"
              setIndex={setSelectedIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

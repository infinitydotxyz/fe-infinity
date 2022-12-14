import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { useEffect, useState } from 'react';
import { GraphData, graphHeight, textAltColorTW } from './graph-utils';
import { Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { GraphBox, GraphBoxTheme } from './graph-box';
import { CollectionFilterModal } from './graph-collection-filter';
import { ResponsiveRateGraph, RateGraphType } from './rate-graph';
import { ResetButton } from './reset-button';

const infoBoxStyle = 'flex items-center justify-center text-black opacity-60 font-bold text-lg h-full';

export type OrderBookGraphProps = {
  className?: string;
};

export const OrderbookGraph: React.FC<OrderBookGraphProps> = ({ className = '' }) => {
  const { orders, updateFilters, isLoading, clearFilters, filters } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collectionFilterShown, setCollectionFilterShown] = useState(false);
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
    <div className={twMerge('w-full h-full relative flex flex-col')}>
      <div className={twMerge('flex flex-col', className)}>
        <div className="flex w-full">
          <div className="flex flex-1 mb-4 justify-between items-center">
            <CollectionFilterModal
              modalIsOpen={collectionFilterShown}
              setIsOpen={(open) => setCollectionFilterShown(open)}
              defaultCollections={defaultCollections}
            />

            <div>
              <GraphOrderFilters className="pointer-events-auto" />
            </div>
            <div>
              <div className={twMerge(className)}>
                <OrderbookGraphInfo graphData={graphData} />
              </div>
            </div>
            <ResetButton
              large={true}
              disabled={!minPrice && !maxPrice && !(collections && collections.length > 0)}
              onClick={handleReset}
            />
          </div>

          <div className="w-[360px] flex ml-6 h-full"></div>
        </div>
        <div className="flex" style={{ height: graphHeight }}>
          <div className="relative flex-1 min-w-0">
            {graphData.length === 0 && !isLoading && (
              <div className={infoBoxStyle}>
                <div className="flex flex-col items-center justify-center">
                  <div className="mb-3">No data</div>
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
                <GraphBox theme={GraphBoxTheme.Dark} className="h-full">
                  <ResponsiveRateGraph
                    graphType={RateGraphType.Offers}
                    graphData={graphData}
                    onClick={handleOnClick}
                    onSelection={handleSelect}
                  />
                </GraphBox>

                <GraphBox theme={GraphBoxTheme.White} className="h-full">
                  <StackedBarGraph data={graphData} onClick={handleOnClick} onSelection={handleSelect} />
                </GraphBox>
              </>
            )}

            {isLoading && (
              <div className={twMerge(infoBoxStyle, 'absolute top-0 left-0 right-0 bottom-0 pointer-events-none')}>
                <div className="flex flex-col items-center justify-center">
                  <Spinner />
                  <div className="mt-4">Loading...</div>
                </div>
              </div>
            )}
          </div>

          <div className="w-[360px] flex flex-col space-y-2 ml-6 h-full">
            <GraphOrderDetails
              orders={selectedOrders}
              index={selectedIndex}
              valueClassName={textAltColorTW}
              setIndex={setSelectedIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

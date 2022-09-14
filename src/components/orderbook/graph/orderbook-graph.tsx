import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { useEffect, useState } from 'react';
import { GraphData, graphHeight, textAltColorTW } from './graph-utils';
import { Button, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { GraphBox } from './graph-box';
import { CollectionFilterModal } from './graph-collection-filter';

interface Props {
  className?: string;
}

export const OrderbookGraph = ({ className = '' }: Props) => {
  const { orders, updateFilters, isLoading, clearFilters, filters } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collectionFilterShown, setCollectionFilterShown] = useState(false);
  const [defaultCollections, setDefaultCollections] = useState<string[]>([]);

  const { minPrice, maxPrice, collections } = filters;

  const handleOnClick = (minPrice: string, maxPrice: string): Promise<boolean> => {
    return updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);
  };

  const resetButton = (large: boolean, className?: string) => {
    return (
      <div className={twMerge(className)}>
        <Button
          disabled={!minPrice && !maxPrice && !(collections && collections.length > 0)}
          variant="primary"
          size={large ? 'normal' : 'small'}
          onClick={async () => {
            await clearFilters(['collections', 'minPrice', 'maxPrice']);
          }}
        >
          Reset
        </Button>
      </div>
    );
  };

  const graphInfo = (className?: string) => {
    return (
      <div className={twMerge(className)}>
        <OrderbookGraphInfo className=" " graphData={graphData} />
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

    // set defaultCollections
    const dcs: Set<string> = new Set<string>(defaultCollections);
    for (const gd of gdata) {
      for (const nft of gd.order.nfts) {
        dcs.add(`${nft.chainId}:${nft.collectionAddress}`);
      }
    }
    setDefaultCollections(Array.from(dcs));
  }, [orders]);

  let content = <></>;
  const infoBoxStyle = 'flex items-center justify-center text-black opacity-60 font-bold text-lg h-full';

  let showReset = false;
  let graph;

  if (graphData.length === 0 && !isLoading) {
    graph = (
      <div className={twMerge(infoBoxStyle)}>
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

  let loader;
  if (isLoading) {
    loader = (
      <div className={twMerge(infoBoxStyle, 'absolute top-0 left-0 right-0 bottom-0 pointer-events-none')}>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    );
  }

  content = (
    <div className={twMerge('flex flex-col  ', className)}>
      <div className="flex" style={{ height: graphHeight }}>
        <div className="relative flex-1 min-w-0">
          <div className="flex mb-4 justify-between items-center">
            <CollectionFilterModal
              modalIsOpen={collectionFilterShown}
              setIsOpen={(open) => setCollectionFilterShown(open)}
              defaultCollections={defaultCollections}
            />
            {showReset && (
              <div>
                <GraphOrderFilters className="pointer-events-auto" />
              </div>
            )}
            {showReset && <div className="">{graphInfo('')}</div>}
            {showReset && resetButton(false, '')}
          </div>

          <GraphBox dark={true} className="h-full">
            {graph}
          </GraphBox>

          {loader}
        </div>

        <div className="w-[360px] flex flex-col space-y-2 ml-6 mt-11 h-full">
          <GraphOrderDetails
            orders={selectedOrders}
            index={selectedIndex}
            valueClassName={textAltColorTW}
            setIndex={setSelectedIndex}
          />
        </div>
      </div>
    </div>
  );

  return <div className={twMerge('w-full h-full relative flex flex-col')}>{content}</div>;
};

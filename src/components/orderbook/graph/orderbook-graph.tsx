import { useOrderbook } from '../OrderbookContext';
import { StackedBarGraph } from './stacked-bar-graph';
import { useEffect, useState } from 'react';
import { GraphData, graphHeight, textAltColorTW } from './graph-utils';
import { Button, Modal, Spacer, Spinner } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { GraphOrderDetails } from './graph-order-details';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { GraphOrderFilters } from './graph-order-filters';
import { OrderbookGraphInfo } from './orderbook-graph-info';
import { GraphBox } from './graph-box';
import { GraphCollectionFilter } from './graph-collection-filter';

interface Props {
  className?: string;
}

export const OrderbookGraph = ({ className = '' }: Props) => {
  const { orders, updateFilters, isLoading, clearFilters, filters } = useOrderbook();
  const [graphData, setGraphData] = useState<GraphData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [collectionFilterShown, setCollectionFilterShown] = useState(false);

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
          variant="outline"
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
  const infoBoxStyle = 'flex items-center justify-center text-black opacity-60 font-bold text-lg h-full';

  let showReset = false;
  let graph;
  if (isLoading) {
    graph = (
      <div className={infoBoxStyle}>
        <div className="flex flex-col items-center justify-center">
          <Spinner />
          <div className="mt-4">Loading...</div>
        </div>
      </div>
    );
  } else {
    if (graphData.length === 0) {
      graph = (
        <div className={infoBoxStyle}>
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
  }

  content = (
    <div className={twMerge('flex flex-col  ', className)}>
      <div className="flex" style={{ height: graphHeight }}>
        <div className="flex-1 min-w-0   ">
          <GraphBox dark={true} className="h-full">
            {showReset && resetButton(false, 'absolute right-4 top-3')}
            {graph}
          </GraphBox>

          <div className="flex px-8 mt-4">
            <GraphOrderFilters />
            <Spacer />
            <CollectionFilterModal
              modalIsOpen={collectionFilterShown}
              setIsOpen={(open) => setCollectionFilterShown(open)}
            />
            <OrderbookGraphInfo className="" graphData={graphData} />
          </div>
        </div>
        <div className="w-[360px] flex flex-col space-y-2 ml-6">
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

  return <div className={twMerge('w-full h-full relative flex flex-col       rounded-3xl')}>{content}</div>;
};

// ===========================================================================

interface Props2 {
  modalIsOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CollectionFilterModal = ({ modalIsOpen, setIsOpen }: Props2) => {
  return (
    <div className="flex flex-col">
      <Button size="medium" variant="outlineWhite" onClick={() => setIsOpen(true)}>
        Select Collections
      </Button>

      <Modal isOpen={modalIsOpen} onClose={() => setIsOpen(false)} okButton="" cancelButton="Close">
        <GraphCollectionFilter />
      </Modal>
    </div>
  );
};

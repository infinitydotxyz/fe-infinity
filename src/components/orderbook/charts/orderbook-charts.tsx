import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { BarChartType, ResponsiveBarChart } from './bar-chart';
import { ChartOrderDetails } from './chart-order-details';
import { ChartData } from './chart-utils';
import { ResponsiveSalesScatterChart, ScatterChartType } from './scatter-chart/scatter-chart';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
};

export const OrderbookCharts: React.FC<OrderBookChartProps> = ({ className = '' }) => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [graphData, setGraphData] = useState<ChartData[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [defaultCollections, setDefaultCollections] = useState<string[]>([]);

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

  useEffect(() => {
    const gdata = orders.map((x) => {
      const result: ChartData = {
        price: x.endPriceEth,
        isSellOrder: x.isSellOrder,
        order: x
      };
      return result;
    });
    //setGraphData(gdata); // todo use real data
    setGraphData(
      [...new Array(100)].map(
        () =>
          ({
            price: +(Math.random() * (10 - 0.01) + 0.01).toFixed(2),
            isSellOrder: Math.random() > 0.5,
            order: {}
          } as ChartData)
      )
    );

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
          {/* TODO: Improve loading screen, it looks a bit jumpy cus both charts are re-rendered when the data changes. Perhaps add an individual loader per chart? */}
          {!isLoading && graphData.length > 0 && (
            <>
              <ResponsiveSalesScatterChart graphType={ScatterChartType.Sales} />

              <ResponsiveBarChart
                graphType={BarChartType.Offers}
                graphData={graphData}
                onClick={handleOnClick}
                onSelection={handleSelect}
              />

              <ResponsiveBarChart
                graphType={BarChartType.Listings}
                graphData={graphData}
                onClick={handleOnClick}
                onSelection={handleSelect}
              />
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
            <ChartOrderDetails
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

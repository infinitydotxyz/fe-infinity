import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { BarChartType, ChartEntry, ResponsiveBarChart } from './bar-chart';
import { OrdersChartDetails, SalesChartDetails } from './chart-details';
import { ResponsiveScatterChart, SaleEntry, ScatterChartType } from './scatter-chart';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
};

export const OrderbookCharts: React.FC<OrderBookChartProps> = ({ className = '' }) => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [graphData, setGraphData] = useState<ChartEntry[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<SignedOBOrder[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [salesData, setSalesData] = useState<SaleEntry[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleEntry>();

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
    // const gdata = orders.map((x) => {
    //   const result: ChartEntry = {
    //     price: x.endPriceEth,
    //     isSellOrder: x.isSellOrder,
    //     order: x
    //   };
    //   return result;
    // });
    //setGraphData(gdata); // todo use real data
    setGraphData(
      [...new Array(300)].map(
        () =>
          ({
            price: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
            isSellOrder: Math.random() > 0.5,
            order: {
              nfts: [
                {
                  collectionAddress: '0x123',
                  collectionName: 'Test Collection ' + Math.floor(Math.random() * 100),
                  collectionImage:
                    'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750',
                  tokens: [
                    {
                      tokenId: Math.floor(Math.random() * 10000).toString(),
                      tokenImage:
                        'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750'
                    }
                  ]
                }
              ]
            }
          } as ChartEntry)
      )
    );

    const nowTimestamp = Date.now();
    const timestampOneYearAgo = nowTimestamp - 1000 * 60 * 60 * 24 * 365;
    setSalesData(
      [...new Array(300)].map(
        () =>
          ({
            salePrice: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
            tokenImage:
              'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750',
            collectionAddress: '0x123',
            collectionName: 'abc',
            tokenId: '123',
            timestamp: Math.random() * (nowTimestamp - timestampOneYearAgo) + timestampOneYearAgo
          } as SaleEntry)
      )
    );

    // set defaultCollections
    // const dcs: Set<string> = new Set<string>(defaultCollections);
    // for (const gd of gdata) {
    //   for (const nft of gd.order.nfts) {
    //     dcs.add(`${nft.chainId}:${nft.collectionAddress}`);
    //   }
    // }
    // setDefaultCollections(Array.from(dcs));
  }, [orders]);

  return (
    <div className={twMerge('w-full h-full relative flex flex-col pr-7', className)}>
      <div className="w-[360px] flex ml-6 h-full"></div>
      <div className="flex">
        <div className="flex-1 min-w-0 space-y-4 my-4">
          {/* TODO: Improve loading screen, it looks a bit jumpy cus both charts are re-rendered when the data changes. Perhaps add an individual loader per chart? */}
          {!isLoading && graphData.length > 0 && (
            <>
              <ResponsiveScatterChart
                graphType={ScatterChartType.Sales}
                data={salesData}
                onSelection={setSelectedSale}
              />

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
            <SalesChartDetails data={selectedSale} />
            <OrdersChartDetails
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

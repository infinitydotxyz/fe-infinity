import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/common';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { BarChartType, OrderData, ResponsiveBarChart } from './bar-chart';
import { OrdersChartDetails, SalesChartDetails } from './chart-details';
import { ResponsiveScatterChart, SaleData, ScatterChartType } from './scatter-chart';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
};

export const OrderbookCharts = ({ className = '' }: OrderBookChartProps) => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleData>();
  const [selectedListings, setSelectedListings] = useState<SignedOBOrder[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<SignedOBOrder[]>([]);
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  const fetchNewData = (minPrice: string, maxPrice: string): Promise<boolean> =>
    updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);

  const displayListingDetails = (orders: SignedOBOrder[], index: number) => {
    if (index !== selectedListingIndex) {
      setSelectedListingIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedListings.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedListings[i].id);
    }

    if (!arrayEquals) {
      setSelectedListings(orders);
    }
  };

  const displayOfferDetails = (orders: SignedOBOrder[], index: number) => {
    if (index !== selectedOfferIndex) {
      setSelectedOfferIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedOffers.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedOffers[i].id);
    }

    if (!arrayEquals) {
      setSelectedOffers(orders);
    }
  };

  useEffect(() => {
    // todo use real data
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
          } as SaleData)
      )
    );

    setOrdersData(
      [...new Array(300)].map(
        () =>
          ({
            order: {
              isSellOrder: Math.random() > 0.5,
              startPriceEth: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
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
          } as OrderData)
      )
    );
  }, [orders]);

  return (
    <div className={twMerge('w-full h-full relative flex flex-col p-2', className)}>
      <div className="flex">
        <div className="w-2/3 p-2">
          {!isLoading && salesData.length > 0 && (
            <ResponsiveScatterChart
              graphType={ScatterChartType.Sales}
              data={salesData}
              displayDetails={setSelectedSale}
            />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <SalesChartDetails data={selectedSale} />
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 p-2">
          {!isLoading && ordersData.length > 0 && (
            <ResponsiveBarChart
              graphType={BarChartType.Listings}
              graphData={ordersData}
              fetchNewData={fetchNewData}
              displayDetails={displayListingDetails}
            />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <OrdersChartDetails
            orders={selectedListings}
            index={selectedListingIndex}
            valueClassName="text-dark-gray-300"
            setIndex={setSelectedListingIndex}
          />
        </div>
      </div>

      <div className="flex pb-10">
        <div className="w-2/3 p-2">
          {!isLoading && ordersData.length > 0 && (
            <ResponsiveBarChart
              graphType={BarChartType.Offers}
              graphData={ordersData}
              fetchNewData={fetchNewData}
              displayDetails={displayOfferDetails}
            />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <OrdersChartDetails
            orders={selectedOffers}
            index={selectedOfferIndex}
            valueClassName="text-dark-gray-300"
            setIndex={setSelectedOfferIndex}
          />
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={twMerge(infoBoxStyle, textClr, 'pointer-events-none')}>
      <div className="flex flex-col items-center justify-center">
        <Spinner />
        <div className="mt-4">Loading...</div>
      </div>
    </div>
  );
};

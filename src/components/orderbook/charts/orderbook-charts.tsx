import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/common';
import { textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useOrderbook } from '../OrderbookContext';
import { BarChartType, OrderData, ResponsiveBarChart } from './bar-chart';
import { OrdersChartDetails } from './chart-details';
import { ResponsiveScatterChart, SaleData, ScatterChartType, TimeBuckets } from './scatter-chart';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
};

export const OrderbookCharts = ({ className = '' }: OrderBookChartProps) => {
  const { orders, updateFilters, isLoading } = useOrderbook();
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  const [selectedListings, setSelectedListings] = useState<SignedOBOrder[]>([]);
  const [selectedOffers, setSelectedOffers] = useState<SignedOBOrder[]>([]);
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  const [selectedTimeBucket, setSelectedTimeBucket] = useState(TimeBuckets.ONE_WEEK.toString());

  const fetchOrdersDataForPriceRange = (minPrice: string, maxPrice: string): Promise<boolean> =>
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

  const fetchSalesDataForTimeBucket = (timeBucket: string) => {
    // todo use real data
    const nowTimestamp = Date.now();
    let prevTimestamp = nowTimestamp;
    switch (timeBucket) {
      case TimeBuckets.ONE_HOUR:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60;
        break;
      case TimeBuckets.ONE_DAY:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24;
        break;
      case TimeBuckets.ONE_WEEK:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 7;
        break;
      case TimeBuckets.ONE_MONTH:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 30;
        break;
      case TimeBuckets.ONE_YEAR:
        prevTimestamp = nowTimestamp - 1000 * 60 * 60 * 24 * 365;
        break;
      default:
        break;
    }

    setSelectedTimeBucket(timeBucket);

    setSalesData(
      [...new Array(300)].map(
        () =>
          ({
            salePrice: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
            tokenImage:
              'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750',
            collectionAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            collectionName: 'BAYC',
            tokenId: Math.ceil(Math.random() * (10000 - 1) + 1).toString(),
            timestamp: Math.random() * (nowTimestamp - prevTimestamp) + prevTimestamp
          } as SaleData)
      )
    );
  };

  useEffect(() => {
    // todo use real data
    const nowTimestamp = Date.now();
    const timestampOneWeekAgo = nowTimestamp - 1000 * 60 * 60 * 24 * 7; // default week
    setSalesData(
      [...new Array(300)].map(
        () =>
          ({
            salePrice: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
            tokenImage:
              'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750',
            collectionAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
            collectionName: 'BAYC',
            tokenId: Math.ceil(Math.random() * (10000 - 1) + 1).toString(),
            timestamp: Math.random() * (nowTimestamp - timestampOneWeekAgo) + timestampOneWeekAgo
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
        <div className="w-full p-2">
          {!isLoading && salesData.length > 0 && (
            <ResponsiveScatterChart
              key={selectedTimeBucket}
              selectedTimeBucket={selectedTimeBucket}
              graphType={ScatterChartType.Sales}
              data={salesData}
              fetchData={fetchSalesDataForTimeBucket}
            />
          )}

          {isLoading && <Loading />}
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 p-2">
          {!isLoading && ordersData.length > 0 && (
            <ResponsiveBarChart
              graphType={BarChartType.Listings}
              graphData={ordersData}
              fetchData={fetchOrdersDataForPriceRange}
              displayDetails={displayListingDetails}
            />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <OrdersChartDetails
            orders={selectedListings}
            index={selectedListingIndex}
            valueClassName="text-gray-800"
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
              fetchData={fetchOrdersDataForPriceRange}
              displayDetails={displayOfferDetails}
            />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <OrdersChartDetails
            orders={selectedOffers}
            index={selectedOfferIndex}
            valueClassName="text-gray-800"
            setIndex={setSelectedOfferIndex}
          />
        </div>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={twMerge(infoBoxStyle, textColor, 'pointer-events-none')}>
      <div className="flex flex-col items-center justify-center">
        <Spinner />
        <div className="mt-4">Loading...</div>
      </div>
    </div>
  );
};

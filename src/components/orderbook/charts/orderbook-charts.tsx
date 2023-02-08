import {
  ChainId,
  CollectionHistoricalSale,
  CollectionOrder,
  HistoricalSalesTimeBucket
} from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { Spinner } from 'src/components/common';
import { apiGet } from 'src/utils';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { ResponsiveBarChart } from './bar-chart';
import { OrdersChartDetails } from './chart-details';
import { ResponsiveSalesChart, SalesChartData } from './sales-chart';
import { BarChartType, ScatterChartType } from './types';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
  collectionAddress: string;
  collectionImage: string;
};

export const OrderbookCharts = ({ className = '', collectionAddress, collectionImage }: OrderBookChartProps) => {
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const { chain } = useNetwork();
  const chainId = chain?.id ?? ChainId.Mainnet;
  const [selectedTimeBucket, setSelectedTimeBucket] = useState(HistoricalSalesTimeBucket.ONE_WEEK);
  const [ordersData, setOrdersData] = useState<CollectionOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<CollectionOrder[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const displayDetails = (orders: CollectionOrder[], index: number) => {
    if (index !== selectedOrderIndex) {
      setSelectedOrderIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedOrders.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedOrders[i].id);
    }

    if (!arrayEquals) {
      setSelectedOrders(orders);
    }
  };

  const fetchSalesDataForTimeBucket = async (timeBucket: HistoricalSalesTimeBucket) => {
    setIsLoading(true);
    const { result, error } = await apiGet(`/collections/${chainId}:${collectionAddress}/sales`, {
      query: {
        period: timeBucket
      }
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }

    setSalesChartData(
      result.map((sale: CollectionHistoricalSale) => {
        return {
          salePrice: sale.salePriceEth,
          tokenImage: sale.tokenImage,
          collectionAddress,
          tokenId: sale.tokenId,
          timestamp: sale.timestamp
        };
      })
    );

    setIsLoading(false);
  };

  const fetchOrdersData = async () => {
    setIsLoading(true);
    const { result, error } = await apiGet(`/collections/${chainId}:${collectionAddress}/orders`);

    if (error) {
      setIsLoading(false);
      console.error(error);
      return;
    }

    setOrdersData(result);

    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalesDataForTimeBucket(selectedTimeBucket);
  }, [selectedTimeBucket]);

  useEffect(() => {
    fetchOrdersData();
  }, []);

  return (
    <div className={twMerge('w-full h-full relative flex flex-col p-2', className)}>
      <div className="flex">
        <div className="w-full p-2">
          {salesChartData.length > 0 && (
            <ResponsiveSalesChart
              key={selectedTimeBucket}
              selectedTimeBucket={selectedTimeBucket}
              setSelectedTimeBucket={setSelectedTimeBucket}
              graphType={ScatterChartType.Sales}
              data={salesChartData}
            />
          )}

          {isLoading && <Loading />}
        </div>
      </div>

      <div className="flex">
        <div className="w-2/3 p-2">
          {ordersData.length > 0 && (
            <ResponsiveBarChart graphType={BarChartType.Listings} data={ordersData} displayDetails={displayDetails} />
          )}

          {isLoading && <Loading />}
        </div>
        <div className="w-1/3 p-2">
          <OrdersChartDetails
            orders={selectedOrders}
            index={selectedOrderIndex}
            valueClassName={secondaryTextColor}
            setIndex={setSelectedOrderIndex}
            collectionAddress={collectionAddress}
            collectionImage={collectionImage}
          />
        </div>
      </div>

      {/* todo: uncomment <div className="w-full p-2 flex space-x-5 underline text-sm mt-6">
        <ExternalLink href="https://flow.so/terms">Terms</ExternalLink>
        <ExternalLink href="https://flow.so/privacy-policy">Privacy Policy</ExternalLink>
      </div> */}
    </div>
  );
};

const Loading = () => {
  return (
    <div className={twMerge(infoBoxStyle, 'pointer-events-none')}>
      <div className="flex flex-col items-center justify-center">
        <Spinner />
        <div className="mt-4">Loading...</div>
      </div>
    </div>
  );
};

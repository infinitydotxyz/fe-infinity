import { ChainId, CollectionHistoricalSale, CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { BouncingLogo, ExternalLink } from 'src/components/common';
import { apiGet } from 'src/utils';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ResponsiveBarChart } from '../charts/bar-chart';
import { OrdersChartDetails, SalesChartDetails } from '../charts/chart-details';
import { ResponsiveSalesChart, SalesChartData } from '../charts/sales-chart';
import { BarChartType, ScatterChartType } from '../charts/types';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type CollectionChartsProps = {
  className?: string;
  collectionAddress: string;
  collectionChainId: ChainId;
  collectionImage: string;
};

export const CollectionCharts = ({
  className = '',
  collectionAddress,
  collectionChainId,
  collectionImage
}: CollectionChartsProps) => {
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [ordersData, setOrdersData] = useState<CollectionOrder[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<CollectionOrder[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(0);
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [isOrdersLoading, setIsOrdersLoading] = useState(true);

  const displayDetails = (orders: CollectionOrder[], index: number) => {
    if (index !== selectedOrderIndex) {
      setSelectedOrderIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedOrders.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedOrders[i].id);
    }

    if (!arrayEquals) {
      setSelectedOrders(orders.sort((a, b) => a.priceEth - b.priceEth));
    }
  };

  const fetchSalesData = async () => {
    setIsSalesLoading(true);
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/sales`);

    if (error) {
      console.error(error);
      setIsSalesLoading(false);
      return;
    }

    const chartData = result.map((sale: CollectionHistoricalSale) => {
      return {
        salePrice: sale.salePriceEth,
        tokenImage: sale.tokenImage,
        collectionAddress,
        tokenId: sale.tokenId,
        timestamp: sale.timestamp
      } as SalesChartData;
    });

    setSalesChartData(chartData);
    setIsSalesLoading(false);
  };

  const fetchOrdersData = async () => {
    setSelectedOrders([]);
    setIsOrdersLoading(true);
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/orders`);

    if (error) {
      setIsOrdersLoading(false);
      console.error(error);
      return;
    }

    setOrdersData(
      result.map((order: CollectionOrder) => {
        const tokenId = order.tokenId;
        const tokenImage = order.tokenImage;

        // for collection and other complex offers, tokenId and tokenImage could be blank
        if (!order.isSellOrder) {
          if (!tokenImage) {
            order.tokenImage = collectionImage;
          }
          if (!tokenId) {
            order.tokenId = 'Offer';
          }
        }

        return order;
      })
    );
    setIsOrdersLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
    fetchOrdersData();
  }, [collectionAddress, collectionChainId]);

  return (
    <div className={twMerge('w-full h-full relative flex flex-col p-2', className)}>
      <div className="flex">
        <div className="w-3/4 p-2">
          {salesChartData.length > 0 && (
            <ResponsiveSalesChart graphType={ScatterChartType.Sales} data={salesChartData} />
          )}

          {isSalesLoading && <Loading graphType={ScatterChartType.Sales} />}
        </div>
        <div className="w-1/4 p-2">{salesChartData.length > 0 && <SalesChartDetails data={salesChartData[0]} />}</div>
      </div>

      <div className="flex">
        <div className="w-3/4 p-2">
          {ordersData.length > 0 && (
            <ResponsiveBarChart graphType={BarChartType.Listings} data={ordersData} displayDetails={displayDetails} />
          )}

          {isOrdersLoading && <Loading graphType={BarChartType.Listings} />}
        </div>
        <div className="w-1/4 p-2">
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

      <div className={twMerge('w-full p-2 flex space-x-5 text-xs mt-6 z-50', secondaryTextColor)}>
        <ExternalLink href="https://flow.so/terms">Terms</ExternalLink>
        <ExternalLink href="https://flow.so/privacy-policy">Privacy Policy</ExternalLink>
      </div>
    </div>
  );
};

interface Props {
  graphType: ScatterChartType | BarChartType;
}

const Loading = ({ graphType }: Props) => {
  return (
    <div className={twMerge(infoBoxStyle, 'pointer-events-none')}>
      <div className="flex items-center justify-center space-x-2">
        <BouncingLogo />
        <div className="text-sm">{`Loading ${graphType}...`}</div>
      </div>
    </div>
  );
};

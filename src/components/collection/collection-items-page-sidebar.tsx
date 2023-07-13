import { ChainId, CollectionSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { CollectionHistoricalSale, ReservoirOrderDepth } from 'src/utils/types';
import { twMerge } from 'tailwind-merge';
import { ResponsiveSalesChart, SalesChartData } from '../charts/sales-chart';
import { ScatterChartType } from '../charts/types';
import { BouncingLogo } from '../common';
import { CollectionRecentSalesOrders } from './collection-recent-sales-orders';

// eslint-disable-next-line node/no-unsupported-features/es-syntax
const OrderDepthChart = dynamic(() => import('../charts/order-depth-chart'), { ssr: false });

export type Props = {
  className?: string;
  collectionChainId: ChainId;
  collectionAddress: string;
  collectionImage: string;
};

export const CollectionItemsPageSidebar = ({
  className = '',
  collectionChainId,
  collectionAddress,
  collectionImage
}: Props) => {
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [depthChartData, setDepthChartData] = useState<{ buy: ReservoirOrderDepth; sell: ReservoirOrderDepth }>();
  const [recentSalesOrdersData, setRecentSalesOrdersData] = useState<CollectionSaleAndOrder[]>([]);
  const [isSalesChartLoading, setIsSalesChartLoading] = useState(true);
  const [isDepthChartLoading, setIsDepthChartLoading] = useState(true);

  const fetchSalesChartData = async () => {
    setIsSalesChartLoading(true);
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/sales`);

    if (error) {
      console.error(error);
      setIsSalesChartLoading(false);
      return;
    }

    const chartData = result.map((sale: CollectionHistoricalSale) => {
      return {
        id: sale.id,
        salePrice: sale.salePriceEth,
        tokenImage: sale.tokenImage,
        collectionAddress,
        tokenId: sale.tokenId,
        timestamp: sale.timestamp
      } as SalesChartData;
    });

    setSalesChartData(chartData);
    setIsSalesChartLoading(false);
  };

  const fetchRecentSalesAndOrders = async () => {
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/salesorders`);

    if (error) {
      console.error(error);
      return;
    }

    setRecentSalesOrdersData(
      result
        .map((item: CollectionSaleAndOrder) => {
          const tokenId = item.tokenId;
          const tokenImage = item.tokenImage;

          // for collection and other complex offers, tokenId and tokenImage could be blank
          if (item.dataType === 'Offer') {
            if (!tokenImage) {
              item.tokenImage = collectionImage;
            }
            if (!tokenId) {
              item.tokenId = 'Offer';
            }
          }

          return item;
        })
        .sort((a: CollectionSaleAndOrder, b: CollectionSaleAndOrder) => b.timestamp - a.timestamp)
    );
  };

  const fetchOrderDepth = async () => {
    setIsDepthChartLoading(true);
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/orderdepth`);

    if (error) {
      console.error(error);
      setIsDepthChartLoading(false);
      return;
    }

    setDepthChartData(result);
    setIsDepthChartLoading(false);
  };

  useEffect(() => {
    fetchSalesChartData();
    fetchRecentSalesAndOrders();
    fetchOrderDepth();

    const interval = setInterval(() => {
      fetchRecentSalesAndOrders();
      fetchOrderDepth();
    }, 30 * 1000);

    return () => clearInterval(interval);
  }, [collectionAddress, collectionChainId]);

  return (
    <div className={twMerge('flex flex-col py-[0.87rem] w-full pr-4 space-y-2', className)}>
      <div>
        {/* {depthChartData && <ResponsiveSalesChart graphType={ScatterChartType.Sales} data={salesChartData} />} */}
        {depthChartData && <OrderDepthChart data={depthChartData} />}

        {isDepthChartLoading && <BouncingLogo />}
      </div>

      <div>
        {salesChartData.length > 0 && <ResponsiveSalesChart graphType={ScatterChartType.Sales} data={salesChartData} />}

        {isSalesChartLoading && <BouncingLogo />}
      </div>

      <div>
        {recentSalesOrdersData.length > 0 && (
          <CollectionRecentSalesOrders data={recentSalesOrdersData} collectionAddress={collectionAddress} />
        )}
      </div>
    </div>
  );
};

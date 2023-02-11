import { ChainId, CollectionHistoricalSale, CollectionSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { BouncingLogo } from 'src/components/common';
import { apiGet } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { ResponsiveSalesChart, SalesChartData } from '../charts/sales-chart';
import { ScatterChartType } from '../charts/types';
import { CollectionRecentSalesOrders } from './collection-recent-sales-orders';

export type Props = {
  className?: string;
  collectionAddress: string;
  collectionImage: string;
};

export const CollectionItemsPageSidebar = ({ className = '', collectionAddress, collectionImage }: Props) => {
  const { chain } = useNetwork();
  const chainId = chain?.id ?? ChainId.Mainnet;
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [recentSalesOrdersData, setRecentSalesOrdersData] = useState<CollectionSaleAndOrder[]>([]);
  const [isSalesChartLoading, setIsSalesChartLoading] = useState(true);

  const fetchSalesChartData = async () => {
    setIsSalesChartLoading(true);
    const { result, error } = await apiGet(`/collections/${chainId}:${collectionAddress}/sales`);

    if (error) {
      console.error(error);
      setIsSalesChartLoading(false);
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
    setIsSalesChartLoading(false);
  };

  const fetchRecentSalesAndOrders = async () => {
    const { result, error } = await apiGet(`/collections/${chainId}:${collectionAddress}/salesorders`);

    if (error) {
      console.error(error);
      return;
    }

    setRecentSalesOrdersData(
      result.map((item: CollectionSaleAndOrder) => {
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
    );
  };

  useEffect(() => {
    fetchSalesChartData();
    fetchRecentSalesAndOrders();

    const interval = setInterval(() => {
      fetchRecentSalesAndOrders();
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [collectionAddress, chainId]);

  return (
    <div className={twMerge('flex flex-col py-4 w-full pr-4', className)}>
      <div>
        {salesChartData.length > 0 && <ResponsiveSalesChart graphType={ScatterChartType.Sales} data={salesChartData} />}

        {isSalesChartLoading && <BouncingLogo />}
      </div>

      <div>{recentSalesOrdersData.length > 0 && <CollectionRecentSalesOrders data={recentSalesOrdersData} />}</div>
    </div>
  );
};

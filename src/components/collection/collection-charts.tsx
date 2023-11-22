import { ChainId, CollectionOrder } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { BouncingLogo, ExternalLink } from 'src/components/common';
import { apiGet } from 'src/utils';
import { secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ResponsiveBarChart } from '../charts/bar-chart';
import { OrdersChartDetails, SalesChartDetails } from '../charts/chart-details';
import { ResponsiveSalesChart, SalesChartData } from '../charts/sales-chart';
import { BarChartType, ScatterChartType } from '../charts/types';
import { CollectionHistoricalSale } from 'src/utils/types';
import { AvFooter } from '../astra/astra-footer';

const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type CollectionChartsProps = {
  className?: string;
  collectionAddress: string;
  collectionSlug: string;
  collectionChainId: ChainId;
  collectionImage: string;
  collectionName?: string;
};

export const CollectionCharts = ({
  className = '',
  collectionAddress,
  collectionSlug,
  collectionChainId,
  collectionImage,
  collectionName
}: CollectionChartsProps) => {
  const [salesChartData, setSalesChartData] = useState<SalesChartData[]>([]);
  const [listingsData, setListingsData] = useState<CollectionOrder[]>([]);
  const [bidsData, setBidsData] = useState<CollectionOrder[]>([]);
  const [selectedListings, setSelectedListings] = useState<CollectionOrder[]>([]);
  const [selectedBids, setSelectedBids] = useState<CollectionOrder[]>([]);
  const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  const [selectedBidIndex, setSelectedBidIndex] = useState(0);
  const [isSalesLoading, setIsSalesLoading] = useState(true);
  const [isListingsLoading, setIsListingsLoading] = useState(true);
  const [isBidsLoading, setIsBidsLoading] = useState(true);

  const displayListingDetails = (orders: CollectionOrder[], index: number) => {
    if (index !== selectedListingIndex) {
      setSelectedListingIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedListings.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedListings[i].id);
    }

    if (!arrayEquals) {
      setSelectedListings(orders.sort((a, b) => a.priceEth - b.priceEth));
    }
  };

  const displayBidDetails = (orders: CollectionOrder[], index: number) => {
    if (index !== selectedBidIndex) {
      setSelectedBidIndex(index);
    }

    let arrayEquals = false;
    if (orders.length === selectedBids.length) {
      arrayEquals = orders.every((v, i) => v.id === selectedBids[i].id);
    }

    if (!arrayEquals) {
      setSelectedBids(orders.sort((a, b) => a.priceEth - b.priceEth));
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
        id: sale.id,
        salePrice: sale.salePriceEth,
        tokenImage: sale.tokenImage,
        collectionAddress,
        collectionSlug,
        tokenId: sale.tokenId,
        timestamp: sale.timestamp
      } as SalesChartData;
    });

    setSalesChartData(chartData);
    setIsSalesLoading(false);
  };

  const fetchOrdersData = async (orderSide: 'buy' | 'sell') => {
    if (orderSide === 'buy') {
      setSelectedBids([]);
      setIsBidsLoading(true);
    } else {
      setSelectedListings([]);
      setIsListingsLoading(true);
    }
    const { result, error } = await apiGet(`/collections/${collectionChainId}:${collectionAddress}/orders`, {
      query: { orderSide }
    });

    if (error && orderSide === 'sell') {
      setIsListingsLoading(false);
      console.error(error);
      return;
    }

    if (error && orderSide === 'buy') {
      setIsBidsLoading(false);
      console.error(error);
      return;
    }

    if (orderSide === 'sell') {
      setListingsData(result);
      setIsListingsLoading(false);
    } else {
      setBidsData(
        result.map((order: CollectionOrder) => {
          const tokenId = order.tokenId;
          const tokenImage = order.tokenImage;

          // for collection and other complex offers, tokenId and tokenImage could be blank
          if (!tokenImage) {
            order.tokenImage = collectionImage;
          }
          if (!tokenId) {
            order.tokenId = 'Collection Bid';
          }

          return order;
        })
      );
      setIsBidsLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchOrdersData('sell');
    fetchOrdersData('buy');
  }, [collectionAddress, collectionChainId]);

  return (
    <div className={twMerge('w-full gap-2.5 h-full relative flex flex-col p-5', className)}>
      <div className="md:grid md:grid-cols-12 gap-5">
        <div className="md:col-span-6 lg:col-span-7 xl:col-span-8">
          {salesChartData.length > 0 && (
            <ResponsiveSalesChart graphType={ScatterChartType.Sales} data={salesChartData} />
          )}

          {isSalesLoading && <Loading graphType={ScatterChartType.Sales} />}
        </div>
        <div className={`md:col-span-6 lg:col-span-5 xl:col-span-4 ${salesChartData.length <= 0 ? 'mt-18' : ''}`}>
          {salesChartData.length > 0 && <SalesChartDetails data={salesChartData[0]} />}
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 gap-5">
        <div className="md:col-span-6 lg:col-span-7 xl:col-span-8">
          {listingsData.length > 5 && (
            <ResponsiveBarChart
              graphType={BarChartType.Listings}
              data={listingsData}
              displayDetails={displayListingDetails}
            />
          )}

          {isListingsLoading && <Loading graphType={BarChartType.Listings} />}
        </div>
        <div className="md:col-span-6 lg:col-span-5 xl:col-span-4 mt-18">
          {listingsData.length > 5 && (
            <OrdersChartDetails
              orders={selectedListings}
              index={selectedListingIndex}
              valueClassName={secondaryTextColor}
              setIndex={setSelectedListingIndex}
              collectionAddress={collectionAddress}
              collectionSlug={collectionSlug}
              collectionImage={collectionImage}
              collectionName={collectionName}
            />
          )}
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 gap-5">
        <div className="md:col-span-6 lg:col-span-7 xl:col-span-8">
          {bidsData.length > 5 && (
            <ResponsiveBarChart graphType={BarChartType.Bids} data={bidsData} displayDetails={displayBidDetails} />
          )}

          {isBidsLoading && <Loading graphType={BarChartType.Bids} />}
        </div>
        <div className="md:col-span-6 lg:col-span-5 xl:col-span-4 mt-18">
          {bidsData.length > 5 && (
            <OrdersChartDetails
              orders={selectedBids}
              index={selectedBidIndex}
              valueClassName={secondaryTextColor}
              setIndex={setSelectedBidIndex}
              collectionAddress={collectionAddress}
              collectionSlug={collectionSlug}
              collectionImage={collectionImage}
              collectionName={collectionName}
            />
          )}
        </div>
      </div>

      <div className={twMerge('w-full p-2 flex space-x-5 text-xs mt-6 z-50', secondaryTextColor)}>
        <ExternalLink href="https://pixl.so/terms">Terms</ExternalLink>
        <ExternalLink href="https://pixl.so/privacy-policy">Privacy Policy</ExternalLink>
      </div>
      <div className="-mx-5">
        <AvFooter />
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

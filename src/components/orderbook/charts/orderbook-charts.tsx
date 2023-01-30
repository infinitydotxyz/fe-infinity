import { ChainId, CollectionHistoricalSale, HistoricalSalesTimeBucket } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { ResponsiveScatterChart, SaleData, ScatterChartType } from './scatter-chart';

// const infoBoxStyle = 'flex items-center justify-center opacity-60 font-bold text-lg h-full';

export type OrderBookChartProps = {
  className?: string;
  collectionAddress: string;
};

export const OrderbookCharts = ({ className = '', collectionAddress }: OrderBookChartProps) => {
  const [salesData, setSalesData] = useState<SaleData[]>([]);
  const { chain } = useNetwork();
  const chainId = chain?.id ?? ChainId.Mainnet;
  const [selectedTimeBucket, setSelectedTimeBucket] = useState(HistoricalSalesTimeBucket.ONE_WEEK);
  // const [ordersData, setOrdersData] = useState<OrderData[]>([]);
  // const [selectedListings, setSelectedListings] = useState<SignedOBOrder[]>([]);
  // const [selectedOffers, setSelectedOffers] = useState<SignedOBOrder[]>([]);
  // const [selectedListingIndex, setSelectedListingIndex] = useState(0);
  // const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);
  // const [filter] = useState<TokensFilter>({});
  // const { order } = useCollectionOrderFetcher(100, filter, ''); // todo: use real data

  // const fetchOrdersDataForPriceRange = (minPrice: string, maxPrice: string) => {
  //   const newFilter: TokensFilter = {};
  //   newFilter.minPrice = minPrice;
  //   newFilter.maxPrice = maxPrice;
  //   setFilter({ ...filter, ...newFilter });
  // };

  // const displayListingDetails = (orders: SignedOBOrder[], index: number) => {
  //   if (index !== selectedListingIndex) {
  //     setSelectedListingIndex(index);
  //   }

  //   let arrayEquals = false;
  //   if (orders.length === selectedListings.length) {
  //     arrayEquals = orders.every((v, i) => v.id === selectedListings[i].id);
  //   }

  //   if (!arrayEquals) {
  //     setSelectedListings(orders);
  //   }
  // };

  // const displayOfferDetails = (orders: SignedOBOrder[], index: number) => {
  //   if (index !== selectedOfferIndex) {
  //     setSelectedOfferIndex(index);
  //   }

  //   let arrayEquals = false;
  //   if (orders.length === selectedOffers.length) {
  //     arrayEquals = orders.every((v, i) => v.id === selectedOffers[i].id);
  //   }

  //   if (!arrayEquals) {
  //     setSelectedOffers(orders);
  //   }
  // };

  const fetchSalesDataForTimeBucket = async (timeBucket: HistoricalSalesTimeBucket) => {
    const { result, error } = await apiGet(`/collections/${chainId}:${collectionAddress}/sales`, {
      query: {
        period: timeBucket
      }
    });

    if (error) {
      console.error(error);
      return;
    }

    setSalesData(
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
  };

  useEffect(() => {
    fetchSalesDataForTimeBucket(selectedTimeBucket);
  }, [selectedTimeBucket]);

  // useEffect(() => {
  //   setOrdersData(
  //     [...new Array(300)].map(
  //       () =>
  //         ({
  //           order: {
  //             isSellOrder: Math.random() > 0.5,
  //             startPriceEth: +(Math.random() * (100 - 0.01) + 0.01).toFixed(2),
  //             nfts: [
  //               {
  //                 collectionAddress: '0x123',
  //                 collectionName: 'Test Collection ' + Math.floor(Math.random() * 100),
  //                 collectionImage:
  //                   'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750',
  //                 tokens: [
  //                   {
  //                     tokenId: Math.floor(Math.random() * 10000).toString(),
  //                     tokenImage:
  //                       'https://i.seadn.io/gae/8GNiYHlI96za-qLdNuBdhW64Y9fNquLw4V9NojDZt5XZhownn8tHQJTEMfZfqfRzk9GngBxiz6BKsr_VaHFyGk6Lm2Qai6RXgH7bwB4?auto=format&w=750'
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         } as OrderData)
  //     )
  //   );
  // });

  return (
    <div className={twMerge('w-full h-full relative flex flex-col p-2', className)}>
      <div className="flex">
        <div className="w-full p-2">
          {salesData.length > 0 && (
            <ResponsiveScatterChart
              key={selectedTimeBucket}
              selectedTimeBucket={selectedTimeBucket}
              setSelectedTimeBucket={setSelectedTimeBucket}
              graphType={ScatterChartType.Sales}
              data={salesData}
            />
          )}

          {/* {!isLoading && salesData.length > 0 && (
            <ResponsiveScatterChart
              key={selectedTimeBucket}
              selectedTimeBucket={selectedTimeBucket}
              graphType={ScatterChartType.Sales}
              data={salesData}
              fetchData={fetchSalesDataForTimeBucket}
            />
          )} */}

          {/* {isLoading && <Loading />} */}
        </div>
      </div>

      {/* <div className="flex">
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
            valueClassName={secondaryTextColor}
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
            valueClassName={secondaryTextColor}
            setIndex={setSelectedOfferIndex}
          />
        </div>
      </div> */}
    </div>
  );
};

// const Loading = () => {
//   return (
//     <div className={twMerge(infoBoxStyle, textColor, 'pointer-events-none')}>
//       <div className="flex flex-col items-center justify-center">
//         <Spinner />
//         <div className="mt-4">Loading...</div>
//       </div>
//     </div>
//   );
// };

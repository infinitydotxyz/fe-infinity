import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { PriceBarGraph, GraphData } from 'src/components/airbnb-svg/price-bar-graph';
import { OrderbookContent } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';
import { OrderbookProvider, useOrderbook } from 'src/components/orderbook/OrderbookContext';
import { BiReset } from 'react-icons/bi';

const OrderbookPage = () => {
  return (
    <PageBox title="Orderbook">
      <OrderbookProvider>
        <_OrderbookPage />
      </OrderbookProvider>
    </PageBox>
  );
};

export default OrderbookPage;

// =====================================================

const _OrderbookPage = () => {
  const [listings, setListings] = useState<GraphData[]>([]);
  const [offers, setOffers] = useState<GraphData[]>([]);
  const { updateFilters } = useOrderbook();

  const handleOnClick = (minPrice: string, maxPrice: string) => {
    updateFilters([
      { name: 'minPrice', value: minPrice },
      { name: 'maxPrice', value: maxPrice }
    ]);
  };

  return (
    <>
      {!isProd() && (listings.length > 0 || offers.length > 0) && (
        <div className="w-full h-full relative p-4 flex flex-col mb-6 overflow-clip bg-black rounded-2xl">
          <PriceBarGraph title="Listings" data={listings} flip={true} onClick={handleOnClick} />
          <PriceBarGraph title="Offers" data={offers} flip={false} onClick={handleOnClick} />

          <BiReset
            onClick={() => handleOnClick('', '')}
            className="text-white opacity-75 h-5 w-5 absolute top-3 right-4"
          />
        </div>
      )}

      <OrderbookContent
        className=""
        onData={(data) => {
          const graphData = data.map((x) => {
            const result: GraphData = {
              price: x.endPriceEth,
              isSellOrder: x.isSellOrder
            };
            return result;
          });

          setListings(graphData.filter((i) => i.isSellOrder));
          setOffers(graphData.filter((i) => !i.isSellOrder));
        }}
      />
    </>
  );
};

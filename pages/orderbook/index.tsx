import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { PriceBarGraph, GraphData } from 'src/components/airbnb-svg/price-bar-graph';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const [listings, setListings] = useState<GraphData[]>([]);
  const [offers, setOffers] = useState<GraphData[]>([]);

  return (
    <PageBox title="Orderbook">
      {!isProd() && (
        <div className="w-full h-full flex flex-col mb-6 bg-black rounded-3xl">
          <PriceBarGraph title="Listings" data={listings} flip={true} />
          <PriceBarGraph title="Offers" data={offers} flip={false} />
        </div>
      )}

      <OrderbookContainer
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
    </PageBox>
  );
};

export default OrderbookPage;

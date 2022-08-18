import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { PriceBarGraph, GraphData } from 'src/components/airbnb-svg/price-bar-graph';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const [data, setData] = useState<GraphData[]>([]);

  return (
    <PageBox title="Orderbook">
      {!isProd() && (
        <div className="w-full h-full mb-6">
          <PriceBarGraph data={data} />
        </div>
      )}

      <OrderbookContainer
        className=""
        onData={(data) => {
          const GraphData = data.map((x) => {
            const result: GraphData = {
              price: x.endPriceEth,
              isSellOrder: x.isSellOrder
            };
            return result;
          });

          return setData(GraphData);
        }}
      />
    </PageBox>
  );
};

export default OrderbookPage;

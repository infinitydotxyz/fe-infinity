import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { PriceBarGraph, BubbleData } from 'src/components/airbnb-svg/price-bar-graph';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const [data, setData] = useState<BubbleData[]>([]);

  return (
    <PageBox title="Orderbook">
      {!isProd() && (
        <div className="w-full h-full">
          <PriceBarGraph data={data} />
        </div>
      )}

      <OrderbookContainer
        className=""
        onData={(data) => {
          const bubbleData = data.map((x) => {
            const result: BubbleData = {
              value: x.endPriceEth,
              id: '',
              label: '3 eth',
              group: 'eth',
              isSellOrder: x.isSellOrder,
              color: Math.floor(Math.random() * 16777215).toString(16),
              tooltip: x.endPriceEth.toString()
            };
            return result;
          });

          return setData(bubbleData);
        }}
      />
    </PageBox>
  );
};

export default OrderbookPage;

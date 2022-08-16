import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { BubbleData, PriceBubbles } from 'src/components/d3/price-bubbles';
import ThesholdExample from 'src/components/d3/visGrid';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const [data, setData] = useState<BubbleData[]>([]);

  return (
    <PageBox title="Orderbook">
      {!isProd() && (
        <div className="w-full h-full">
          <PriceBubbles
            dataArray={data}
            onClick={(d) => {
              console.log(data[d]);
            }}
          />

          <ThesholdExample />
        </div>
      )}

      <OrderbookContainer
        onData={(data) => {
          const bubbleData = data.map((x) => {
            return {
              value: x.endPriceEth,
              id: '',
              label: '3 eth',
              group: 'eth',
              isSellOrder: x.isSellOrder
            } as BubbleData;
          });

          return setData(bubbleData);
        }}
      />
    </PageBox>
  );
};

export default OrderbookPage;

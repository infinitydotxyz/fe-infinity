import { useState } from 'react';
import { PageBox } from 'src/components/common';
import { BubbleData, PriceBubbles } from 'src/components/d3/price-bubbles';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { isProd } from 'src/utils';

const OrderbookPage = () => {
  const [data, setData] = useState<BubbleData[]>([]);

  return (
    <PageBox title="Orderbook">
      {!isProd() && (
        <PriceBubbles
          dataArray={data}
          onClick={(d) => {
            console.log(data[d]);
          }}
        />
      )}

      <OrderbookContainer
        onData={(data) => {
          const bubbleData = data.map((x) => {
            return { value: x.endPriceEth, id: '', label: '3 eth', group: 'eth' } as BubbleData;
          });

          return setData(bubbleData);
        }}
      />
    </PageBox>
  );
};

export default OrderbookPage;

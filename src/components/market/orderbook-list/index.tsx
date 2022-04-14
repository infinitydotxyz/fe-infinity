import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button } from 'src/components/common';
import { BuyOrderList, SellOrderList } from '../order-list';
import { useOrderPager } from '../useOrderPager';
import { OrderbookRow } from './orderbook_row';

export const OrderbookList = (): JSX.Element => {
  const { buyOrders, sellOrders, fetchMore, isLoading } = useOrderPager(true, 4);

  return (
    <>
      <div className={'flex flex-col items-start'}>
        {buyOrders.map((order: OBOrder) => {
          return <OrderbookRow key={Math.random()} order={order} />;
        })}

        <BuyOrderList
          orders={buyOrders}
          onClickAction={() => {
            console.log('click');
          }}
        />

        <SellOrderList
          orders={sellOrders}
          onClickAction={() => {
            console.log('click');
          }}
        />

        {isLoading && <div>Loading</div>}
      </div>

      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outline"
          onClick={() => {
            fetchMore();
          }}
        >
          More
        </Button>
      </div>
    </>
  );
};

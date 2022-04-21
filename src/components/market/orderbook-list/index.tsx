import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button } from 'src/components/common';
import { useOrderPager } from '../useOrderPager';
import { OrderbookRow } from './orderbook_row';

export const OrderbookList = (): JSX.Element => {
  const { orders, fetchMore, isLoading } = useOrderPager(4);

  return (
    <>
      <div className={'flex flex-col items-start'}>
        {orders.map((order: OBOrder) => {
          return <OrderbookRow key={order.id} order={order} />;
        })}

        {isLoading && <div className="w-full text-center">Loading</div>}
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

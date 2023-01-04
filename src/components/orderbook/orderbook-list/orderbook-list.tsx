import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { CenterFixed, ScrollLoader, Spinner } from 'src/components/common';
import { OrderbookRow } from './orderbook-row';

interface Props2 {
  orderList: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => void;
  hasMoreOrders?: boolean;
  hasNoData?: boolean;
}

export const OrderbookList = ({ orderList, isLoading, fetchMore, hasMoreOrders, hasNoData }: Props2): JSX.Element => {
  return (
    <div className="flex overflow-y-clip overflow-x-clip">
      <div className="flex flex-col items-start w-full h-full overflow-y-auto  ">
        {hasNoData && <div className="font-heading">No results found</div>}

        {!isLoading &&
          orderList.length > 0 &&
          orderList.map((order: SignedOBOrder, i: number) => {
            return <OrderbookRow key={`${i}-${order.id}`} order={order} />;
          })}

        {isLoading && (
          <CenterFixed>
            <Spinner />
          </CenterFixed>
        )}

        {hasMoreOrders && <ScrollLoader onFetchMore={fetchMore} />}
      </div>
    </div>
  );
};

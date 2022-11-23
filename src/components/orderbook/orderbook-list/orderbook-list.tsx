import React from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { CenterFixed, ScrollLoader, Spinner } from 'src/components/common';
import { OrderbookRow } from './orderbook-row';
import { OrderbookFilters } from './filters/orderbook-filters';

interface Props2 {
  orderList: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => void;
  showFilters?: boolean;
  hasMoreOrders?: boolean;
  hasNoData?: boolean;
}

export const OrderbookList = ({
  orderList,
  showFilters,
  isLoading,
  fetchMore,
  hasMoreOrders,
  hasNoData
}: Props2): JSX.Element => {
  return (
    <div className="flex gap-4 pointer-events-auto">
      {showFilters && (
        <div className="w-1/5 shrink-0">
          <OrderbookFilters />
        </div>
      )}
      <div className="flex flex-col items-start w-full">
        {hasNoData && <div className="font-heading">No results found</div>}

        {!isLoading &&
          orderList.length > 0 &&
          orderList.map((order: SignedOBOrder, i: number) => {
            return <OrderbookRow key={`${i}-${order.id}`} order={order} isFilterOpen={showFilters ?? false} />;
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

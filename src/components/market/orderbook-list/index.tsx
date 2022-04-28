import React, { useState } from 'react';
import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button } from 'src/components/common';
import { useOrderPager } from '../useOrderPager';
import { OrderbookRow } from './orderbook_row';
import { OrderbookFilters } from './filters/orderbook-filters';

export const OrderbookList = (): JSX.Element => {
  const { orders, fetchMore, isLoading } = useOrderPager();
  const [showFilters, setShowFilters] = useState<boolean>(false);

  if (orders.length === 0) {
    return <div className="flex items-center justify-center">Loading</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {/* Filters & Sort */}
        <div className="text-right">
          <Button
            variant="outline"
            onClick={() => {
              setShowFilters(!showFilters);
            }}
            className="py-2.5 mr-2 font-heading"
          >
            {showFilters ? 'Hide' : 'Show'} filter
          </Button>
        </div>

        {/* Orderbook List */}
        <div className="flex gap-4">
          {showFilters && (
            <div className="w-1/4 flex-none">
              <OrderbookFilters />
            </div>
          )}
          <div className={'flex flex-col items-start'}>
            {orders.map((order: OBOrder) => {
              return <OrderbookRow key={order.id} order={order} />;
            })}

            {isLoading && <div className="w-full text-center">Loading</div>}
          </div>
        </div>
      </div>

      {/* Load More */}
      {!isLoading && (
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
      )}
    </>
  );
};

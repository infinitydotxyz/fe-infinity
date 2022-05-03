import React, { useState } from 'react';
import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button, Dropdown } from 'src/components/common';
import { SORT_FILTERS, useOrderbook } from '../OrderbookContext';
import { OrderbookRow } from './orderbook_row';
import { OrderbookFilters } from './filters/orderbook-filters';

const SORT_LABELS: {
  [key: string]: string;
} = {
  [SORT_FILTERS.highestPrice]: 'Highest Price',
  [SORT_FILTERS.lowestPrice]: 'Lowest Price',
  [SORT_FILTERS.mostRecent]: 'Most Recent'
};

const getSortLabel = (key: string | undefined) => {
  return key ? SORT_LABELS[key] || 'Sort' : 'Sort';
};

export const OrderbookList = (): JSX.Element => {
  const { orders, fetchMore, isLoading, updateFilter, filters } = useOrderbook();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  if (orders.length === 0) {
    return <div className="flex items-center justify-center">Loading</div>;
  }

  const onClickSort = (_label: string, sortOrder: string) => {
    setLabel(_label);
    updateFilter('sort', sortOrder);
  };

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
          <Dropdown
            label={label}
            items={[
              {
                label: SORT_LABELS[SORT_FILTERS.highestPrice],
                onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.highestPrice], SORT_FILTERS.highestPrice)
              },
              {
                label: SORT_LABELS[SORT_FILTERS.lowestPrice],
                onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.lowestPrice], SORT_FILTERS.lowestPrice)
              },
              {
                label: SORT_LABELS[SORT_FILTERS.mostRecent],
                onClick: () => onClickSort(SORT_LABELS[SORT_FILTERS.mostRecent], SORT_FILTERS.mostRecent)
              }
            ]}
          />
        </div>

        {/* Orderbook List */}
        <div className="flex gap-4">
          {showFilters && (
            <div className="w-1/4 flex-none">
              <OrderbookFilters />
            </div>
          )}
          <div className="flex flex-col items-start">
            {orders.map((order: OBOrder, i) => {
              return <OrderbookRow key={`${i}-${order.id}`} order={order} />;
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

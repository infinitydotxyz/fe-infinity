import React, { Fragment, useState } from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, Dropdown, ScrollLoader } from 'src/components/common';
import { OrderbookProvider, SORT_FILTERS, useOrderbook } from '../OrderbookContext';
import { OrderbookRow } from './orderbook-row';
import { OrderbookFilters } from './filters/orderbook-filters';
import { useRouter } from 'next/router';

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

interface OrderbookContainerProps {
  collectionId?: string;
  tokenId?: string;
  className?: string;
}

export const OrderbookContainer = ({ collectionId, tokenId, className }: OrderbookContainerProps): JSX.Element => {
  return (
    <OrderbookProvider collectionId={collectionId} tokenId={tokenId}>
      <OrderbookContent className={className} />
    </OrderbookProvider>
  );
};

export const OrderbookContent = ({ className }: { className?: string }): JSX.Element => {
  const { query } = useRouter();
  const { orders, fetchMore, isLoading, updateFilter, filters, hasMoreOrders } = useOrderbook();
  const [showFilters, setShowFilters] = useState<boolean>(
    query.orderTypes || query.collections || query.minPrice || query.maxPrice || query.numberOfNfts ? true : false
  );
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  const onClickSort = (_label: string, sortOrder: string) => {
    setLabel(_label);
    updateFilter('sort', sortOrder);
  };

  return (
    <>
      <div className={`flex flex-col gap-1 ${className}`}>
        {/* Filters & Sort */}
        <div className="text-right pb-8">
          <Button
            variant="outline"
            onClick={() => {
              setShowFilters(!showFilters);
            }}
            className="py-2.5 mr-2 font-heading pointer-events-auto"
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
            className="pointer-events-auto"
          />
        </div>

        <OrderbookList
          orders={orders}
          showFilters={showFilters}
          isLoading={isLoading}
          fetchMore={fetchMore}
          hasMoreOrders={hasMoreOrders}
        />
      </div>
    </>
  );
};

type OBListDummyProps = {
  orders: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => Promise<void>;
  showFilters?: boolean;
  hasMoreOrders?: boolean;
};

const OrderbookList = ({ orders, showFilters, isLoading, fetchMore, hasMoreOrders }: OBListDummyProps): JSX.Element => {
  return (
    <div className="flex justify-center align-items gap-4 pointer-events-auto">
      {showFilters && (
        <div className="w-1/4 flex-none">
          <OrderbookFilters />
        </div>
      )}
      <div className="flex flex-col items-start w-full">
        {!isLoading && !hasMoreOrders && orders && orders.length === 0 ? (
          <div className="font-heading">No data available.</div>
        ) : null}

        {orders.length > 0 &&
          orders.map((order: SignedOBOrder, i) => {
            return <OrderbookRow key={`${i}-${order.id}`} order={order} isFilterOpen={showFilters ?? false} />;
          })}

        {/* {orders.length === 0 && !isLoading && <div>No results found</div>} */}

        {/* {isLoading && (
          <div className="w-full flex justify-center align-items">
            <Spinner />
          </div>
        )} */}
        {isLoading && <LoadingRow />}

        {hasMoreOrders && <ScrollLoader onFetchMore={fetchMore} />}
      </div>
    </div>
  );
};

// =======================================================================

const LoadingRow = () => (
  <>
    {Array.from(Array(4).keys())?.map((x, i) => (
      <Fragment key={i}>
        <div className="w-full h-[110px] mb-3 bg-theme-light-200 rounded-3xl animate-pulse"></div>
      </Fragment>
    ))}
  </>
);

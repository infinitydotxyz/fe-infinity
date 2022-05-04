import React, { useEffect, useState } from 'react';
import { OBOrder } from '@infinityxyz/lib/types/core';
import { Button, Dropdown, SVG } from 'src/components/common';
import { OrderbookProvider, SORT_FILTERS, useOrderbook } from '../OrderbookContext';
import { OrderbookRow } from './orderbook_row';
import { OrderbookFilters } from './filters/orderbook-filters';
import { getOrders } from 'src/utils/marketUtils';

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

export const OrderbookContainer = ({ collectionId }: { collectionId?: string }): JSX.Element => {
  if (collectionId) {
    return (
      <div>
        <OrderbookForCollection id={collectionId} />
      </div>
    );
  } else {
    return (
      <OrderbookProvider>
        <OrderbookList />
      </OrderbookProvider>
    );
  }
};

const AMOUNT_OF_ORDERS = 10;

export const OrderbookForCollection = ({ id }: { id: string }): JSX.Element => {
  const [orders, setOrders] = useState<OBOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(AMOUNT_OF_ORDERS);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const orders = await getOrders({ collections: [id] }, limit);
      setOrders(orders);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [limit]);

  const fetchMore = async () => {
    setLimit(limit + AMOUNT_OF_ORDERS);
  };

  return (
    <div>
      <OrderbookListDummy orders={orders} isLoading={isLoading} fetchMore={fetchMore} />
    </div>
  );
};

export const OrderbookList = (): JSX.Element => {
  const { orders, fetchMore, isLoading, updateFilter, filters } = useOrderbook();
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  const onClickSort = (_label: string, sortOrder: string) => {
    setLabel(_label);
    updateFilter('sort', sortOrder);
  };

  return (
    <>
      <div className="flex flex-col gap-1">
        {/* Filters & Sort */}
        <div className="text-right pb-8">
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
        <OrderbookListDummy orders={orders} showFilters={showFilters} isLoading={isLoading} fetchMore={fetchMore} />
      </div>
    </>
  );
};

type OBListDummyProps = {
  orders: OBOrder[];
  isLoading: boolean;
  fetchMore: () => Promise<void>;
  showFilters?: boolean;
};

const OrderbookListDummy = ({ orders, showFilters, isLoading, fetchMore }: OBListDummyProps): JSX.Element => {
  return (
    <div className="flex justify-center align-items gap-4">
      {showFilters && (
        <div className="w-1/4 flex-none">
          <OrderbookFilters />
        </div>
      )}
      <div className="flex flex-col items-start">
        {orders.length > 0 &&
          orders.map((order: OBOrder, i) => {
            return <OrderbookRow key={`${i}-${order.id}`} order={order} />;
          })}

        {orders.length === 0 && !isLoading && <div>No Results</div>}

        {isLoading && (
          <div className="w-full flex justify-center align-items">
            <SVG.spinner className="w-12 h-12 m-3 text-gray-200 animate-spin dark:text-gray-600 fill-black" />
          </div>
        )}

        {/* Load More */}
        {!isLoading && orders.length > 0 && (
          <div className="w-full flex justify-center align-items">
            <Button variant="outline" onClick={fetchMore}>
              More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { Button, CenteredContent, Dropdown, ScrollLoader, Spinner } from 'src/components/common';
import { OrderbookProvider, SORT_FILTERS, useOrderbook } from '../OrderbookContext';
import { OrderbookRow } from './orderbook-row';
import { OrderbookFilters } from './filters/orderbook-filters';
import { useRouter } from 'next/router';
import { BuyNFTDrawer } from '../order-drawer/buy-nft-drawer';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { WaitingForTxModal } from '../order-drawer/waiting-for-tx-modal';

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

interface Props {
  collectionId?: string;
  tokenId?: string;
  className?: string;
}

export const OrderbookContainer = ({ collectionId, tokenId, className }: Props): JSX.Element => {
  return (
    <OrderbookProvider collectionId={collectionId} tokenId={tokenId}>
      <OrderbookContent className={className} />
    </OrderbookProvider>
  );
};

export const OrderbookContent = ({ className }: { className?: string }): JSX.Element => {
  const { query } = useRouter();
  const { orders, fetchMore, isLoading, updateFilter, filters, hasMoreOrders, hasNoData } = useOrderbook();
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
      <div className={`flex flex-col gap-1 min-h-[1024px] ${className}`}>
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
          hasNoData={hasNoData}
        />
      </div>
    </>
  );
};

interface Props2 {
  orders: SignedOBOrder[];
  isLoading: boolean;
  fetchMore: () => Promise<void>;
  showFilters?: boolean;
  hasMoreOrders?: boolean;
  hasNoData?: boolean;
}

const OrderbookList = ({
  orders,
  showFilters,
  isLoading,
  fetchMore,
  hasMoreOrders,
  hasNoData
}: Props2): JSX.Element => {
  const [clickedOrders, setClickedOrders] = useState<SignedOBOrder[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [completeOrderTxHash, setCompleteOrderTxHash] = useState('');
  const { orderDrawerOpen, setOrderDrawerOpen } = useOrderContext();
  const { hasOrderDrawer } = useDrawerContext();

  useEffect(() => {
    if (orderDrawerOpen && !hasOrderDrawer()) {
      setShowDrawer(true);
    }
  }, [orderDrawerOpen]);

  const first = clickedOrders.length > 0 ? clickedOrders[0] : undefined;

  return (
    <div className="flex justify-center align-items gap-4 pointer-events-auto">
      {showFilters && (
        <div className="w-1/4 flex-none">
          <OrderbookFilters />
        </div>
      )}
      <div className="flex flex-col items-start w-full">
        {hasNoData && <div className="font-heading">No results found</div>}

        {orders.length > 0 &&
          orders.map((order: SignedOBOrder, i) => {
            return (
              <OrderbookRow
                onClickActionBtn={(order) => {
                  const exists = clickedOrders.findIndex((o) => o.id === order.id) !== -1;
                  if (!exists) {
                    const arr = [...clickedOrders, order];

                    setClickedOrders(arr);
                  }

                  setShowDrawer(true);
                }}
                key={`${i}-${order.id}`}
                order={order}
                isFilterOpen={showFilters ?? false}
              />
            );
          })}

        {isLoading && (
          <CenteredContent>
            <Spinner />
          </CenteredContent>
        )}

        {hasMoreOrders && <ScrollLoader onFetchMore={fetchMore} />}
      </div>

      <BuyNFTDrawer
        onClickRemove={(removingOrder) => {
          const arr = clickedOrders.filter((o) => o.id !== removingOrder.id);
          setClickedOrders(arr);

          if (arr.length === 0) {
            setShowDrawer(false);
            setOrderDrawerOpen(false);
          }
        }}
        title={first?.isSellOrder ? 'Buy Order' : 'Sell Order'}
        submitTitle={first?.isSellOrder ? 'Buy' : 'Sell'}
        orders={clickedOrders}
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setOrderDrawerOpen(false);
        }}
        onSubmitDone={(hash: string) => {
          setShowDrawer(false);
          setOrderDrawerOpen(false);
          setCompleteOrderTxHash(hash);
        }}
      />

      {completeOrderTxHash && (
        <WaitingForTxModal
          title={'Complete Order'}
          txHash={completeOrderTxHash}
          onClose={() => setCompleteOrderTxHash('')}
        />
      )}
    </div>
  );
};

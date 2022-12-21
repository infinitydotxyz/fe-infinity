import React, { useEffect, useState } from 'react';
import { AOutlineButton } from 'src/components/astra';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { getSortLabel, OrderbookProvider, SORT_FILTERS, SORT_LABELS, useOrderbook } from '../OrderbookContext';
import { OrderbookList } from './orderbook-list';

interface Props {
  collectionId?: string;
  tokenId?: string;
  className?: string;
}

export const OrderbookContainer = ({ collectionId, tokenId, className = '' }: Props): JSX.Element => {
  return (
    <OrderbookProvider collectionId={collectionId} tokenId={tokenId}>
      <OrderbookContent className={className} />
    </OrderbookProvider>
  );
};

// ======================================================

interface Props4 {
  className?: string;
}

export const OrderbookContent = ({ className }: Props4) => {
  // const { query } = useRouter();
  const { orders, fetchMore, isLoading, updateFilter, filters, hasMoreOrders, hasNoData } = useOrderbook();
  const [showFilters, setShowFilters] = useState<boolean>(
    true
    // query.orderTypes || query.collections || query.minPrice || query.maxPrice || query.numberOfNfts ? true : false
  );
  const [label, setLabel] = useState<string>(getSortLabel(filters?.sort));

  useEffect(() => {
    setLabel(getSortLabel(filters?.sort));
  }, [filters]);

  const onClickSort = (_label: string, sortOrder: string) => {
    updateFilter('sort', sortOrder);
  };

  return (
    <>
      <div className={`flex flex-col h-full overflow-y-clip min-h-[50vh] ${className}`}>
        <div className="gap-3 flex justify-end pb-6">
          <AOutlineButton
            onClick={() => {
              setShowFilters(!showFilters);
            }}
            className="pointer-events-auto"
          >
            {showFilters ? 'Hide' : 'Show'} filter
          </AOutlineButton>
          <ADropdown
            alignMenuRight={true}
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
          orderList={orders}
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

import { useEffect, useState } from 'react';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { getSortLabel, OrderbookContextProvider, SORT_FILTERS, SORT_LABELS, useOrderbook } from '../OrderbookContext';
import { OrderbookList } from './orderbook-list';

interface Props {
  collectionId?: string;
  tokenId?: string;
  className?: string;
  canShowAssetModal?: boolean;
}

enum OrderBy {
  Price = 'price',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export const OrderbookContainer = ({
  collectionId,
  tokenId,
  className = '',
  canShowAssetModal
}: Props): JSX.Element => {
  return (
    <OrderbookContextProvider
      kind={'token'}
      context={{ collectionAddress: collectionId ?? '', tokenId: tokenId ?? '' }}
    >
      <OrderbookContent className={className} canShowAssetModal={canShowAssetModal} />
    </OrderbookContextProvider>
  );
};

// ======================================================

interface Props4 {
  className?: string;
  canShowAssetModal?: boolean;
}

const OrderbookContent = ({ className, canShowAssetModal }: Props4) => {
  // const { query } = useRouter();
  const {
    orders,
    fetchMore,
    isLoading,
    updateFilter,
    updateFilters,
    updateFilterArray,
    filters,
    setFilters,
    hasMoreOrders,
    hasNoData
  } = useOrderbook();
  const [sortLabel, setSortLabel] = useState<string>(SORT_LABELS[SORT_FILTERS.highestPrice]);
  const [orderTypeLabel, setOrderTypeLabel] = useState<string>('Listings');

  useEffect(() => {
    setSortLabel(getSortLabel(filters?.sort, SORT_LABELS[SORT_FILTERS.highestPrice]));
  }, [filters]);

  const onClickSort = (_label: string, sortOrder: string) => {
    updateFilter('sort', sortOrder);
  };

  const { orderTypes = [] } = filters;

  const setMinPrice = (value: string) => {
    const newFilters = { ...filters };
    newFilters.minPrice = value;
    newFilters.orderBy = OrderBy.Price;
    setFilters(newFilters);
  };

  const setMaxPrice = (value: string) => {
    const newFilters = { ...filters };
    newFilters.maxPrice = value;
    newFilters.orderBy = OrderBy.Price;
    setFilters(newFilters);
  };

  const onPricesClear = () => {
    updateFilters([
      { name: 'minPrice', value: '' },
      { name: 'maxPrice', value: '' }
    ]);
  };

  return (
    <>
      <div className={`flex flex-col h-full overflow-y-clip min-h-[50vh] ${className}`}>
        <div className="gap-3 flex justify-end">
          <ADropdown
            label={orderTypeLabel}
            items={[
              {
                label: 'Listings',
                onClick: () => {
                  setOrderTypeLabel('Listings');
                  updateFilterArray('orderTypes', orderTypes, 'Listing', true);
                  updateFilterArray('orderTypes', orderTypes, 'Offer', false);
                }
              },
              {
                label: 'Offers',
                onClick: () => {
                  setOrderTypeLabel('Offers');
                  updateFilterArray('orderTypes', orderTypes, 'Offer', true);
                  updateFilterArray('orderTypes', orderTypes, 'Listing', false);
                }
              }
            ]}
          />

          <APriceFilter onClear={onPricesClear} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />

          <ADropdown
            alignMenuRight={true}
            label={sortLabel}
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
          canShowAssetModal={canShowAssetModal}
          orderList={orders}
          isLoading={isLoading}
          fetchMore={fetchMore}
          hasMoreOrders={hasMoreOrders}
          hasNoData={hasNoData}
        />
      </div>
    </>
  );
};

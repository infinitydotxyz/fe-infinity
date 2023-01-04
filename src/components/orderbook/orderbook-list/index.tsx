import { Menu } from '@headlessui/react';
import { useEffect, useState } from 'react';
import { AButton, ATextButton } from 'src/components/astra';
import {
  ACustomMenuButton,
  ACustomMenuContents,
  ACustomMenuItems,
  ADropdown,
  ADropdownButton
} from 'src/components/astra/astra-dropdown';
import { TextInputBox } from 'src/components/common';
import { getSortLabel, OrderbookProvider, SORT_FILTERS, SORT_LABELS, useOrderbook } from '../OrderbookContext';
import { OrderbookList } from './orderbook-list';

interface Props {
  collectionId?: string;
  tokenId?: string;
  className?: string;
}

enum OrderBy {
  Price = 'price',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export const OrderbookContainer = ({ collectionId, tokenId, className = '' }: Props): JSX.Element => {
  return (
    <OrderbookProvider kind={'token'} context={{ collectionAddress: collectionId ?? '', tokenId: tokenId ?? '' }}>
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
  const [minPriceVal, setMinPriceVal] = useState(filters.minPrice || '');
  const [maxPriceVal, setMaxPriceVal] = useState(filters.maxPrice || '');

  useEffect(() => {
    setSortLabel(getSortLabel(filters?.sort, SORT_LABELS[SORT_FILTERS.highestPrice]));
  }, [filters]);

  const onClickSort = (_label: string, sortOrder: string) => {
    updateFilter('sort', sortOrder);
  };

  const { orderTypes = [] } = filters;

  const onClear = () => {
    setMinPriceVal('');
    setMaxPriceVal('');
    updateFilters([
      { name: 'minPrice', value: '' },
      { name: 'maxPrice', value: '' }
    ]);
  };

  return (
    <>
      <div className={`flex flex-col h-full overflow-y-clip min-h-[50vh] ${className}`}>
        <div className="gap-3 flex justify-end pb-6">
          <ADropdown
            hasBorder={false}
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

          <Menu>
            {({ open }) => (
              <ACustomMenuContents>
                <span>
                  <ACustomMenuButton>
                    <ATextButton tooltip="Click to open price filter">
                      <ADropdownButton>Price</ADropdownButton>
                    </ATextButton>
                  </ACustomMenuButton>
                </span>

                {open && (
                  <ACustomMenuItems open={open}>
                    <div className="flex">
                      <TextInputBox
                        addEthSymbol={true}
                        type="number"
                        className="border-gray-300 font-heading"
                        label="Min"
                        placeholder=""
                        value={minPriceVal}
                        onChange={(value) => {
                          setMinPriceVal(value);
                          const newFilters = { ...filters };
                          newFilters.minPrice = value;
                          newFilters.orderBy = OrderBy.Price;
                          setFilters(newFilters);
                        }}
                      />
                      <TextInputBox
                        addEthSymbol={true}
                        type="number"
                        className="border-gray-300 font-heading ml-2"
                        label="Max"
                        placeholder=""
                        value={maxPriceVal}
                        onChange={(value) => {
                          setMaxPriceVal(value);
                          const newFilters = { ...filters };
                          newFilters.maxPrice = value;
                          newFilters.orderBy = OrderBy.Price;
                          setFilters(newFilters);
                        }}
                      />
                    </div>
                    <Menu.Button onClick={onClear} className="mt-2 float-left">
                      <AButton highlighted>Clear</AButton>
                    </Menu.Button>
                  </ACustomMenuItems>
                )}
              </ACustomMenuContents>
            )}
          </Menu>

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

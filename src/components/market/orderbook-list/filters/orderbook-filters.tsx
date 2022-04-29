import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Button, EthSymbol, InputBox } from 'src/components/common';

type OpenFilterState = {
  [filter: string]: boolean;
};

export const OrderbookFilters = () => {
  // router
  const router = useRouter();

  const {
    query: { collections: _collections, orderTypes: _orderTypes, minPrice, maxPrice, numberOfNfts }
  } = router;

  let collections: string[] = [];
  if (typeof _collections === 'string') {
    collections = [_collections];
  }
  if (typeof _collections === 'object') {
    collections = [..._collections];
  }

  let orderTypes: string[] = [];
  if (typeof _orderTypes === 'string') {
    orderTypes = [_orderTypes];
  }
  if (typeof _orderTypes === 'object') {
    orderTypes = [..._orderTypes];
  }

  // state
  const [openState, setOpenState] = useState<OpenFilterState>({});
  const [collectionSearchState, setCollectionSearchState] = useState<string>();

  // mock data
  const collectionsData = [
    'Collection 1',
    'Collection 2',
    'Collection 3',
    'Collection 4',
    'Collection 5',
    'Collection 6',
    'Collection 7',
    'Collection 8',
    'Collection 9'
  ];
  const orderTypesData = ['Listing', 'Offer'];

  // filters helper functions
  const removeQueryParam = (value: string) => {
    const updateQueryParams = { ...router.query };
    delete updateQueryParams[value];
    router.replace({ pathname: router.pathname, query: { ...updateQueryParams } });
  };

  const clearFilter = (name: string) => {
    removeQueryParam(name);
  };

  const updateFilterArray = (filterName: string, currentFitlers: string[], selectionName: string, checked: boolean) => {
    let updatedSelections = [];
    if (checked) {
      updatedSelections = [...currentFitlers, selectionName];
    } else {
      updatedSelections = currentFitlers.filter((currentFilter) => currentFilter !== selectionName);
    }

    router.replace({ pathname: router.pathname, query: { ...router.query, [filterName]: updatedSelections } });
  };

  const updateFilter = (name: string, value: string) => {
    if (!value) {
      removeQueryParam(name);
    } else {
      router.replace({ pathname: router.pathname, query: { ...router.query, [name]: value } });
    }
  };

  return (
    <div className="flex flex-col mr-12">
      <div className="text-2xl font-bold">Filter</div>
      <OrderbookFilterItem key="Order type" openState={openState} setOpenState={setOpenState} item="Order type">
        <div className="max-h-80 overflow-y-scroll">
          {orderTypesData.map((orderType) => (
            <div className="mt-8 ml-1 font-heading font-light text-secondary">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={orderTypes.includes(orderType)}
                  onChange={(e) => updateFilterArray('orderTypes', orderTypes, orderType, e.target.checked)}
                  className="mr-2"
                />
                {orderType}
              </label>
            </div>
          ))}
        </div>
      </OrderbookFilterItem>
      <OrderbookFilterItem key="Collection" openState={openState} setOpenState={setOpenState} item="Collection">
        <div>
          <input
            className="border rounded-lg py-2 px-4 mt-1 font-heading w-[90%]"
            defaultValue={collectionSearchState}
            onChange={(ev) => {
              const text = ev.target.value;
              setCollectionSearchState(text);
            }}
            placeholder="Filter"
          />

          <div className="max-h-80 overflow-y-scroll">
            {collectionsData.map((collection) => {
              const searchText = (collectionSearchState || '').toLowerCase();
              if (searchText && collection.toLowerCase().indexOf(searchText) < 0) {
                return null;
              }
              return (
                <div className="mt-8 ml-1 font-heading font-light text-secondary">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={collections.includes(collection)}
                      onChange={(e) => updateFilterArray('collections', collections, collection, e.target.checked)}
                      className="mr-2"
                    />
                    {collection}
                  </label>
                </div>
              );
            })}
          </div>

          <Button onClick={() => clearFilter('collections')}>Clear</Button>
        </div>
      </OrderbookFilterItem>
      <OrderbookFilterItem key="Sale price" openState={openState} setOpenState={setOpenState} item="Sale price">
        <div className="flex flex-col">
          <InputBox>
            <div className="flex-1">
              <label className="block text-xs font-medium text-theme-light-800">Min</label>
              <div className="flex">
                {EthSymbol}&nbsp;&nbsp;
                <input
                  type="number"
                  value={minPrice as string}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="p-0 border-none focus:ring-0 block w-full text-base"
                />
              </div>
            </div>
          </InputBox>
          <InputBox>
            <div className="flex-1">
              <label className="block text-xs font-medium text-theme-light-800">Max</label>
              <div className="flex">
                {EthSymbol}&nbsp;&nbsp;
                <input
                  type="number"
                  value={maxPrice as string}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="p-0 border-none focus:ring-0 block w-full text-base"
                />
              </div>
            </div>
          </InputBox>
        </div>
      </OrderbookFilterItem>
      <OrderbookFilterItem key="Number of NFTs" openState={openState} setOpenState={setOpenState} item="Number of NFTs">
        <div className="flex flex-col">
          <InputBox>
            <div className="flex-1">
              <label className="block text-xs font-medium text-theme-light-800">Amount of NFTs</label>
              <div className="flex">
                <input
                  type="number"
                  value={numberOfNfts as string}
                  onChange={(e) => updateFilter('numberOfNfts', e.target.value)}
                  className="p-0 border-none focus:ring-0 block w-full text-base"
                />
              </div>
            </div>
          </InputBox>
        </div>
      </OrderbookFilterItem>
    </div>
  );
};

type OrderbookFilterItemProps = {
  openState: OpenFilterState;
  setOpenState: React.Dispatch<React.SetStateAction<OpenFilterState>>;
  item: string;
  children: React.ReactNode;
};

const OrderbookFilterItem = ({ openState, setOpenState, item, children }: OrderbookFilterItemProps) => {
  return (
    <React.Fragment>
      <div
        className="my-6 flex items-center cursor-pointer font-heading font-thin"
        onClick={() => {
          const newOpenState = { ...openState, [item]: !openState[item] };
          setOpenState(newOpenState);
        }}
      >
        <div className="flex-1">{item}</div>
        {openState[item] ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
      </div>

      {openState[item] && (
        <>
          <div className="mb-6 pb-8 border-b border-gray-300">{children}</div>
        </>
      )}
    </React.Fragment>
  );
};

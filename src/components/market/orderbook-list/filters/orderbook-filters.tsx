import React, { useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Button, Checkbox, EthSymbol, InputBox } from 'src/components/common';
import { useOrderbook } from '../../OrderbookContext';

type OpenFilterState = {
  [filter: string]: boolean;
};

export const OrderbookFilters = () => {
  // state
  const {
    filters: { orderTypes = [], collections = [], minPrice, maxPrice, numberOfNfts },
    clearFilter,
    updateFilter,
    updateFilterArray
  } = useOrderbook();

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

  return (
    <div className="flex flex-col mr-12">
      <div className="text-2xl font-bold">Filter</div>
      <OrderbookFilterItem key="Order type" openState={openState} setOpenState={setOpenState} item="Order type">
        <div className="max-h-80 overflow-y-auto space-y-4">
          {orderTypesData.map((orderType) => (
            <Checkbox
              key={orderType}
              className="ml-1"
              checked={orderTypes.includes(orderType)}
              onChange={(checked) => updateFilterArray('orderTypes', orderTypes, orderType, checked)}
              label={orderType}
            />
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

          <div className="mt-2 max-h-80 overflow-y-auto space-y-4">
            {collectionsData.map((collection) => {
              const searchText = (collectionSearchState || '').toLowerCase();
              if (searchText && collection.toLowerCase().indexOf(searchText) < 0) {
                return null;
              }

              return (
                <Checkbox
                  key={collection}
                  className="ml-1"
                  checked={collections.includes(collection)}
                  onChange={(checked) => updateFilterArray('collections', collections, collection, checked)}
                  label={collection}
                />
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
                  value={minPrice}
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
                  value={maxPrice}
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
                  value={numberOfNfts}
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

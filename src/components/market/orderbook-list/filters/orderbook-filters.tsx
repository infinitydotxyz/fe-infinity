import { debounce, uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Button, Checkbox, TextInputBox } from 'src/components/common';
import { useOrderbook } from '../../OrderbookContext';
import { CollectionSearchItem, useCollectionCache } from '../collection-cache';

type OpenFilterState = {
  [filter: string]: boolean;
};

const ORDER_TYPES = ['Listing', 'Offer'];

export const OrderbookFilters = () => {
  // state
  const {
    filters: { orderTypes = [], collections = [], minPrice, maxPrice, numberOfNfts },
    clearFilter,
    updateFilter,
    updateFilterArray,
    collectionId
  } = useOrderbook();

  const [openState, setOpenState] = useState<OpenFilterState>({});
  const [collectionSearchState, setCollectionSearchState] = useState<string>();
  const [collectionsData, setCollectionsData] = useState<CollectionSearchItem[]>([]);
  const { getTopCollections, getCollectionsByName, getCollectionsByIds } = useCollectionCache();

  useEffect(() => {
    // loads the selected collections from query params and also provides some more options
    const fetchInitialCollections = async () => {
      const initialCollections = await getTopCollections();
      if (initialCollections?.length) {
        // query params passed on page load
        if (collections.length > 0) {
          const selectedCollections = await getCollectionsByIds(collections);
          if (selectedCollections?.length) {
            const _collections = uniqBy([...selectedCollections, ...initialCollections], 'id');
            setCollectionsData(_collections);
          }
        } else {
          setCollectionsData(initialCollections);
        }
      }
    };
    fetchInitialCollections().catch(console.error);
  }, []);

  const searchForCollections = debounce(async (searchTerm: string) => {
    setCollectionSearchState(searchTerm);

    if (searchTerm) {
      const updatedCollections = await getCollectionsByName(searchTerm);
      if (updatedCollections?.length) {
        setCollectionsData(updatedCollections);
      }
    } else {
      const initialCollections = await getTopCollections();
      if (initialCollections?.length) {
        // query params
        if (collections.length > 0) {
          const selectedCollections = await getCollectionsByIds(collections);
          if (selectedCollections?.length) {
            const _collections = uniqBy([...selectedCollections, ...initialCollections], 'id');
            setCollectionsData(_collections);
          }
        } else {
          setCollectionsData(initialCollections);
        }
      }
    }
  }, 300);

  return (
    <div className="flex flex-col mr-12">
      <div className="text-2xl font-bold">Filter</div>
      <OrderbookFilterItem key="Order type" openState={openState} setOpenState={setOpenState} item="Order type">
        <div className="max-h-80 overflow-y-auto space-y-4">
          {ORDER_TYPES.map((orderType) => (
            <Checkbox
              key={orderType}
              className="pb-4"
              checked={orderTypes.includes(orderType)}
              onChange={(checked) => updateFilterArray('orderTypes', orderTypes, orderType, checked)}
              label={orderType}
            />
          ))}
        </div>
      </OrderbookFilterItem>
      {!collectionId && (
        <OrderbookFilterItem key="Collection" openState={openState} setOpenState={setOpenState} item="Collection">
          <div>
            <input
              className="border rounded-full py-2 px-4 mt-1 font-heading w-full"
              defaultValue={collectionSearchState}
              onChange={(ev) => {
                const text = ev.target.value;
                searchForCollections(text);
              }}
              placeholder="Search"
            />

            <div className="mt-8 max-h-80 overflow-y-auto space-y-4">
              {collectionsData.map((collection, i) => {
                return (
                  <Checkbox
                    key={`${i}-${collection.id}`}
                    className="pb-4"
                    checked={collections.includes(`${collection.chainId}:${collection.id}`)}
                    onChange={(checked) =>
                      updateFilterArray('collections', collections, `${collection.chainId}:${collection.id}`, checked)
                    }
                    label={collection.name}
                  />
                );
              })}
            </div>

            <Button className="mt-8 w-full" onClick={() => clearFilter('collections')}>
              Clear
            </Button>
          </div>
        </OrderbookFilterItem>
      )}
      <OrderbookFilterItem key="Sale price" openState={openState} setOpenState={setOpenState} item="Sale price">
        <div className="flex flex-col space-y-4">
          <TextInputBox
            addEthSymbol={true}
            type="number"
            value={minPrice?.toString()}
            label="Min"
            placeholder=""
            onChange={(value) => {
              updateFilter('minPrice', value);
            }}
          />

          <TextInputBox
            addEthSymbol={true}
            type="number"
            value={maxPrice?.toString()}
            label="Max"
            placeholder=""
            onChange={(value) => {
              updateFilter('maxPrice', value);
            }}
          />
        </div>
      </OrderbookFilterItem>
      <OrderbookFilterItem key="Number of NFTs" openState={openState} setOpenState={setOpenState} item="Number of NFTs">
        <div className="flex flex-col">
          <TextInputBox
            type="number"
            value={numberOfNfts?.toString()}
            label="Amount of NFTs"
            placeholder=""
            onChange={(value) => updateFilter('numberOfNfts', value)}
          />
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

      {openState[item] && <div className="mb-6 pb-8 border-b border-gray-300">{children}</div>}
    </React.Fragment>
  );
};

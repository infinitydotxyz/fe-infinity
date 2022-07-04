import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Checkbox, DebouncedTextInputBox, TextInputBox } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useOrderbook } from '../../OrderbookContext';
import { CollectionSearchItem, useCollectionCache } from '../collection-cache';

let allCollectionsData: CollectionSearchItem[] = [];

type OpenFilterState = {
  [filter: string]: boolean;
};

const ORDER_TYPES = ['Listing', 'Offer'];

export const OrderbookFilters = () => {
  // state
  const { query } = useRouter();
  const defaultOpenState: OpenFilterState = {};

  if (query.orderTypes) {
    defaultOpenState['Order type'] = true;
  }
  if (query.collections) {
    defaultOpenState['Collection'] = true;
  }
  if (query.minPrice || query.maxPrice) {
    defaultOpenState['Sale price'] = true;
  }
  if (query.numberOfNfts) {
    defaultOpenState['Number of NFTs'] = true;
  }
  const {
    filters: { orderTypes = [], collections = [], minPrice, maxPrice, numberOfNfts },
    // clearFilter,
    updateFilter,
    updateFilterArray,
    collectionId
  } = useOrderbook();

  const [openState, setOpenState] = useState<OpenFilterState>(defaultOpenState);
  const [collectionSearchState, setCollectionSearchState] = useState<string>('');
  const [collectionsData, setCollectionsData] = useState<CollectionSearchItem[]>([]);
  const { getTopCollections, getCollectionsByName, getCollectionsByIds } = useCollectionCache();
  const isMounted = useIsMounted();

  useEffect(() => {
    // loads the selected collections from query params and also provides some more options
    const fetchInitialCollections = async () => {
      const initialCollections = await getTopCollections();
      if (initialCollections?.length) {
        if (isMounted()) {
          // query params passed on page load
          if (collections.length > 0) {
            const selectedCollections = await getCollectionsByIds(collections);
            if (selectedCollections?.length) {
              const _collections = uniqBy([...selectedCollections, ...initialCollections], 'id');
              setCollectionsData(_collections);
              allCollectionsData = [...allCollectionsData, ..._collections];
            }
          } else {
            setCollectionsData(initialCollections);
            allCollectionsData = [...allCollectionsData, ...initialCollections];
          }
        }
      }
    };
    fetchInitialCollections().catch(console.error);
  }, []);

  const searchForCollections = async (searchTerm: string) => {
    setCollectionSearchState(searchTerm);

    if (searchTerm) {
      const updatedCollections = await getCollectionsByName(searchTerm);
      if (updatedCollections?.length) {
        setCollectionsData(updatedCollections);
        allCollectionsData = [...allCollectionsData, ...updatedCollections];
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
            allCollectionsData = [...allCollectionsData, ..._collections];
          }
        } else {
          setCollectionsData(initialCollections);
          allCollectionsData = [...allCollectionsData, ...initialCollections];
        }
      }
    }
  };

  const CollectionCheckbox = ({ collection }: { collection: CollectionSearchItem }) => (
    <Checkbox
      key={`${collection.id}`}
      boxOnLeft={false}
      className="pb-4"
      checked={collections.includes(`${collection.chainId}:${collection.id}`)}
      onChange={(checked) => {
        updateFilterArray('collections', collections, `${collection.chainId}:${collection.id}`, checked);
      }}
      label={collection.name}
    />
  );
  const hasCollectionSearchResults = collections.length > 0 || (collectionSearchState || '').length > 0;

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
            <DebouncedTextInputBox
              label=""
              type="text"
              className="border rounded-full py-2 px-4 mt-1 font-heading w-full"
              value={collectionSearchState}
              onChange={(value) => {
                searchForCollections(value);
              }}
              placeholder="Search"
            />

            <div className="mt-8 max-h-80 overflow-y-auto space-y-4 font-heading">
              {collections.map((coll) => {
                const collection = allCollectionsData.find((c) => `${c.chainId}:${c.id}` === coll);
                if (!collection) {
                  return null;
                }
                return <CollectionCheckbox key={collection.id} collection={collection} />;
              })}
              {hasCollectionSearchResults &&
                collectionsData.map((collection) => {
                  if (collections.includes(`${collection.chainId}:${collection.id}`)) {
                    return null;
                  }
                  return <CollectionCheckbox key={collection.id} collection={collection} />;
                })}
            </div>

            {/* {hasCollectionSearchResults && (
              <Button className="mt-8 w-full" onClick={() => clearFilter('collections')}>
                Clear
              </Button>
            )} */}
          </div>
        </OrderbookFilterItem>
      )}
      <OrderbookFilterItem key="Sale price" openState={openState} setOpenState={setOpenState} item="Sale price">
        <div className="flex flex-col space-y-4">
          <TextInputBox
            addEthSymbol={true}
            type="number"
            value={minPrice?.toString() ?? ''}
            label="Min"
            placeholder=""
            onChange={(value) => {
              updateFilter('minPrice', value);
            }}
          />

          <TextInputBox
            addEthSymbol={true}
            type="number"
            value={maxPrice?.toString() ?? ''}
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
            value={numberOfNfts?.toString() ?? ''}
            label=""
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

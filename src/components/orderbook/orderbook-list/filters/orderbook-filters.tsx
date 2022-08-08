import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { uniqBy } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Button, Checkbox, DebouncedTextInputBox, EZImage, TextInputBox } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useOrderbook } from '../../OrderbookContext';
import { useCollectionCache } from '../collection-cache';

type OpenFilterState = {
  [filter: string]: boolean;
};

const ORDER_TYPES = ['Listing', 'Offer'];

export const OrderbookFilters = () => {
  const router = useRouter();

  const { filters, updateFilter, updateFilterArray, collectionId, clearFilter } = useOrderbook();
  const [openState, setOpenState] = useState<OpenFilterState>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collectionsData, setCollectionsData] = useState<CollectionSearchDto[]>([]);
  const { getTopCollections, getCollectionsByName, getCollectionsByIds } = useCollectionCache();
  const [allCollectionsData, setAllCollectionsData] = useState<CollectionSearchDto[]>([]);
  const isMounted = useIsMounted();

  const { orderTypes = [], collections = [], minPrice, maxPrice, numberOfNfts } = filters;
  const hasCollectionSearchResults = collections.length > 0 || searchQuery.length > 0;

  useEffect(() => {
    if (router.isReady) {
      // only set this at first load when isReady
      if (Object.keys(openState).length === 0) {
        const defaultOpenState: OpenFilterState = {};

        if (router.query.orderTypes) {
          defaultOpenState['Order type'] = true;
        }

        if (router.query.collections) {
          defaultOpenState['Collection'] = true;
        }

        if (router.query.minPrice || router.query.maxPrice) {
          defaultOpenState['Sale price'] = true;
        }

        if (router.query.numberOfNfts) {
          defaultOpenState['# NFTs'] = true;
        }

        setOpenState(defaultOpenState);
      }
    }
  }, [router.query]);

  // loads the selected collections from query params and also provides some more options
  const setupDefaultCollections = async () => {
    const initialCollections = await getTopCollections();

    // query params passed on page load
    if (collections.length > 0) {
      const selectedCollections = await getCollectionsByIds(collections);
      const newData = uniqBy([...selectedCollections, ...initialCollections], 'address');

      if (isMounted()) {
        setCollectionsData(newData);
        setAllCollectionsData(uniqBy([...allCollectionsData, ...newData], 'address'));
      }
    } else {
      if (isMounted()) {
        setCollectionsData(initialCollections);
        setAllCollectionsData(uniqBy([...allCollectionsData, ...initialCollections], 'address'));
      }
    }
  };

  useEffect(() => {
    if (collectionsData.length === 0) {
      setupDefaultCollections().catch(console.error);
    }
  }, [filters]);

  const searchForCollections = async (searchTerm: string) => {
    setSearchQuery(searchTerm);

    if (searchTerm) {
      const updatedCollections = await getCollectionsByName(searchTerm);

      if (updatedCollections?.length) {
        setCollectionsData(updatedCollections);
        setAllCollectionsData(uniqBy([...allCollectionsData, ...updatedCollections], 'address'));
      }
    } else {
      setupDefaultCollections();
    }
  };

  const collectionCheckboxes = () => {
    const checks = [];

    for (const coll of collections) {
      const collection = allCollectionsData.find((c) => `${c.chainId}:${c.address}` === coll);
      if (collection) {
        checks.push(<CollectionCheckbox key={collection.address} collection={collection} />);
      }
    }

    for (const collection of collectionsData) {
      if (!collections.includes(`${collection.chainId}:${collection.address}`)) {
        checks.push(<CollectionCheckbox key={collection.address} collection={collection} />);
      }
    }

    return checks;
  };

  return (
    <div className="flex flex-col mr-12">
      <div className="text-2xl font-bold">Filter</div>
      <OrderbookFilterItem key="Order type" openState={openState} setOpenState={setOpenState} item="Order type">
        <div className="max-h-80 overflow-y-auto overflow-x-clip space-y-4">
          {ORDER_TYPES.map((orderType) => (
            <Checkbox
              key={orderType}
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
              className="border rounded-full py-2 px-4 mt-1 font-heading w-full"
              value={searchQuery}
              onChange={(value) => {
                searchForCollections(value);
              }}
              placeholder="Search"
            />

            {hasCollectionSearchResults && (
              <>
                <div className="my-4 pr-2 max-h-80 w-full overflow-y-auto overflow-x-clip space-y-2">
                  {collectionCheckboxes()}
                </div>

                <div className="w-full flex justify-end">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => {
                      clearFilter('collections');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
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
      <OrderbookFilterItem key="# NFTs" openState={openState} setOpenState={setOpenState} item="# NFTs">
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
        <div className="flex-1 select-none">{item}</div>
        {openState[item] ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
      </div>

      {openState[item] && <div className="mb-2">{children}</div>}
    </React.Fragment>
  );
};

// =========================================================

const CollectionCheckbox = ({ collection }: { collection: CollectionSearchDto }) => {
  const { filters, updateFilterArray } = useOrderbook();

  const collections = filters.collections ?? [];

  return (
    <div className="flex items-center space-x-2">
      <EZImage className="h-9 w-9 rounded-full shrink-0 overflow-clip" src={collection.profileImage} />

      <Checkbox
        boxOnLeft={false}
        className="w-full"
        checked={collections.includes(`${collection.chainId}:${collection.address}`)}
        onChange={(checked) => {
          updateFilterArray('collections', collections, `${collection.chainId}:${collection.address}`, checked);
        }}
        label={collection.name}
      />
    </div>
  );
};

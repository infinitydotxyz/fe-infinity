import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, DebouncedTextInputBox, EZImage } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useCollectionCache } from '../orderbook-list/collection-cache';
import { useOrderbook } from '../OrderbookContext';

export const GraphCollectionFilter = () => {
  const { filters, collectionId, clearFilters } = useOrderbook();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collectionsData, setCollectionsData] = useState<CollectionSearchDto[]>([]);
  const { getTopCollections, getCollectionsByName, getCollectionsByIds } = useCollectionCache();
  const [allCollectionsData, setAllCollectionsData] = useState<CollectionSearchDto[]>([]);
  const isMounted = useIsMounted();

  const { collections = [] } = filters;
  const hasCollectionSearchResults = collections.length > 0 || searchQuery.length > 0;

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

      {!collectionId && (
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
                    clearFilters(['collections']);
                  }}
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// =========================================================

const CollectionCheckbox = ({ collection }: { collection: CollectionSearchDto }) => {
  const { filters, updateFilterArray } = useOrderbook();

  const collections = filters.collections ?? [];

  return (
    <div className="flex items-center space-x-2">
      <EZImage className="h-7 w-7 rounded-full shrink-0 overflow-clip" src={collection.profileImage} />

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

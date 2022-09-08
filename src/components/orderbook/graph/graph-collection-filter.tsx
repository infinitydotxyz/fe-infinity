import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, DebouncedTextInputBox, EZImage, Modal } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useCollectionCache } from '../orderbook-list/collection-cache';
import { useOrderbook } from '../OrderbookContext';
import { GraphBox } from './graph-box';

export const GraphCollectionFilter = () => {
  const { filters } = useOrderbook();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collectionsData, setCollectionsData] = useState<CollectionSearchDto[]>([]);
  const { getTopCollections, getCollectionsByName, getCollectionsByIds } = useCollectionCache();
  const [allCollectionsData, setAllCollectionsData] = useState<CollectionSearchDto[]>([]);
  const isMounted = useIsMounted();

  const { collections = [] } = filters;

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

  const checkboxes = collectionCheckboxes();

  return (
    <div className="flex flex-col">
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

        <>
          <div className="my-4 pr-2 h-80 w-full overflow-y-auto overflow-x-clip space-y-2">{checkboxes}</div>
        </>
      </div>
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

// ===========================================================================

interface Props2 {
  modalIsOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const CollectionFilterModal = ({ modalIsOpen, setIsOpen }: Props2) => {
  const { clearFilters, filters } = useOrderbook();

  const { collections = [] } = filters;

  let buttonName = 'Select Collection';

  if (collections.length > 0) {
    buttonName = `${collections.length} selected}`;
  }

  return (
    <div className="flex flex-col">
      <GraphBox className="py-2 px-6 w-full flex justify-end">
        <div className="mb-4">Filter by collection</div>
        <Button
          variant="outlineWhite"
          size="small"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {buttonName}
        </Button>
      </GraphBox>

      <Modal
        isOpen={modalIsOpen}
        title="Filter by collection"
        onClose={() => setIsOpen(false)}
        onCancelButton={() => {
          clearFilters(['collections']);

          setIsOpen(false);
        }}
        okButton="Close"
        cancelButton="Clear Filter"
      >
        <GraphCollectionFilter />
      </Modal>
    </div>
  );
};

import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { uniqBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, DebouncedTextInputBox, EZImage, Modal, SVG } from 'src/components/common';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { useCollectionCache } from '../orderbook-list/collection-cache';
import { useOrderbook } from '../OrderbookContext';

interface Props {
  defaultCollections: string[];
}

export const GraphCollectionFilter = ({ defaultCollections }: Props) => {
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

    const defaultCollectionsDTOs = await getCollectionsByIds(defaultCollections);

    // query params passed on page load
    if (collections.length > 0) {
      const selectedCollections = await getCollectionsByIds(collections);
      const newData = uniqBy([...selectedCollections, ...initialCollections, ...defaultCollectionsDTOs], 'address');

      if (isMounted()) {
        setCollectionsData(newData);
        setAllCollectionsData(uniqBy([...allCollectionsData, ...newData], 'address'));
      }
    } else {
      if (isMounted()) {
        setCollectionsData([...defaultCollectionsDTOs, ...initialCollections]);
        setAllCollectionsData(
          uniqBy([...defaultCollectionsDTOs, ...allCollectionsData, ...initialCollections], 'address')
        );
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
        // sort list exact matches first
        updatedCollections.sort((a, b) => {
          // make sure exact matches are on top
          if (a.name === searchTerm) {
            if (b.name === searchTerm) {
              return 0;
            }

            return -1;
          }

          const aa = a.name.replaceAll(' ', '');
          const bb = b.name.replaceAll(' ', '');

          return aa.localeCompare(bb);
        });

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
          <div className="my-4 pr-2 h-64 w-full overflow-y-auto overflow-x-clip space-y-2">{checkboxes}</div>
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
        label={
          <div className="flex items-center">
            {collection.name}

            {collection?.hasBlueCheck ? <SVG.blueCheck className="w-4 h-4 ml-2 shrink-0" /> : null}
          </div>
        }
      />
    </div>
  );
};

// ===========================================================================

interface Props2 {
  modalIsOpen: boolean;
  setIsOpen: (open: boolean) => void;
  defaultCollections: string[];
}

export const CollectionFilterModal = ({ modalIsOpen, setIsOpen, defaultCollections }: Props2) => {
  const { clearFilters, filters } = useOrderbook();

  const { collections = [] } = filters;

  let buttonName = 'Select';

  if (collections.length > 0) {
    buttonName = `${collections.length} selected`;
  }

  return (
    <div className="flex flex-col ">
      <div className="mr-2 text-sm mb-1">Filter by collections:</div>
      <Button
        variant="outlineWhite"
        size="small"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {buttonName}
      </Button>

      <Modal
        wide={false}
        isOpen={modalIsOpen}
        title="Filter by collection"
        onClose={() => setIsOpen(false)}
        onCancelButton={() => {
          clearFilters(['collections']);

          setIsOpen(false);
        }}
        okButton="Done"
        cancelButton="Clear Filter"
      >
        <GraphCollectionFilter defaultCollections={defaultCollections} />
      </Modal>
    </div>
  );
};

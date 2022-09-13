import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto/collections';
import { useState } from 'react';
import { apiGet } from 'src/utils';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { Checkbox, DebouncedTextInputBox, EZImage } from '../common';

export const CollectionFilter = () => {
  const [collections, setCollections] = useState<CollectionSearchDto[]>([]);
  const [allCollections, setAllCollections] = useState<CollectionSearchDto[]>([]);
  const { filterState, setFilterState } = useFilterContext();

  const fetchData = async (value: string) => {
    if (value) {
      const { result } = await apiGet(`/collections/search`, {
        query: { query: value, limit: 20 }
      });

      const data = (result?.data ?? []) as CollectionSearchDto[];

      setCollections(data);
      setAllCollections([...data, ...collections]);
    } else {
      setCollections([]);
    }
  };

  const updateFilterArray = (collectionAddress: string, checked: boolean) => {
    let updatedSelections = [];
    if (checked) {
      updatedSelections = [...(filterState.collectionAddresses ?? []), collectionAddress];
    } else {
      updatedSelections = (filterState.collectionAddresses ?? []).filter((address) => address !== collectionAddress);
    }

    const newFilter = { ...filterState };

    newFilter.collectionAddresses = updatedSelections;
    setFilterState(newFilter);
  };

  const collectionCheckboxes = () => {
    const checks = [];

    for (const coll of filterState.collectionAddresses ?? []) {
      const collection = allCollections.find((c) => c.address === coll);
      if (collection) {
        checks.push(
          <CollectionFilterCheckbox
            key={collection.address}
            collection={collection}
            selection={filterState.collectionAddresses ?? []}
            onChange={(checked) => {
              updateFilterArray(collection.address, checked);
            }}
          />
        );
      }
    }

    for (const collection of collections) {
      const key = collection.address;

      if (!(filterState.collectionAddresses ?? []).includes(key)) {
        if (collection.name && collection.address && collection.profileImage) {
          checks.push(
            <CollectionFilterCheckbox
              key={collection.address}
              collection={collection}
              selection={filterState.collectionAddresses ?? []}
              onChange={(checked) => {
                updateFilterArray(collection.address, checked);
              }}
            />
          );
        }
      }
    }

    return checks;
  };

  return (
    <div className="">
      <DebouncedTextInputBox
        label=""
        className="border rounded-full py-2 px-4 mb-6 font-heading w-full"
        value=""
        onChange={(value) => fetchData(value)}
        placeholder="Search"
      />

      <div className="max-h-[250px] overflow-y-auto overflow-x-clip space-y-2 pr-2">{collectionCheckboxes()} </div>
    </div>
  );
};

// ===============================================

interface Props2 {
  collection: CollectionSearchDto;
  onChange: (checked: boolean) => void;
  selection: string[];
}

const CollectionFilterCheckbox = ({ selection, collection, onChange }: Props2) => {
  return (
    <div className="flex items-center space-x-2">
      <EZImage className="h-9 w-9 rounded-full shrink-0 overflow-clip" src={collection.profileImage} />

      <Checkbox
        boxOnLeft={false}
        className="w-full"
        checked={selection.includes(collection.address)}
        onChange={onChange}
        label={collection.name}
      />
    </div>
  );
};

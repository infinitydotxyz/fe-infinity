import { without } from 'lodash';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { Checkbox, DebouncedTextInputBox } from '../common';

export type CollectionInfo = {
  chainId?: string;
  collectionAddress?: string;
  collectionName?: string;
  collectionSlug?: string;
  hasBlueCheck?: boolean;
};

interface Props {
  userAddress: string;
  onSelect: (selectedIds: string[]) => void;
}

const CollectionFilter = ({ userAddress, onSelect }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [collectionSearchState, setCollectionSearchState] = useState<string>('');

  const fetchData = async () => {
    const { result } = await apiGet(`/user/${userAddress}/nftCollections`, {
      query: { search: collectionSearchState }
    });
    if (result?.data) {
      setCollections(result?.data ?? []);
    }
  };

  useEffect(() => {
    fetchData();
  }, [collectionSearchState]);

  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds]);

  return (
    <ul className="max-h-[250px] overflow-y-auto">
      <DebouncedTextInputBox
        label=""
        type="text"
        className="border rounded-full py-2 px-4 mb-6 font-heading w-full"
        value={collectionSearchState}
        onChange={(value) => setCollectionSearchState(value)}
        placeholder="Search"
      />

      {collections.map((item) => {
        // if (!item.collectionName) {
        //   return null;
        // }
        return (
          <Checkbox
            key={item.collectionAddress}
            checked={selectedIds.indexOf(item.collectionAddress ?? '') >= 0}
            label={item.collectionName}
            onChange={(checked) => {
              if (checked) {
                setSelectedIds((ids) => [...ids, item.collectionAddress ?? '']);
              } else {
                const ids = without(selectedIds, item.collectionAddress ?? '');
                setSelectedIds(ids);
              }
            }}
            className="py-4"
          />
        );
      })}
    </ul>
  );
};

export default CollectionFilter;

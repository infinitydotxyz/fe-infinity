import { without } from 'lodash';
import { useEffect, useState } from 'react';
import { apiGet } from 'src/utils';
import { Checkbox } from '../common';

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

  useEffect(() => {
    const fetchData = async () => {
      const { result } = await apiGet(`/user/${userAddress}/nftCollections`);
      if (result?.data) {
        setCollections(result?.data ?? []);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds]);

  return (
    <ul className="max-h-[200px] overflow-y-auto">
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
            className="py-2"
          />
        );
      })}
    </ul>
  );
};

export default CollectionFilter;

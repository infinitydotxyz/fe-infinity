import { without } from 'lodash';
import { useEffect, useState } from 'react';
import { Checkbox } from '../common';

export type CollectionFilterItem = {
  collectionAddress?: string;
  collectionName?: string;
  hasBlueCheck?: boolean;
};

interface Props {
  initialCollections: CollectionFilterItem[];
  onSelect: (selectedIds: string[]) => void;
}

const CollectionFilter = ({ initialCollections, onSelect }: Props) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    onSelect(selectedIds);
  }, [selectedIds]);
  return (
    <ul className="max-h-[200px] overflow-y-auto">
      {initialCollections.map((item) => {
        if (!item.collectionName) {
          return null;
        }
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

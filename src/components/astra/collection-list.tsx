import { useState, useEffect } from 'react';
import { CollectionListItem } from './collection-list-item';
import { CollectionInfo, CollectionInfoArrayDto, fetchCollections } from 'src/utils/astra-utils';
import { ScrollLoader } from '../common';
import { useIsMounted } from 'src/hooks/useIsMounted';

interface Props {
  query: string;
  selectedCollection?: CollectionInfo;
  className?: string;
  onClick: (collection: CollectionInfo) => void;
  // called on first load so the we can select the first collection to display
  onLoad: (collections: CollectionInfo[]) => void;
}

export const CollectionList = ({ query, className = '', onClick, selectedCollection, onLoad }: Props) => {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  const isMounted = useIsMounted();

  useEffect(() => {
    handleFetch('');
  }, [query]);

  const handleFetch = async (passedCursor: string) => {
    const response = await fetchCollections(query, passedCursor);

    // can't update react state after unmount
    if (!isMounted()) {
      return;
    }

    if (response.error) {
      setError(response.error?.length > 0);
      setCollections([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const result = response.result as CollectionInfoArrayDto;
      if (passedCursor) {
        setCollections([...collections, ...result.data]);
      } else {
        setCollections(result.data);

        // called on first load
        onLoad(result.data);
      }
      setCursor(result.cursor);
      setHasNextPage(result.hasNextPage);
    }
  };

  if (error) {
    console.error(error);
    return (
      <div className={className}>
        <div>Unable to load data.</div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* pt-4 is for the first items selection rect, needs some space, or it clips */}
      <div className="flex flex-col space-y-4 pt-4">
        {collections.map((collection) => (
          <CollectionListItem
            key={collection.address}
            collection={collection}
            onClick={onClick}
            selected={collection.address === selectedCollection?.address}
          />
        ))}
      </div>

      {hasNextPage && (
        <ScrollLoader
          onFetchMore={() => {
            handleFetch(cursor);
          }}
        />
      )}
    </div>
  );
};

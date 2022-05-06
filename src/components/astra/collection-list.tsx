import React, { useState, useEffect } from 'react';
import { BGImage, FetchMore } from 'src/components/common';
import { apiGet, DEFAULT_LIMIT, BLANK_IMAGE_URL } from 'src/utils';
import { trimText } from 'src/components/common/read-more-text';
import { CollectionSearchArrayDto, CollectionSearchDto } from '../../utils/types/collection-types';

const fetchCollections = async (query: string, cursor: undefined | string) => {
  const API_ENDPOINT = '/collections/search';
  const response = await apiGet(API_ENDPOINT, {
    query: {
      query,
      limit: DEFAULT_LIMIT,
      cursor
    }
  });

  return response;
};

interface Props {
  query: string;
  className?: string;
  onClick: (collection: CollectionSearchDto) => void;
}

export const CollectionList = ({ query, className, onClick }: Props) => {
  const [collections, setCollections] = useState<CollectionSearchDto[]>([]);
  const [error, setError] = useState(false);
  const [cursor, setCursor] = useState<string>('');
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    handleFetch('');
  }, [query]);

  const handleFetch = async (passedCursor: string) => {
    const response = await fetchCollections(query, passedCursor);

    if (response.error) {
      setError(response.error);
      setCollections([]);
      setCursor('');
      setHasNextPage(false);
    } else {
      const result = response.result as CollectionSearchArrayDto;
      if (passedCursor) {
        setCollections([...collections, ...result.data]);
      } else {
        setCollections(result.data);
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
      <div className="flex flex-col space-y-4 ">
        {collections.map((collection) => (
          <CollectionListItem key={collection.slug} collection={collection} onClick={onClick} />
        ))}
      </div>

      {hasNextPage && <FetchMore onFetchMore={() => handleFetch(cursor)} />}
    </div>
  );
};

// ===================================================================

interface Props2 {
  collection: CollectionSearchDto;
  onClick: (collection: CollectionSearchDto) => void;
}

const getAvatarUrl = (imgUrl: string) => {
  if (!imgUrl) {
    return null;
  } else {
    const index = imgUrl.indexOf('=');
    if (index) {
      return imgUrl.slice(0, index) + '=h100';
    }
    return imgUrl;
  }
};

const CollectionListItem = ({ collection, onClick }: Props2) => {
  const shortText = trimText(collection.description, 70, 70, 70)[0];
  const isTrimText = shortText.length !== collection.description.length;

  const avatarUrl = getAvatarUrl(collection.bannerImage) || BLANK_IMAGE_URL;

  return (
    <div
      className="w-full cursor-pointer border border-gray-400 bg-white   rounded-t-3xl overflow-clip h-24 relative"
      onClick={() => onClick(collection)}
    >
      <BGImage url={avatarUrl} />

      <div className="text-theme-light-800 tracking-tight absolute bottom-0 left-0 right-0">
        <div className="bg-white mx-3 rounded-t-lg bg-opacity-90 overflow-clip  pt-1 pb-2 ">
          <div className="text-center text-sm font-bold text-black">{collection.name}</div>

          <div className=" break-all  leading-3 text-xs px-5 text-theme-light-800">
            {shortText}
            {isTrimText && '...'}
          </div>
        </div>
      </div>
    </div>
  );
};

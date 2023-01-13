import { SearchType } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { defaultSearchByType, useSearch } from 'src/hooks/api/useSearch';
import { useSearchState } from 'src/hooks/api/useSearchState';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
  profileSearch?: boolean;
  orderSearch?: boolean;
  setSelectedCollection?: (collection: CollectionSearchDto) => void;
}

export const CollectionSearchInput = ({ expanded, profileSearch, orderSearch, setSelectedCollection }: Props) => {
  const { search, setQuery } = useSearchState<SearchType.Collection, 'slug'>(
    defaultSearchByType[SearchType.Collection]
  );
  const { result } = useSearch(search);

  return (
    <SearchInput
      orderSearch={orderSearch}
      profileSearch={profileSearch}
      setSelectedCollection={setSelectedCollection}
      expanded={expanded}
      query={search.query}
      setQuery={setQuery}
      data={result.data}
      placeholder="Search by collection"
    />
  );
};

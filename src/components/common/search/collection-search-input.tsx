import { ChainId, SearchType } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useSearch } from 'src/hooks/api/useSearch';
import { useSearchState } from 'src/hooks/api/useSearchState';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
  profileSearch?: boolean;
  orderSearch?: boolean;
  setSelectedCollection?: (collection: CollectionSearchDto) => void;
}

export const CollectionSearchInput = ({ expanded, profileSearch, orderSearch, setSelectedCollection }: Props) => {
  const { chainId } = useOnboardContext();
  const { search, setQuery } = useSearchState<SearchType.Collection, 'slug'>({
    cursor: '',
    limit: 10,
    chainId: chainId as ChainId,
    type: SearchType.Collection,
    searchBy: 'slug',
    query: ''
  });
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

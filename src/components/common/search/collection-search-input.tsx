import { defaultSearchByType, SearchType, useSearch, useSearchState } from 'src/hooks/api/useSearch';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
}

export const CollectionSearchInput = ({ expanded }: Props) => {
  const { search, setQuery } = useSearchState(defaultSearchByType[SearchType.Collection]);
  const { result } = useSearch(search);

  return <SearchInput expanded={expanded} query={search.query} setQuery={setQuery} data={result.data} />;
};

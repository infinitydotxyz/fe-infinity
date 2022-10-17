import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import {
  CollectionNftsSearchBy,
  CollectionSearchBy,
  CollectionSearchType,
  SearchType,
  useSearch,
  useSearchState
} from 'src/hooks/api/useSearch';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
  slug: string;
}

export const CollectionNftSearchInput = ({ expanded, slug }: Props) => {
  const { search, setSubTypeQuery } = useSearchState({
    type: SearchType.Collection,
    query: slug,
    searchBy: CollectionSearchBy.Slug,
    limit: 10,
    subType: CollectionSearchType.Nft,
    subTypeQuery: '',
    cursor: '',
    chainId: ChainId.Mainnet,
    subTypeSearchBy: CollectionNftsSearchBy.TokenId
  });
  const { result } = useSearch(search);

  return (
    <SearchInput
      expanded={expanded}
      query={'subTypeQuery' in search ? search.subTypeQuery : ''}
      setQuery={setSubTypeQuery}
      data={result.data}
    />
  );
};

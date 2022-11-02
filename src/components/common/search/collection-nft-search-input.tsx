import { ChainId, SearchType } from '@infinityxyz/lib-frontend/types/core';
import { useEffect } from 'react';
import { useSearch } from 'src/hooks/api/useSearch';
import { useSearchState } from 'src/hooks/api/useSearchState';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
  slug: string;
}

export const CollectionNftSearchInput = ({ expanded, slug }: Props) => {
  const { search, setSubTypeQuery, setQuery } = useSearchState<SearchType.Collection, 'slug', 'nft'>({
    type: SearchType.Collection,
    query: slug,
    searchBy: 'slug',
    limit: 10,
    subType: 'nft',
    subTypeQuery: '',
    cursor: '',
    chainId: ChainId.Mainnet,
    subTypeSearchBy: 'tokenId'
  });
  const { result } = useSearch(search);

  useEffect(() => {
    setQuery(slug);
  }, [slug]);

  return (
    <SearchInput
      expanded={expanded}
      query={'subTypeQuery' in search ? search.subTypeQuery : ''}
      setQuery={setSubTypeQuery}
      data={result.data}
    />
  );
};

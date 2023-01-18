import { ChainId, SearchType } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { useSearch } from 'src/hooks/api/useSearch';
import { useSearchState } from 'src/hooks/api/useSearchState';
import { SearchInput } from './search-input';
import { TokenCardModal } from '../../astra/token-grid/token-card-modal';
import { BasicTokenInfo } from 'src/utils/types';

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

  const [modalOpen, setModalOpen] = useState(false);
  const [basicTokenInfo, setBasicTokenInfo] = useState<BasicTokenInfo | null>(null);

  useEffect(() => {
    setQuery(slug);
  }, [slug]);

  useEffect(() => {
    if (basicTokenInfo) {
      setModalOpen(true);
    }
  }, [basicTokenInfo]);

  return (
    <>
      <SearchInput
        tokenSearch
        setSelectedToken={setBasicTokenInfo}
        expanded={expanded}
        query={'subTypeQuery' in search ? search.subTypeQuery : ''}
        setQuery={setSubTypeQuery}
        placeholder="Search by tokenId"
        data={result.data}
      />
      {modalOpen && basicTokenInfo && (
        <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />
      )}
    </>
  );
};

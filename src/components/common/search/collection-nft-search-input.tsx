import { ChainId, SearchType } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSearch } from 'src/hooks/api/useSearch';
import { useSearchState } from 'src/hooks/api/useSearchState';
import { BasicTokenInfo } from 'src/utils/types';
import { TokenCardModal } from '../../astra/token-grid/token-card-modal';
import { SearchInput } from './search-input';

interface Props {
  expanded?: boolean;
  slug: string;
  collectionFloorPrice?: string | number | null | undefined;
}

export const CollectionNftSearchInput = ({ expanded, slug, collectionFloorPrice }: Props) => {
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

  const router = useRouter();
  useEffect(() => {
    if (basicTokenInfo) {
      const isModalOpen =
        router.query?.tokenId === basicTokenInfo.tokenId &&
        router.query?.collectionAddress === basicTokenInfo.collectionAddress;
      setModalOpen(isModalOpen);
    }
  }, [router.query, basicTokenInfo]);

  useEffect(() => {
    setQuery(slug);
  }, [slug]);

  return (
    <>
      <SearchInput
        tokenSearch
        setSelectedToken={(info) => {
          const { pathname, query } = router;
          query['tokenId'] = info.tokenId;
          query['collectionAddress'] = info.collectionAddress;
          router.replace({ pathname, query }, undefined, { shallow: true });
          info.collectionFloorPrice = collectionFloorPrice;
          setBasicTokenInfo(info);
        }}
        expanded={expanded}
        query={'subTypeQuery' in search ? search.subTypeQuery : ''}
        setQuery={setSubTypeQuery}
        placeholder="Search by tokenId"
        data={result.data}
      />
      {modalOpen && basicTokenInfo && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
    </>
  );
};

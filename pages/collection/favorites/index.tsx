import { CollectionFavoriteDto, CollectionFavoriteQueryResultDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRouter } from 'next/router';
import { NextLink, PageBox, ScrollLoader, Spinner } from 'src/components/common';
import { NoResultsBox } from 'src/components/common/no-results-box';
import { formatNumber, useFetchInfinite } from 'src/utils';

const Leaderboard: React.FC<{ collections: CollectionFavoriteDto[] }> = ({ collections }) => {
  return (
    <div className="space-y-4 mt-8">
      {collections.map((collection) => {
        return (
          <div
            key={collection.collectionAddress}
            className="bg-theme-light-200 px-10 h-[110px] rounded-3xl flex items-center font-heading"
          >
            <div className="flex justify-between items-center w-full ml-6">
              <NextLink href={`/collection/${collection.slug}`} className="truncate">
                {collection.name}
              </NextLink>

              <div className="w-1/9 max-w-[80px] min-w-[80px]">
                <div className="text-black font-bold font-body flex items-center">Favorites</div>
                <div>{formatNumber(collection.numFavorites)}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default function FavoriteCollectionsLeaderboard() {
  const router = useRouter();
  const { result, setSize, error, isLoading } = useFetchInfinite<CollectionFavoriteQueryResultDto>(
    '/collections/phase/favorites',
    {
      query: {
        orderDirection: 'desc',
        limit: 10
      }
    }
  );

  const fetchMore = () => setSize((size) => size + 1);

  return (
    <PageBox title="Favorite collections">
      {error && <div className="flex flex-col mt-10">Unable to load leaderboard.</div>}

      {result && result[0].data?.length > 0 && <Leaderboard collections={result[0].data} />}

      {result && result[0].data?.length === 0 && (
        <NoResultsBox
          title="No collections have been favorited yet"
          buttonText="Find an interesting collection"
          onClick={() => router.push('/trending')}
        />
      )}

      <ScrollLoader onFetchMore={fetchMore} />

      {isLoading && <Spinner />}
    </PageBox>
  );
}

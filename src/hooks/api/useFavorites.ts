import { CollectionFavoriteQueryResultDto } from '@infinityxyz/lib-frontend/types/dto';
import { useFetchInfinite } from 'src/utils';

export function useFavorites() {
  const { result, setSize, isError, isLoading } = useFetchInfinite<CollectionFavoriteQueryResultDto>(
    '/collections/phase/favorites',
    {
      query: {
        orderDirection: 'desc',
        limit: 10
      }
    }
  );

  return { result, isLoading, isError, setSize };
}

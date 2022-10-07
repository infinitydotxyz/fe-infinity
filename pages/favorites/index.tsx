import { PageBox, Spinner } from 'src/components/common';
import { FavoritesDescription } from 'src/components/favorites/favorites-description';
import { useFavorites } from 'src/hooks/api/useFavorites';

export default function FavoriteCollectionsLeaderboard() {
  const { result: phases, isError, isLoading } = useFavorites();

  return (
    <PageBox title="Favorite collections">
      {isLoading && <Spinner />}

      {isError && <div className="flex flex-col mt-10">Unable to load favorites.</div>}

      {phases?.map((phase) => (
        <FavoritesDescription phase={phase} />
      ))}
    </PageBox>
  );
}

import { UserFavoriteDto } from '@infinityxyz/lib-frontend/types/dto';
import { LeaderBoardRow } from './leaderboard';

export const UserFavoriteCollection = (favorite: UserFavoriteDto | null | undefined, isActivePhase: boolean) => {
  if (!favorite && !isActivePhase) {
    return <i>You didn't vote on any collection during this phase.</i>;
  }

  return (
    <>
      {favorite ? (
        <LeaderBoardRow collection={favorite} className="w-full" minimal />
      ) : (
        <i>You haven't favorite'd a collection for this phase yet</i>
      )}
    </>
  );
};

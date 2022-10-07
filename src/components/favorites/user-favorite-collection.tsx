import { UserFavoriteDto } from '@infinityxyz/lib-frontend/types/dto';
import router from 'next/router';
import { Button } from '../common';
import { LeaderBoardRow } from './leaderboard';

export const UserFavoriteCollection = (favorite: UserFavoriteDto | null | undefined, isActivePhase: boolean) => {
  if (!favorite && !isActivePhase) {
    return <i>You didn't vote on any collection during this phase.</i>;
  }

  return (
    <>
      {favorite && <LeaderBoardRow collection={favorite} className="w-full" />}
      <Button className="mx-auto mt-4" onClick={() => router.push('/trending')}>
        {favorite ? 'Change favorite' : 'Find an interesting collection'}
      </Button>
    </>
  );
};

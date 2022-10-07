import { FavoriteCollectionPhaseDto } from '@infinityxyz/lib-frontend/types/dto';
import { Spinner } from 'flowbite-react';
import { useFavoriteLeaderboard } from 'src/hooks/api/useFavoriteLeaderboard';
import { useUserFavorite } from 'src/hooks/api/useUserFavorite';
import useScreenSize from 'src/hooks/useScreenSize';
import { twMerge } from 'tailwind-merge';
import { TooltipWrapper } from '../common';
import { PulseIconColor } from '../common/pulse-icon';
import { InfoBox } from '../rewards/info-box';
import { RewardsProgressBar } from '../rewards/progressbar';
import { CollectionFavoritesInfo } from './info';
import { Leaderboard } from './leaderboard';
import { UserFavoriteCollection } from './user-favorite-collection';

// TODO: move this to InfoBox component as default render func for reusability
const renderTooltip = (props: { isHovered: boolean; children?: React.ReactNode; title?: string; message?: string }) => {
  return (
    <TooltipWrapper
      className="w-fit min-w-[200px]"
      show={props.isHovered}
      tooltip={{
        title: props.title ?? '',
        content: props.message ?? ''
      }}
    >
      {props.children}
    </TooltipWrapper>
  );
};

export const FavoritesDescription: React.FC<{ phase: FavoriteCollectionPhaseDto }> = ({ phase }) => {
  const { result: userFavorite, isLoading: isLoadingUserFavorite } = useUserFavorite(phase.id);
  const { result: leaderboard, isLoading: isLoadingLeaderboard } = useFavoriteLeaderboard(phase.id);
  const { isMobile } = useScreenSize();

  return (
    <InfoBox
      title={phase.name}
      isPulsing={phase.isActive}
      pulseIconColor={phase.isActive ? PulseIconColor.Blue : PulseIconColor.Gray}
      renderTooltip={renderTooltip}
      tooltipTitle={phase.isActive ? 'Active' : 'Finished'}
      tooltipMessage={phase.isActive ? 'Phase active' : 'Phase finished'}
    >
      <div className={twMerge('flex align-center justify-left', isMobile ? 'flex-col' : '')}>
        <InfoBox.SideInfo>
          <div className="mb-4 space-y-4">
            <InfoBox.Stats title="Collection Favorites" description={CollectionFavoritesInfo()} />
            <InfoBox.Stats
              title="Your Favorite"
              description={isLoadingUserFavorite ? <Spinner /> : UserFavoriteCollection(userFavorite, phase.isActive)}
            />
            <InfoBox.Stats title="Stats">
              <div className="w-full py-2">
                <div className="text-sm mt-1">Progress</div>
                <div className="text-2xl font-heading font-bold">
                  <RewardsProgressBar
                    amount={phase.progress < 1 ? Math.ceil(phase.progress) : phase.progress}
                    max={100}
                  />
                </div>
              </div>
            </InfoBox.Stats>
          </div>
        </InfoBox.SideInfo>
        <div className={twMerge('w-full', isMobile ? '' : 'ml-6')}>
          <InfoBox.SideInfo className="w-full">
            <InfoBox.Stats title="Leaderboard">
              {isLoadingLeaderboard && <Spinner />}
              {!!leaderboard?.data && <Leaderboard collections={leaderboard.data} />}
            </InfoBox.Stats>
          </InfoBox.SideInfo>
        </div>
      </div>
    </InfoBox>
  );
};

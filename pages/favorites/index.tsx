import { CollectionFavoriteDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRouter } from 'next/router';
import { Button, PageBox, Spinner, TooltipWrapper } from 'src/components/common';
import { NoResultsBox } from 'src/components/common/no-results-box';
import { PulseIconColor } from 'src/components/common/pulse-icon';
import { CollectionFavoritesInfo } from 'src/components/favorites/info';
import { Leaderboard, LeaderBoardRow } from 'src/components/favorites/leaderboard';
import { InfoBox } from 'src/components/rewards/info-box';
import { RewardsProgressBar } from 'src/components/rewards/progressbar';
import { useFavorites } from 'src/hooks/api/useFavorites';
import useScreenSize from 'src/hooks/useScreenSize';
import { twMerge } from 'tailwind-merge';

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

export default function FavoriteCollectionsLeaderboard() {
  const router = useRouter();
  const { result, isError, isLoading } = useFavorites();
  const { isMobile } = useScreenSize();

  // TODO: change API to return all phases (like raffles) and limit leaderboard to 10 items

  // TODO: fetch user favorited from API
  const userFavorite: CollectionFavoriteDto = {
    timestamp: 1664993449406,
    collectionAddress: '0x60e4d786628fea6478f785a6d7e704777c86a7c6',
    bannerImage:
      'https://lh3.googleusercontent.com/5c-HcdLMinTg3LvEwXYZYC-u5nN22Pn5ivTPYA4pVEsWJHU1rCobhUlHSFjZgCHPGSmcGMQGCrDCQU8BfSfygmL7Uol9MRQZt6-gqA=s2500',
    hasBlueCheck: true,
    profileImage:
      'https://lh3.googleusercontent.com/lHexKRMpw-aoSyB1WdFBff5yfANLReFxHzt1DOj_sg7mS14yARpuvYcUtsyyx-Nkpk6WTcUPFoG53VnLJezYi8hAs0OxNZwlw6Y-dmI=s120',
    slug: 'mutantapeyachtclub',
    collectionChainId: '1',
    numFavorites: 1,
    name: 'Mutant Ape Yacht Club'
  };

  const progress = 20; // TODO: get progress from API

  return (
    <PageBox title="Favorite collections">
      {isLoading && <Spinner />}

      <InfoBox
        title="Phase 1"
        isPulsing={true}
        pulseIconColor={PulseIconColor.Blue}
        renderTooltip={renderTooltip}
        tooltipTitle={'Active'}
        tooltipMessage={'Phase active'}
      >
        <div className={twMerge('flex align-center justify-left', isMobile ? 'flex-col' : '')}>
          <InfoBox.SideInfo>
            <div className="mb-4 space-y-4">
              <InfoBox.Stats title="Collection Favorites" description={CollectionFavoritesInfo()} />
              <InfoBox.Stats
                title="Your Favorite"
                description={
                  <>
                    <LeaderBoardRow collection={userFavorite} className="w-full" />
                    <Button className="mx-auto mt-4" onClick={() => router.push('/trending')}>
                      {userFavorite ? 'Change favorite' : 'Find an interesting collection'}
                    </Button>
                  </>
                }
              />
              <InfoBox.Stats title="Stats">
                <div className="w-full py-2">
                  <div className="text-sm mt-1">Progress</div>
                  <div className="text-2xl font-heading font-bold">
                    <RewardsProgressBar amount={progress < 1 ? Math.ceil(progress) : progress} max={100} />
                  </div>
                </div>
              </InfoBox.Stats>
            </div>
          </InfoBox.SideInfo>
          <div className={twMerge('w-full', isMobile ? '' : 'ml-6')}>
            <InfoBox.SideInfo className="w-full">
              <InfoBox.Stats title="Leaderboard">
                {isError && <div className="flex flex-col mt-10">Unable to load favorites.</div>}

                {result && result[0].data?.length > 0 && <Leaderboard collections={result[0].data} />}

                {result && result[0].data?.length === 0 && (
                  <NoResultsBox
                    title="No collections have been favorited yet"
                    buttonText="Find an interesting collection"
                    onClick={() => router.push('/trending')}
                  />
                )}
              </InfoBox.Stats>
            </InfoBox.SideInfo>
          </div>
        </div>
      </InfoBox>
    </PageBox>
  );
}

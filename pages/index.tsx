import { EventType } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import { RaffleDescription } from 'src/components/raffles/raffle-description';
import { useRaffles } from 'src/hooks/api/useRaffles';
import { Button, CenteredContent, PageBox, Spacer, Spinner } from 'src/components/common';
import { FavoritesDescription } from 'src/components/favorites/favorites-description';
import { GlobalFeedList } from 'src/components/feed-list/global-feed-list';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { StartFooter } from 'src/components/start/start-footer';
import { TrendingStart } from 'src/components/start/trending-start';
import { useFavorites } from 'src/hooks/api/useFavorites';
import { twMerge } from 'tailwind-merge';
import GlobalRewards from './rewards/global-rewards';

const HomePage = () => {
  const router = useRouter();

  const titleHeader = (title: string, className = '', morePath = '') => {
    return (
      <div className={twMerge('mb-6 flex items-center', className)}>
        <div className="text-3xl text-gray-700 font-bold">{title}</div>
        <Spacer />
        <Button size="medium" variant="outline" onClick={() => router.push(morePath)}>
          See More
        </Button>
      </div>
    );
  };

  return (
    <PageBox title="Home" showTitle={false} footer={<StartFooter />}>
      {titleHeader('Curated Collections', 'mt-6', '/curated?tab=All+Curated')}
      <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Votes} />

      {titleHeader('Trending', 'mt-8', '/trending')}
      <TrendingStart />

      {titleHeader('Feed', 'mt-10', '/feed')}
      <GlobalFeedList
        types={[EventType.TwitterTweet, EventType.DiscordAnnouncement, EventType.CoinMarketCapNews]}
        compact={true}
      />

      {titleHeader('Rewards', 'mt-10', '/rewards?tab=Global+Rewards')}
      <GlobalRewards showCount={1} />

      {titleHeader('Favorites', 'mt-10', '/favorites')}
      <FavoritesPanel />

      {titleHeader('Raffles', 'mt-10', '/raffles')}

      <RafflesPanel />
    </PageBox>
  );
};

export default HomePage;

// ===========================================================

const FavoritesPanel = () => {
  const { result: phases, isError, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  }

  if (isError) {
    return <div className="flex flex-col mt-10">Unable to load favorites.</div>;
  }

  return (
    <div className="space-y-4">
      {phases?.map((phase, index) => {
        if (index < 1) {
          return <FavoritesDescription key={phase.id} phase={phase} />;
        }
      })}
    </div>
  );
};

// ======================================================

const RafflesPanel = () => {
  const {
    result: { raffles, ethPrice },
    isLoading,
    isError
  } = useRaffles();

  if (isLoading) {
    return (
      <CenteredContent>
        <Spinner />
      </CenteredContent>
    );
  }

  if (isError) {
    return <div className="flex flex-col mt-10">Unable to load raffles.</div>;
  }

  return (
    <div className="space-y-4">
      {raffles.map((raffle, index) => {
        // just show first two
        if (index < 2) {
          return <RaffleDescription raffle={raffle} key={raffle.id} ethPrice={ethPrice} />;
        }
      })}
    </div>
  );
};

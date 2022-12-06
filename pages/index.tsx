import { EventType } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import { RaffleDescription } from 'src/components/raffles/raffle-description';
import { useRaffles } from 'src/hooks/api/useRaffles';
import { Button, CenteredContent, PageBox, pageStyles, Spacer, Spinner } from 'src/components/common';
import { FavoritesDescription } from 'src/components/favorites/favorites-description';
import { GlobalFeedList } from 'src/components/feed-list/global-feed-list';
import { AllCuratedStart } from 'src/components/start/all-curated-start';
import { StartFooter } from 'src/components/start/start-footer';
import { TrendingStart } from 'src/components/start/trending-start';
import { useFavorites } from 'src/hooks/api/useFavorites';
import { twMerge } from 'tailwind-merge';
import GlobalRewards from './rewards/global-rewards';
import { ReactNode } from 'react';

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
    <PageBox title="Home" fullWidth showTitle={false} footer={<StartFooter />}>
      <HomeSection theme="white">
        {titleHeader('Recently Curated Collections', 'mt-6', '/curated?tab=All+Curated')}
        <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Timestamp} />
      </HomeSection>

      <HomeSection theme="red">
        {titleHeader('Rewards', 'mt-10', '/rewards?tab=Global+Rewards')}
        <GlobalRewards showCount={1} />
      </HomeSection>

      <HomeSection theme="blue">
        {titleHeader('Favorites', 'mt-10', '/favorites')}
        <FavoritesPanel />
      </HomeSection>

      <HomeSection theme="black">
        {titleHeader('Raffles', 'mt-10', '/raffles')}
        <RafflesPanel />
      </HomeSection>

      <HomeSection theme="red">
        {titleHeader('Trending', 'mt-8', '/trending')}
        <TrendingStart />
      </HomeSection>

      <HomeSection theme="blue">
        {titleHeader('Feed', 'mt-10', '/feed')}
        <GlobalFeedList
          types={[EventType.TwitterTweet, EventType.DiscordAnnouncement, EventType.CoinMarketCapNews]}
          compact={true}
        />
      </HomeSection>
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

// ===========================================================

interface Props {
  children: ReactNode;
  theme: 'red' | 'white' | 'blue' | 'black';
}

const HomeSection = ({ children, theme }: Props) => {
  let bg = '';

  switch (theme) {
    case 'red':
      bg = 'bg-red-500';
      break;
    case 'white':
      break;

    case 'blue':
      bg = 'bg-blue-500';
      break;

    case 'black':
      bg = 'bg-black';
      break;
  }
  return (
    <div className={twMerge(bg, 'pt-7 pb-24')}>
      <div className={pageStyles}>{children}</div>
    </div>
  );
};

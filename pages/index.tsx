import { EventType } from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionsOrderBy } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections-query.dto';
import { useRouter } from 'next/router';
import { RaffleDescription } from 'src/components/raffles/raffle-description';
import { useRaffles } from 'src/hooks/api/useRaffles';
import {
  CenteredContent,
  ColoredButton,
  backColorForTheme,
  textColorForTheme,
  PageBox,
  pageStyles,
  Spacer,
  Spinner,
  ThemeColor,
  headerColorForTheme
} from 'src/components/common';
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
  return (
    <PageBox title="Home" fullWidth showTitle={false} footer={<StartFooter />}>
      <HomeSection
        title="Recently Curated Collections"
        altTitle="Collections"
        url="/curated?tab=All+Curated"
        theme="white"
      >
        <AllCuratedStart orderBy={CuratedCollectionsOrderBy.Timestamp} />
      </HomeSection>

      <HomeSection title="Rewards" url="/rewards?tab=Global+Rewards" theme="red">
        <GlobalRewards showCount={1} />
      </HomeSection>

      <HomeSection title="Favorites" url="/favorites" theme="blue">
        <FavoritesPanel />
      </HomeSection>

      <HomeSection title="Raffles" url="/raffles" theme="black">
        <RafflesPanel />
      </HomeSection>

      <HomeSection title="Trending" url="trending" theme="red">
        <TrendingStart />
      </HomeSection>

      <HomeSection title="Feed" url="/feed" theme="blue">
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
  title: string;
  altTitle?: string;
  url: string;
  theme: ThemeColor;
}

const HomeSection = ({ children, altTitle, theme, title, url }: Props) => {
  const router = useRouter();

  const titleHeader = (title: string, className = '', theme: ThemeColor, morePath = '') => {
    return (
      <div className={twMerge('mb-6 flex items-center', className)}>
        <div className="text-7xl font-bold font-[empires] " style={{ color: headerColorForTheme(theme) }}>
          {title}
        </div>
        <Spacer />
        <ColoredButton
          textColor={textColorForTheme(theme)}
          backgroundColor={backColorForTheme(theme)}
          onClick={() => router.push(morePath)}
        >
          See More
        </ColoredButton>
      </div>
    );
  };

  return (
    <div className="pt-28 pb-24 relative" style={{ background: textColorForTheme(theme) }}>
      <div
        className="absolute -top-10 -left-7 right-0 font-[empires]  opacity-25  text-[299px]"
        style={{ color: backColorForTheme(theme) }}
      >
        {altTitle ?? title}
      </div>

      <div className={twMerge(pageStyles, 'relative')}>
        {titleHeader(title, 'mt-6', theme, url)}

        {children}
      </div>
    </div>
  );
};

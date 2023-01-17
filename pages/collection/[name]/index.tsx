import { BaseCollection, ChainId, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import NotFound404Page from 'pages/not-found-404';
import { useState } from 'react';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { ASortButton } from 'src/components/astra/astra-sort-button';
import { AStatusFilterButton } from 'src/components/astra/astra-status-button';
import { ATraitFilter } from 'src/components/astra/astra-trait-filter';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { useCollectionTokenFetcher } from 'src/components/astra/useFetcher';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { Spacer } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { TopHolderList } from 'src/components/feed/top-holder-list';
import { TwitterSupporterList } from 'src/components/feed/twitter-supporter-list';
import { OrderbookCharts } from 'src/components/orderbook/charts/orderbook-charts';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { apiGet, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOrdersContext } from 'src/utils/context/OrdersContext';

interface CollectionDashboardProps {
  collection: BaseCollection;
  collectionAllTimeStats?: CollectionStats;
  collectionCurrentStats?: CollectionStatsDto;
  error?: Error;
}

export default function ItemsPage(props: CollectionDashboardProps) {
  const collection = props.collection;
  if (!collection) {
    return <NotFound404Page />;
  }

  const {
    isNFTSelected: isSelected,
    isNFTSelectable: isSelectable,
    listMode,
    toggleNFTSelection: toggleSelection
  } = useAppContext();
  const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection.address);
  const { updateFilters } = useOrdersContext();
  const { setRef, scrollTop } = useScrollInfo();
  const tabs = ['Items'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  const setMinPrice = (value: string) => {
    updateFilters([{ name: 'minPrice', value }]);
  };

  const setMaxPrice = (value: string) => {
    updateFilters([{ name: 'maxPrice', value }]);
  };

  const onPricesClear = () => {
    updateFilters([
      { name: 'minPrice', value: '' },
      { name: 'maxPrice', value: '' }
    ]);
  };

  const onTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const firstAllTimeStats = props.collectionAllTimeStats;
  const currentStats = props.collectionCurrentStats;

  const twitterFollowersPercentChange =
    firstAllTimeStats?.twitterFollowersPercentChange ?? currentStats?.twitterFollowersPercentChange;
  const twitterFollowers = nFormatter(firstAllTimeStats?.twitterFollowers ?? currentStats?.twitterFollowers);
  const discordFollowersPercentChange =
    firstAllTimeStats?.discordFollowersPercentChange ?? currentStats?.discordFollowersPercentChange;
  const discordFollowers = nFormatter(firstAllTimeStats?.discordFollowers ?? currentStats?.discordFollowers);

  const totalVol = nFormatter(firstAllTimeStats?.volume ? firstAllTimeStats.volume : currentStats?.volume);
  const floorPrice = nFormatter(
    firstAllTimeStats?.floorPrice ? firstAllTimeStats.floorPrice : currentStats?.floorPrice
  );
  const numOwners = nFormatter(firstAllTimeStats?.numOwners ? firstAllTimeStats.numOwners : currentStats?.numOwners);
  const numNfts = nFormatter(firstAllTimeStats?.numNfts ? firstAllTimeStats.numNfts : currentStats?.numNfts);

  const headerProps: CollectionPageHeaderProps = {
    expanded: scrollTop < 100,
    avatarUrl: collection.metadata.profileImage || collection.metadata.bannerImage,
    title: collection.metadata.name,
    description: collection.metadata.description,
    hasBlueCheck: collection.hasBlueCheck,
    slug: collection.slug,
    collection: collection,
    totalVol,
    floorPrice,
    numOwners,
    numNfts,
    twitterFollowersPercentChange,
    twitterFollowers,
    discordFollowersPercentChange,
    discordFollowers,
    tabs,
    onTabChange
  };

  const head = (
    <Head>
      <meta property="og:title" content={collection.metadata?.name} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://flow.so/collection/${collection?.slug}`} />
      <meta property="og:site_name" content="flow.so" />
      <meta property="og:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="og:image:alt" content={collection.metadata?.description} />
      <meta property="og:description" content={collection.metadata?.description} />

      <meta name="theme-color" content="#000000" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@flowdotso" />
      <meta name="twitter:title" content={collection.metadata?.name} />
      <meta name="twitter:description" content={collection.metadata?.description} />
      <meta name="twitter:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="twitter:image:alt" content={collection.metadata?.description} />
      <meta property="twitter:creator" content={collection.metadata?.links?.twitter} />
    </Head>
  );

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden">
      {head}
      <div className="h-full w-full flex flex-col">
        <CollectionPageHeader {...headerProps} />

        <div ref={setRef} className="overflow-y-auto">
          {selectedTab === 'Items' && (
            <div>
              <div className="flex mt-2 px-4">
                <div className="flex">
                  <CollectionNftSearchInput slug={collection.slug} expanded />
                </div>
                <Spacer />
                <div className="flex space-x-2">
                  <ASortButton />
                  <AStatusFilterButton />
                  <APriceFilter onClear={onPricesClear} setMinPrice={setMinPrice} setMaxPrice={setMaxPrice} />
                  <ATraitFilter collectionAddress={collection.address} />
                </div>
              </div>

              <TokenGrid
                listMode={listMode}
                className="px-4 py-4"
                onClick={toggleSelection}
                isSelectable={isSelectable}
                isSelected={isSelected}
                data={data}
                hasNextPage={hasNextPage}
                onFetchMore={() => fetch(true)}
                isError={!!error}
                isLoading={!!isLoading}
              />
            </div>
          )}

          {selectedTab === 'Orders' && <OrderbookCharts />}
          {selectedTab === 'Analytics' && (
            <div className="flex space-x-10 px-10 py-10">
              <div className="flex-1">{collection && <TopHolderList collection={collection}></TopHolderList>}</div>
              <div className="flex-1">
                {collection && <TwitterSupporterList collection={collection}></TwitterSupporterList>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');

  const id = context.query.name as string;
  const chainId = ChainId.Mainnet; // todo do not hardcode
  const collBaseData = await apiGet(`/collections/${id}`); // todo: needs to send chainId in query for multi chain to work

  const { result: allTimeStatsResult } = await apiGet(`/collections/${id}/stats`, {
    query: {
      chainId,
      offset: 0,
      limit: 10,
      orderBy: 'volume',
      orderDirection: 'desc',
      minDate: 0,
      maxDate: 2648764957623,
      period: 'all'
    }
  });
  const allTimeStats = allTimeStatsResult?.data;
  const firstAllTimeStats = allTimeStats?.[0]; // first item = latest daily stats

  const { result: currentStatsResult } = await apiGet(`/collections/${id}/stats/current`, {
    query: { chainId }
  });
  const currentStats = currentStatsResult?.data;

  return {
    props: {
      collection: collBaseData.result ?? null,
      collectionAllTimeStats: firstAllTimeStats ?? null,
      collectionCurrentStats: currentStats ?? null,
      error: collBaseData.error ?? null
    }
  };
}

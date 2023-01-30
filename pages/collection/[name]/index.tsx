import { BaseCollection, ChainId, CollectionAttributes, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import NotFound404Page from 'pages/not-found-404';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GiBroom } from 'react-icons/gi';
import { AButton } from 'src/components/astra/astra-button';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { ASortButton } from 'src/components/astra/astra-sort-button';
import { AStatusFilterButton } from 'src/components/astra/astra-status-button';
import { ATraitFilter } from 'src/components/astra/astra-trait-filter';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { Spacer, TextInputBox } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { OrderbookCharts } from 'src/components/orderbook/charts/orderbook-charts';
import { useCollectionTokenFetcher } from 'src/hooks/api/useTokenFetcher';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { apiGet, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem, TokensFilter } from 'src/utils/types';
import { borderColor, brandTextColor, hoverColor, iconButtonStyle, selectedColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface CollectionDashboardProps {
  collection: BaseCollection;
  collectionAllTimeStats?: CollectionStats;
  collectionCurrentStats?: CollectionStatsDto;
  collectionAttributes?: CollectionAttributes;
  error?: Error;
}

export default function ItemsPage(props: CollectionDashboardProps) {
  const collection = props.collection;
  if (!collection) {
    return <NotFound404Page />;
  }

  const {
    isNFTSelected,
    isNFTSelectable,
    listMode,
    toggleNFTSelection,
    toggleMultipleNFTSelection,
    toggleCollSelection,
    isCollSelected,
    isCollSelectable,
    collSelection
  } = useAppContext();
  const [filter, setFilter] = useState<TokensFilter>({});
  const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection.address, filter);
  const { setRef, scrollTop } = useScrollInfo();
  const tabs = ['Items', 'Analytics'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const { cartType, setCartType } = useCartContext();
  const [numSweep, setNumSweep] = useState('');
  const [customSweep, setCustomSweep] = useState('');

  const MAX_NUM_SWEEP_ITEMS = 50;

  useEffect(() => {
    fetch(false);
  }, [filter, collection.address]);

  useEffect(() => {
    if (collSelection.length > 0) {
      setCartType(CartType.CollectionOffer);
    } else {
      setCartType(CartType.TokenOffer);
    }
  });

  useEffect(() => {
    const numToSelect = Math.min(data.length, parseInt(numSweep), MAX_NUM_SWEEP_ITEMS);
    const tokens = [];
    for (let i = 0; i < numToSelect; i++) {
      tokens.push(data[i]);
    }
    toggleMultipleNFTSelection(tokens);
  }, [numSweep]);

  const onTabChange = (tab: string) => {
    setSelectedTab(tab);
  };

  const onClickNFT = (token: ERC721TokenCartItem) => {
    toggleNFTSelection(token);
  };

  const collectionCreator = collection.owner;

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
    data[0]?.orderSnippet?.listing?.orderItem?.startPriceEth
      ? data[0]?.orderSnippet?.listing?.orderItem?.startPriceEth
      : firstAllTimeStats?.floorPrice
      ? firstAllTimeStats.floorPrice
      : currentStats?.floorPrice
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

        <div ref={setRef} className="overflow-y-auto scrollbar-hide">
          {selectedTab === 'Items' && (
            <div>
              <div className="flex mt-2 px-4">
                <div className="flex">
                  <CollectionNftSearchInput slug={collection.slug} expanded collectionFloorPrice={floorPrice} />
                </div>

                <Spacer />

                <div className="flex space-x-2 text-sm">
                  <AButton
                    primary
                    className="px-5 py-1 rounded-lg text-sm"
                    onClick={() => {
                      setCartType(CartType.CollectionOffer);
                      if (isCollSelectable(collection as ERC721CollectionCartItem)) {
                        return toggleCollSelection(collection as ERC721CollectionCartItem);
                      }
                    }}
                  >
                    {isCollSelected(collection as ERC721CollectionCartItem) ? (
                      <div className="flex items-center space-x-1">
                        <AiOutlineCheckCircle className={'h-4 w-4'} />
                        <div>Collection Offer</div>
                      </div>
                    ) : (
                      'Collection Offer'
                    )}
                  </AButton>

                  <div className={twMerge('flex flex-row rounded-lg border cursor-pointer', borderColor)}>
                    <div className={twMerge('flex items-center border-r-[1px] px-6 cursor-default', borderColor)}>
                      <GiBroom className={twMerge(iconButtonStyle, brandTextColor)} />
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        numSweep === '5' && selectedColor
                      )}
                      onClick={() => {
                        setNumSweep('5');
                      }}
                    >
                      5
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        numSweep === '10' && selectedColor
                      )}
                      onClick={() => {
                        setNumSweep('10');
                      }}
                    >
                      10
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        numSweep === '20' && selectedColor
                      )}
                      onClick={() => {
                        setNumSweep('20');
                      }}
                    >
                      20
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        numSweep === '50' && selectedColor
                      )}
                      onClick={() => {
                        setNumSweep('50');
                      }}
                    >
                      50
                    </div>
                    <div className="px-4 h-full flex items-center">
                      <TextInputBox
                        autoFocus={true}
                        inputClassName="text-sm"
                        className="border-0 w-14 p-0 text-sm"
                        type="number"
                        placeholder="Custom"
                        value={customSweep}
                        onChange={(value) => {
                          setNumSweep(value);
                          setCustomSweep(value);
                        }}
                      />
                    </div>
                  </div>

                  <ASortButton filter={filter} setFilter={setFilter} />
                  <AStatusFilterButton filter={filter} setFilter={setFilter} />
                  <APriceFilter filter={filter} setFilter={setFilter} />
                  <ATraitFilter
                    collectionAddress={collection.address}
                    filter={filter}
                    setFilter={setFilter}
                    collectionAttributes={props.collectionAttributes}
                  />
                </div>
              </div>

              <TokenGrid
                collectionCreator={collectionCreator}
                collectionFloorPrice={floorPrice}
                listMode={listMode}
                className={twMerge(
                  'px-4 py-4 min-h-[600px]',
                  cartType === CartType.CollectionOffer ? 'opacity-30 duration-300 pointer-events-none' : 'duration-300'
                )} // this min height is to prevent the grid from collapsing when there are no items so filter menus can still render
                onClick={onClickNFT}
                isSelectable={isNFTSelectable}
                isSelected={isNFTSelected}
                data={data}
                hasNextPage={hasNextPage}
                onFetchMore={() => fetch(true)}
                isError={!!error}
                isLoading={!!isLoading}
              />
            </div>
          )}

          {selectedTab === 'Analytics' && <OrderbookCharts collectionAddress={collection.address} />}
          {/* {selectedTab === 'Analytics' && (
            <div className="flex justify-center px-4 mt-5 space-x-4">
              <div className="flex space-x-4">
                <div className="w-1/2">{collection && <TopHolderList collection={collection}></TopHolderList>}</div>
                <div className="w-1/2">
                  {collection && <TwitterSupporterList collection={collection}></TwitterSupporterList>}
                </div>
              </div>

              <div className="w-1/2">
                {collection && (
                  <CollectionSocialFeed
                    types={[EventType.DiscordAnnouncement, EventType.TwitterTweet]}
                    collectionAddress={collection?.address ?? ''}
                    collectionName={collection?.metadata.name ?? ''}
                    collectionSlug={collection?.slug ?? ''}
                    collectionProfileImage={collection?.metadata.profileImage ?? ''}
                  />
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');

  const id = context.query.name as string;
  const chainId = ChainId.Mainnet; // todo do not hardcode
  const collBaseDataPromise = apiGet(`/collections/${id}`); // todo: needs to send chainId in query for multi chain to work
  const collAllTimeStatsPromise = apiGet(`/collections/${id}/stats`, {
    query: {
      chainId,
      offset: 0,
      limit: 1,
      orderDirection: 'desc',
      minDate: 0,
      maxDate: 2648764957623,
      period: 'all'
    }
  });

  // todo: this seems to be returning null so commenting out for now
  // const collCurrentStatsPromise = apiGet(`/collections/${id}/stats/current`, {
  //   query: { chainId }
  // });

  const attributesPromise = apiGet(`/collections/${id}/attributes`, {
    query: {
      chainId: '1'
    }
  });

  const [collBaseData, { result: allTimeStatsResult }, { result: collectionAttributes }] = await Promise.all([
    collBaseDataPromise,
    collAllTimeStatsPromise,
    attributesPromise
  ]);

  const allTimeStats = allTimeStatsResult?.data;
  const firstAllTimeStats = allTimeStats?.[0]; // first item = latest daily stats

  return {
    props: {
      collection: collBaseData.result ?? null,
      collectionAllTimeStats: firstAllTimeStats ?? null,
      collectionCurrentStats: null, // todo: this seems to be returning null clean up later
      collectionAttributes: collectionAttributes ?? null,
      error: collBaseData.error ?? null
    }
  };
}

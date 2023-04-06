import { BaseCollection, CollectionAttributes, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { FaDiscord } from 'react-icons/fa';
import { GiBroom } from 'react-icons/gi';
import { AButton } from 'src/components/astra/astra-button';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { ASortButton } from 'src/components/astra/astra-sort-button';
import { AStatusFilterButton } from 'src/components/astra/astra-status-button';
import { ATraitFilter } from 'src/components/astra/astra-trait-filter';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { CollectionCharts } from 'src/components/collection/collection-charts';
import { CollectionItemsPageSidebar } from 'src/components/collection/collection-items-page-sidebar';
import { CollectionOrderList } from 'src/components/collection/collection-orders-list';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { CenteredContent, ExternalLink, EZImage, Spacer, TextInputBox } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
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
  collectionAttributes?: CollectionAttributes;
  error?: Error;
}

export default function ItemsPage(props: CollectionDashboardProps) {
  const collection = props.collection;

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
  const { setRef } = useScrollInfo();
  const tabs = ['Items', 'Bids', 'Analytics'];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const { cartType, setCartType } = useCartContext();
  const [numSweep, setNumSweep] = useState('');
  const [customSweep, setCustomSweep] = useState('');
  const { showCart, setShowCart } = useAppContext();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const MAX_NUM_SWEEP_ITEMS = 50;

  useEffect(() => {
    if (filter.traitTypes?.length) {
      const traits = [];
      for (let i = 0; i < filter.traitTypes.length; i++) {
        const traitType = filter.traitTypes?.[i];
        const traitValues = filter.traitValues?.[i]?.split('|') ?? [];
        for (const traitValue of traitValues) {
          traits.push(`${traitType}: ${traitValue}`);
        }
      }
      setSelectedTraits(traits);
    } else {
      setSelectedTraits([]);
    }

    // refetch data
    fetch(false);
  }, [filter, collection.address]);

  useEffect(() => {
    if (collSelection.length > 0) {
      setCartType(CartType.CollectionOffer);
    } else {
      setCartType(CartType.TokenOffer);
    }
  }, [collSelection]);

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

  const isCollSupported = collection?.isSupported ?? false;

  if (!isCollSupported) {
    return (
      <CenteredContent>
        <div className="flex flex-col items-center space-y-2">
          {collection?.metadata?.profileImage ? (
            <EZImage src={collection.metadata.profileImage} className="h-40 w-40 rounded-lg overflow-clip" />
          ) : null}
          <div className="text-3xl font-heading font-medium">
            {collection?.metadata?.name ?? 'This collection'} is not supported on Flow
          </div>
          <div className="flex flex-col text-md">
            <span>Common reasons a collection is not supported:</span>
            <ul className="list-disc list-inside mt-2 mb-2">
              <li>Collection is not ERC-721</li>
              <li>Low volumes</li>
              <li>Creator(s) rugged the project</li>
              <li>Dead community</li>
            </ul>
            <div className="flex items-center space-x-2">
              <div>If this is a mistake, let us know on</div>
              <ExternalLink href="https://discord.gg/flowdotso">
                <FaDiscord className={twMerge('text-brand-discord cursor-pointer mt-1', iconButtonStyle)} />
              </ExternalLink>
            </div>
          </div>
        </div>
      </CenteredContent>
    );
  }

  const collectionCreator = collection.owner;

  const firstAllTimeStats = props.collectionAllTimeStats;

  const twitterFollowers = nFormatter(firstAllTimeStats?.twitterFollowers);
  const discordFollowers = nFormatter(
    isNaN(firstAllTimeStats?.discordFollowers ?? 0)
      ? firstAllTimeStats?.prevDiscordFollowers
      : firstAllTimeStats?.discordFollowers
  );

  const totalVol = nFormatter(firstAllTimeStats?.volume ? firstAllTimeStats.volume : 0);
  const floorPrice = nFormatter(firstAllTimeStats?.floorPrice ? firstAllTimeStats.floorPrice : 0);
  const numOwners = nFormatter(firstAllTimeStats?.numOwners ? firstAllTimeStats.numOwners : 0);
  const numNfts = nFormatter(firstAllTimeStats?.numNfts ? firstAllTimeStats.numNfts : 0);

  const headerProps: CollectionPageHeaderProps = {
    expanded: true,
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
    twitterFollowers,
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
          {selectedTab === 'Items' ? (
            <div>
              <div className="flex mt-2 px-4">
                <div
                  className={twMerge(
                    'flex mr-1',
                    cartType === CartType.CollectionOffer
                      ? 'opacity-30 duration-300 pointer-events-none'
                      : 'duration-300'
                  )}
                >
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
                        setShowCart(!showCart);
                        return toggleCollSelection(collection as ERC721CollectionCartItem);
                      }
                    }}
                  >
                    {isCollSelected(collection as ERC721CollectionCartItem) ? (
                      <div className="flex items-center space-x-1">
                        <AiOutlineCheckCircle className={'h-4 w-4'} />
                        <div>Collection Bid</div>
                      </div>
                    ) : (
                      'Collection Bid'
                    )}
                  </AButton>

                  <div
                    className={twMerge(
                      'flex flex-row rounded-lg border cursor-pointer',
                      borderColor,
                      cartType === CartType.CollectionOffer
                        ? 'opacity-30 duration-300 pointer-events-none'
                        : 'duration-300'
                    )}
                  >
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
                        numSweep === '5' ? setNumSweep('') : setNumSweep('5');
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
                        numSweep === '10' ? setNumSweep('') : setNumSweep('10');
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
                        numSweep === '20' ? setNumSweep('') : setNumSweep('20');
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
                        numSweep === '50' ? setNumSweep('') : setNumSweep('50');
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

                  <div
                    className={twMerge(
                      'flex space-x-1',
                      cartType === CartType.CollectionOffer
                        ? 'opacity-30 duration-300 pointer-events-none'
                        : 'duration-300'
                    )}
                  >
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
              </div>

              {selectedTraits.length > 0 && (
                <div className="flex px-4 mt-2 space-x-2">
                  {selectedTraits.map((trait) => {
                    return (
                      <div
                        key={trait}
                        className={twMerge('flex items-center rounded-lg border p-2 text-sm font-medium', borderColor)}
                      >
                        {trait}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex">
                <div className={(twMerge('flex'), showCart ? 'w-full' : 'w-2/3')}>
                  <TokenGrid
                    collectionCreator={collectionCreator}
                    collectionFloorPrice={floorPrice}
                    listMode={listMode}
                    className={twMerge(
                      'px-4 py-4 min-h-[600px]',
                      cartType === CartType.CollectionOffer
                        ? 'opacity-30 duration-300 pointer-events-none'
                        : 'duration-300'
                    )} // this min-height is to prevent the grid from collapsing when there are no items so filter menus can still render
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

                {!showCart && (
                  <div className="flex w-1/3">
                    <CollectionItemsPageSidebar
                      collectionAddress={collection.address}
                      collectionImage={collection.metadata.profileImage}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {selectedTab === 'Bids' ? (
            <div>
              <CollectionOrderList collectionAddress={collection.address} />
            </div>
          ) : null}

          {selectedTab === 'Analytics' ? (
            <div>
              <CollectionCharts
                collectionAddress={collection.address}
                collectionImage={collection.metadata.profileImage}
              />

              {/* <div className="flex px-4 mt-2 space-x-4">
                <div className="flex space-x-4 w-1/2">
                  <div className="w-1/2">
                    {collection ? <TopHolderList collection={collection}></TopHolderList> : null}
                  </div>
                  <div className="w-1/2">
                    {collection ? <TwitterSupporterList collection={collection}></TwitterSupporterList> : null}
                  </div>
                </div>

                <div className="w-1/2">
                  {collection ? (
                    <CollectionSocialFeed
                      types={[EventType.DiscordAnnouncement, EventType.TwitterTweet]}
                      collectionAddress={collection?.address ?? ''}
                      collectionName={collection?.metadata.name ?? ''}
                      collectionSlug={collection?.slug ?? ''}
                      collectionProfileImage={collection?.metadata.profileImage ?? ''}
                    />
                  ) : null}
                </div>
              </div> */}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');

  const id = context.query.name as string;
  const collBaseDataPromise = apiGet(`/collections/${id}`);
  const collAllTimeStatsPromise = apiGet(`/collections/${id}/stats`, {
    query: {
      period: 'all'
    }
  });

  const attributesPromise = apiGet(`/collections/${id}/attributes`);

  const [collBaseData, { result: allTimeStatsResult }, { result: collectionAttributes }] = await Promise.all([
    collBaseDataPromise,
    collAllTimeStatsPromise,
    attributesPromise
  ]);

  return {
    props: {
      collection: collBaseData.result ?? null,
      collectionAllTimeStats: allTimeStatsResult ?? null,
      collectionAttributes: collectionAttributes ?? null,
      error: collBaseData.error ?? null
    }
  };
}

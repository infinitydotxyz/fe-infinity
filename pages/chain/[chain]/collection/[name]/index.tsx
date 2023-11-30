import { ChainId, Collection, CollectionAttributes, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { AButton } from 'src/components/astra/astra-button';
import { AvFooter } from 'src/components/astra/astra-footer';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { CollectionCharts } from 'src/components/collection/collection-charts';
import { CollectionItemsPageSidebar } from 'src/components/collection/collection-items-page-sidebar';
import { CollectionManualBidList } from 'src/components/collection/collection-manual-bid-list';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { Spacer } from 'src/components/common';
import TabSelector from 'src/components/common/TabSelecter';
import MultiSwitch, { optionItemInterface } from 'src/components/common/multi-switch';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { useCollectionListingsFetcher } from 'src/hooks/api/useTokenFetcher';
import useScreenSize from 'src/hooks/useScreenSize';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { ETHCoinOutline, FilterListIcon } from 'src/icons';
import { CollectionPageTabs, apiGet, getNetwork, getNetworkName, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { tabItemBGColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';

interface CollectionDashboardProps {
  collection: Collection & Partial<CollectionStats>;
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
    selectedCollectionTab,
    setSelectedCollectionTab,
    collSelection
  } = useAppContext();

  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = (chain?.id || selectedChain || collection.chainId) as ChainId;

  const { setRef } = useScrollInfo();
  const { isDesktop } = useScreenSize();

  const {
    data: listings,
    error: listingsError,
    hasNextPage: listingsHasNextPage,
    isLoading: listingsIsLoading,
    fetch: fetchListings
  } = useCollectionListingsFetcher(collection?.address, chainId);

  // deep copy original listings to a new array
  const originalData = listings.map((x) => Object.assign({}, x));
  const [mutatedData, setMutatedData] = useState<ERC721TokenCartItem[]>(listings);

  const tabs = [
    CollectionPageTabs.Buy.toString(),
    CollectionPageTabs.Bid.toString(),
    CollectionPageTabs.LiveBids.toString(),
    CollectionPageTabs.Analytics.toString()
  ];

  const viewTypes: optionItemInterface[] = [
    { id: '1', name: 'Items' },
    { id: '2', name: 'Charts' }
  ];

  const { cartType, setCartType } = useCartContext();
  const [numSweep, setNumSweep] = useState('');
  const [bidBelowPct, setBidBelowPct] = useState('');
  const [customSweep, setCustomSweep] = useState('');
  const [viewType, setViewType] = useState(viewTypes[0].id);
  const { showCart } = useAppContext();

  const MAX_NUM_SWEEP_ITEMS = 50;

  useEffect(() => {
    if (
      selectedCollectionTab === CollectionPageTabs.Buy.toString() ||
      selectedCollectionTab === CollectionPageTabs.Bid.toString()
    ) {
      fetchListings(false);

      const interval = setInterval(() => {
        fetchListings(false);
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [collection.address]);

  useEffect(() => {
    if (
      selectedCollectionTab === CollectionPageTabs.Buy.toString() ||
      selectedCollectionTab === CollectionPageTabs.Bid.toString()
    ) {
      setMutatedData(listings);
    }
  }, [listings]);

  useEffect(() => {
    if (
      selectedCollectionTab === CollectionPageTabs.Buy.toString() ||
      selectedCollectionTab === CollectionPageTabs.Bid.toString()
    ) {
      fetchListings(false);
    }
  }, [selectedCollectionTab]);

  useEffect(() => {
    if (collSelection.length > 0) {
      setCartType(CartType.CollectionBid);
    } else if (selectedCollectionTab === CollectionPageTabs.Buy.toString()) {
      setCartType(CartType.TokenBuy);
    } else if (selectedCollectionTab === CollectionPageTabs.Bid.toString()) {
      setCartType(CartType.TokenBid);
    }
  }, [collSelection]);

  useEffect(() => {
    const numToSelect = Math.min(mutatedData.length, parseInt(numSweep), MAX_NUM_SWEEP_ITEMS);
    const tokens = [];
    for (let i = 0; i < numToSelect; i++) {
      tokens.push(mutatedData[i]);
    }
    toggleMultipleNFTSelection(tokens);
  }, [numSweep]);
  useEffect(() => {
    let bidBelowPctNum = parseFloat(bidBelowPct);
    if (isNaN(bidBelowPctNum)) {
      bidBelowPctNum = 0;
    }
    const mutatedTokens = [];
    for (const token of originalData) {
      const tokenOrigPrice = token?.price ?? 0;
      const bidPrice = tokenOrigPrice * (1 - bidBelowPctNum / 100);
      const mutatedToken = token;
      mutatedToken.price = bidPrice;
      mutatedTokens.push(mutatedToken);
    }
    setMutatedData(mutatedTokens);
  }, [bidBelowPct]);
  useEffect(() => {
    return () => {
      setSelectedCollectionTab(tabs[0]);
    };
  }, []);
  const onTabChange = (tab: string) => {
    setSelectedCollectionTab(tab);
  };

  const onClickNFT = (token: ERC721TokenCartItem) => {
    toggleNFTSelection(token);
  };

  const collectionAddress = collection.address;
  const collectionCreator = collection.owner;

  // const isCollSupported = collection?.isSupported ?? false;
  // if (!isCollSupported) {
  //   return (
  //     <CenteredContent>
  //       <div className="flex flex-col items-center space-y-2">
  //         {collection?.metadata?.profileImage ? (
  //           <EZImage src={collection.metadata.profileImage} className="h-40 w-40 rounded-lg overflow-clip" />
  //         ) : null}
  //         <div className="text-3xl font-heading font-medium">
  //           {collection?.metadata?.name ?? 'This collection'} is not supported on Pixl
  //         </div>
  //         <div className="flex flex-col text-md">
  //           <span>Common reasons a collection is not supported:</span>
  //           <ul className="list-disc list-inside mt-2 mb-2">
  //             <li>Pixl offers a trusted and curated selection of NFTs</li>
  //             <li>Collection is not ERC-721</li>
  //             <li>Collection has low volumes</li>
  //             <li>Creator(s) rugged the project</li>
  //           </ul>
  //           <div className="flex items-center space-x-2">
  //             <div>If this is a mistake, let us know on</div>
  //             <ExternalLink href="https://discord.gg/pixlso">
  //               <FaDiscord className={twMerge('text-brand-discord cursor-pointer mt-1', iconButtonStyle)} />
  //             </ExternalLink>
  //           </div>
  //         </div>
  //       </div>
  //     </CenteredContent>
  //   );
  // }

  const totalVol = nFormatter(collection?.volume ?? 0);
  const floorPrice = nFormatter(collection?.floorPrice ?? 0);
  const numOwners = nFormatter(collection?.numOwners ?? 0);
  const numNfts = nFormatter(collection?.numNfts ?? 0);

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
    twitterFollowers: 0,
    discordFollowers: 0,
    tabs,
    onTabChange
  };
  const head = (
    <Head>
      <meta property="og:title" content={collection.metadata?.name} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`https://pixl.so/chain/${getNetworkName(collection?.chainId)}/collection/${
          collection?.slug || collection?.address
        }`}
      />
      <meta property="og:site_name" content="pixl.so" />
      <meta property="og:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="og:image:alt" content={collection.metadata?.description} />
      <meta property="og:description" content={collection.metadata?.description} />

      <meta name="theme-color" content="#000000" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pixlso" />
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

        <div ref={setRef} className="md:overflow-y-auto h-full scrollbar-hide">
          {(selectedCollectionTab === CollectionPageTabs.Bid.toString() ||
            selectedCollectionTab === CollectionPageTabs.Buy.toString()) && (
            <>
              {selectedCollectionTab === CollectionPageTabs.Bid.toString() && !isDesktop && (
                <AButton
                  primary
                  className="fixed sm:hidden border-0 text-base font-semibold bottom-18 left-5 right-5 rounded z-10 bg-neutral-200"
                  onClick={() => {
                    setCartType(CartType.CollectionBid);
                    if (isCollSelectable(collection as ERC721CollectionCartItem)) {
                      return toggleCollSelection(collection as ERC721CollectionCartItem);
                    }
                  }}
                >
                  {isCollSelected(collection as ERC721CollectionCartItem) ? (
                    <div className="flex items-center space-x-1">
                      <AiOutlineCheckCircle className={'h-4 w-4'} />
                      <div className="flex mt-1 justify-center">Collection Bid</div>
                    </div>
                  ) : (
                    <div className="flex mt-1 justify-center">Collection Bid</div>
                  )}
                </AButton>
              )}

              <div className="md:hidden flex justify-between pt-3.75 px-5">
                <MultiSwitch handleClick={setViewType} options={viewTypes} selectedOption={viewType} fullWidth />
              </div>

              <div className="flex md:flex-row flex-col">
                {(isDesktop || viewType === '1') && (
                  <div className={(twMerge('flex'), showCart ? 'w-full' : 'lg:w-2/3')}>
                    <div className={twMerge('mt-2.5 md:mt-5 px-5')}>
                      <div
                        className={twMerge(
                          'flex flex-1 justify-between items-start flex-wrap md:gap-2.5 xl:items-center'
                        )}
                      >
                        <div
                          className={twMerge(
                            'md:flex flex-1 md:flex-grow-0 w-full md:w-auto md:flex-auto text-sm items-center gap-2.5',
                            showCart && 'flex-wrap'
                          )}
                        >
                          <div
                            className={twMerge(
                              'flex md:mr-1',
                              cartType === CartType.CollectionBid
                                ? 'opacity-30 duration-300 pointer-events-none'
                                : 'duration-300'
                            )}
                          >
                            <CollectionNftSearchInput
                              inputClassName="dark:placeholder:!text-neutral-500 placeholder:!text-amber-600 min-w-300"
                              containerClassName={twMerge(tabItemBGColor, '!bg-zinc-300 dark:!bg-zinc-900')}
                              collectionAddress={collection.address}
                              expanded
                              collectionFloorPrice={floorPrice}
                              chainId={chainId}
                              customPlaceholder="Filter by tokenID"
                              customIcon={<FilterListIcon />}
                            />
                          </div>

                          <div className="flex space-x-2 text-sm items-center">
                            <TabSelector
                              className="my-0 mt-2.5"
                              value={numSweep}
                              customValue={customSweep}
                              setCustomValue={setCustomSweep}
                              setValue={setNumSweep}
                              tabItems={['5', '10', '20', '50']}
                              // showClear
                              showCustom
                            />
                            <Spacer />
                          </div>
                        </div>
                        <div
                          className={twMerge(
                            'flex md:flex-grow-0 items-center gap-5',
                            selectedCollectionTab === CollectionPageTabs.Bid.toString() && 'flex-1'
                          )}
                        >
                          <div className="flex flex-1 md:flex-grow-0 items-center gap-1.5">
                            {selectedCollectionTab === CollectionPageTabs.Bid.toString() && (
                              <div className="flex flex-1 md:flex-grow-0 text-sm items-center gap-2.5">
                                <p className="hidden w-max shrink-0 md:block text-sm font-medium text-black dark:text-white">
                                  {'Bid below price'}
                                </p>
                                <TabSelector
                                  value={bidBelowPct}
                                  setValue={setBidBelowPct}
                                  tabItems={['0', '1', '2', '5', '10']}
                                  suffix="%"
                                />
                                <p className="block w-max shrink-0 md:hidden text-sm font-medium text-black dark:text-white">
                                  {'Bid below price'}
                                </p>
                              </div>
                            )}
                            {selectedCollectionTab === CollectionPageTabs.Bid.toString() && isDesktop && (
                              <AButton
                                className={twMerge(
                                  'p-2.5 rounded-6 text-sm',
                                  tabItemBGColor,
                                  isCollSelected(collection as ERC721CollectionCartItem) &&
                                    'border border-gray-400 dark:border-neutral-700'
                                )}
                                onClick={() => {
                                  setCartType(CartType.CollectionBid);
                                  if (isCollSelectable(collection as ERC721CollectionCartItem)) {
                                    return toggleCollSelection(collection as ERC721CollectionCartItem);
                                  }
                                }}
                              >
                                <div className="flex items-center space-x-2.5">
                                  {isCollSelected(collection as ERC721CollectionCartItem) && (
                                    <AiOutlineCheckCircle className={'h-3.75 w-3.75'} />
                                  )}
                                  <ETHCoinOutline className={'h-3.75 w-3.75'} />
                                  <div className="flex leading-4">Bid Entire Collection</div>
                                </div>
                              </AButton>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <TokenGrid
                      key={collectionAddress}
                      collectionCreator={collectionCreator}
                      avatarUrl={collection.metadata.profileImage || collection.metadata.bannerImage}
                      collectionFloorPrice={floorPrice}
                      listMode={listMode}
                      className={twMerge(
                        'px-5 py-3.75 md:py-5 min-h-150',
                        cartType === CartType.CollectionBid
                          ? 'opacity-30 duration-300 pointer-events-none'
                          : 'duration-300'
                      )} // this min-height is to prevent the grid from collapsing when there are no items so filter menus can still render
                      onClick={onClickNFT}
                      isSelectable={isNFTSelectable}
                      isSelected={isNFTSelected}
                      data={mutatedData}
                      hasNextPage={listingsHasNextPage}
                      onFetchMore={() => fetchListings(true)}
                      isError={!!listingsError}
                      isLoading={!!listingsIsLoading}
                    />
                  </div>
                )}

                <div
                  className={twMerge(
                    'transition-width duration-100',
                    showCart ? 'w-0' : 'flex md:w-1/3',
                    viewType === '2' ? 'block' : 'hidden lg:block'
                  )}
                >
                  <CollectionItemsPageSidebar
                    key={collectionAddress}
                    collectionChainId={chainId}
                    collectionAddress={collection.address}
                    collectionImage={collection.metadata.profileImage}
                    collectionSlug={collection.slug}
                  />
                </div>
              </div>
              <AvFooter />
            </>
          )}

          {selectedCollectionTab === CollectionPageTabs.LiveBids && (
            <CollectionManualBidList
              key={collectionAddress}
              collectionAddress={collection.address}
              collectionChainId={chainId}
              collectionSlug={collection.slug}
            />
          )}

          {selectedCollectionTab === CollectionPageTabs.Analytics && (
            <CollectionCharts
              key={collectionAddress}
              collectionAddress={collection.address}
              collectionSlug={collection.slug}
              collectionChainId={chainId}
              collectionImage={collection.metadata.profileImage}
              collectionName={collection.metadata.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=300');
  const chain = context.query.chain as string;
  const slug = context.query.name as string;
  const chainId = getNetwork(chain);
  const collDataPromise = apiGet(`/collections/${chainId}:${slug}`);
  const [collData] = await Promise.all([collDataPromise]);

  return {
    props: {
      collection: collData.result ?? null,
      error: collData.error ?? null
    }
  };
}

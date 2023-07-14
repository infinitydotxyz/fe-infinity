import { ChainId, Collection, CollectionAttributes, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GiBroom } from 'react-icons/gi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { MdClose } from 'react-icons/md';
import { AButton } from 'src/components/astra/astra-button';
import { APriceFilter } from 'src/components/astra/astra-price-filter';
import { ASortButton } from 'src/components/astra/astra-sort-button';
import { AStatusFilterButton } from 'src/components/astra/astra-status-button';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { CollectionCharts } from 'src/components/collection/collection-charts';
import { CollectionItemsPageSidebar } from 'src/components/collection/collection-items-page-sidebar';
import { CollectionManualBidList } from 'src/components/collection/collection-manual-bid-list';
import { CollectionOrderList } from 'src/components/collection/collection-orders-list';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { Spacer, TextInputBox } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { StatusIcon } from 'src/components/common/status-icon';
import { useCollectionListingsFetcher } from 'src/hooks/api/useTokenFetcher';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { CollectionPageTabs, apiGet, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem, TokensFilter } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  hoverColor,
  hoverColorBrandText,
  iconButtonStyle,
  secondaryTextColor,
  selectedColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

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

  const [filter, setFilter] = useState<TokensFilter>({});
  const chainId = collection.chainId as ChainId;
  const { setRef } = useScrollInfo();

  // const { data, error, hasNextPage, isLoading, fetch } = useCollectionTokenFetcher(collection.address, chainId, filter);

  const {
    data: listings,
    error: listingsError,
    hasNextPage: listingsHasNextPage,
    isLoading: listingsIsLoading,
    fetch: fetchListings
  } = useCollectionListingsFetcher(collection.address, chainId);

  const [mutatedData, setMutatedData] = useState<ERC721TokenCartItem[]>(listings);

  const tabs = [
    CollectionPageTabs.Buy.toString(),
    CollectionPageTabs.LiveBids.toString(),
    CollectionPageTabs.Analytics.toString()
  ];

  const { cartType, setCartType } = useCartContext();
  const [numSweep, setNumSweep] = useState('');
  const [customSweep, setCustomSweep] = useState('');
  const [bidBelowPct, setBidBelowPct] = useState('');
  const { showCart } = useAppContext();
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);

  const MAX_NUM_SWEEP_ITEMS = 50;

  useEffect(() => {
    if (selectedCollectionTab === CollectionPageTabs.Buy.toString()) {
      fetchListings(false);

      const interval = setInterval(() => {
        fetchListings(false);
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [collection.address]);

  // useEffect(() => {
  //   if (
  //     selectedCollectionTab === CollectionPageTabs.Intent.toString() ||
  //     selectedCollectionTab === CollectionPageTabs.Bid.toString()
  //   ) {
  //     setMutatedData(data);
  //   } else if (selectedCollectionTab === CollectionPageTabs.Buy.toString()) {
  //     setMutatedData(listings);
  //   }
  // }, [data, listings]);

  useEffect(() => {
    if (selectedCollectionTab === CollectionPageTabs.Buy.toString()) {
      setMutatedData(listings);
    }
  }, [listings]);

  useEffect(() => {
    if (selectedCollectionTab === CollectionPageTabs.Intent.toString()) {
      delete filter.orderType;
      delete filter.source;
      filter.sort = 'lowestPrice';
      setFilter({
        ...filter
      });
    } else if (selectedCollectionTab === CollectionPageTabs.Bid.toString()) {
      const newFilter = { ...filter };
      newFilter.sort = 'tokenIdNumeric';
      setFilter(newFilter);
    } else if (selectedCollectionTab === CollectionPageTabs.Buy.toString()) {
      fetchListings(false);
    }
  }, [selectedCollectionTab]);

  // useEffect(() => {
  //   if (filter.traitTypes?.length) {
  //     const traits = [];
  //     for (let i = 0; i < filter.traitTypes.length; i++) {
  //       const traitType = filter.traitTypes?.[i];
  //       const traitValues = filter.traitValues?.[i]?.split('|') ?? [];
  //       for (const traitValue of traitValues) {
  //         traits.push(`${traitType}: ${traitValue}`);
  //       }
  //     }
  //     setSelectedTraits(traits);
  //   } else {
  //     setSelectedTraits([]);
  //   }

  //   // refetch data
  //   fetch(false);
  // }, [filter, collection.address]);

  useEffect(() => {
    if (collSelection.length > 0) {
      setCartType(CartType.CollectionBid);
    } else if (selectedCollectionTab === CollectionPageTabs.Intent.toString()) {
      setCartType(CartType.TokenBidIntent);
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

  // useEffect(() => {
  //   const bidBelowPctNum = parseFloat(bidBelowPct);
  //   const mutatedTokens = [];
  //   for (const token of data) {
  //     const tokenOrigPrice = token?.orderSnippet?.listing?.orderItem?.startPriceEth
  //       ? token?.orderSnippet?.listing?.orderItem?.startPriceEth
  //       : 0;

  //     const bidPrice = tokenOrigPrice * (1 - bidBelowPctNum / 100);

  //     const mutatedToken = token;
  //     mutatedToken.price = bidPrice;
  //     mutatedTokens.push(mutatedToken);
  //   }
  //   setMutatedData(mutatedTokens);
  // }, [bidBelowPct]);

  const onTabChange = (tab: string) => {
    setSelectedCollectionTab(tab);
  };

  const onClickNFT = (token: ERC721TokenCartItem) => {
    toggleNFTSelection(token);
  };

  const collectionAddress = collection.address;

  // const isCollSupported = collection?.isSupported ?? false;
  // if (!isCollSupported) {
  //   return (
  //     <CenteredContent>
  //       <div className="flex flex-col items-center space-y-2">
  //         {collection?.metadata?.profileImage ? (
  //           <EZImage src={collection.metadata.profileImage} className="h-40 w-40 rounded-lg overflow-clip" />
  //         ) : null}
  //         <div className="text-3xl font-heading font-medium">
  //           {collection?.metadata?.name ?? 'This collection'} is not supported on Pixelpack
  //         </div>
  //         <div className="flex flex-col text-md">
  //           <span>Common reasons a collection is not supported:</span>
  //           <ul className="list-disc list-inside mt-2 mb-2">
  //             <li>Pixelpack offers a trusted and curated selection of NFTs</li>
  //             <li>Collection is not ERC-721</li>
  //             <li>Collection has low volumes</li>
  //             <li>Creator(s) rugged the project</li>
  //           </ul>
  //           <div className="flex items-center space-x-2">
  //             <div>If this is a mistake, let us know on</div>
  //             <ExternalLink href="https://discord.gg/pixelpackio">
  //               <FaDiscord className={twMerge('text-brand-discord cursor-pointer mt-1', iconButtonStyle)} />
  //             </ExternalLink>
  //           </div>
  //         </div>
  //       </div>
  //     </CenteredContent>
  //   );
  // }

  const collectionCreator = collection.owner;

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
      <meta property="og:url" content={`https://pixelpack.io/collection/${collection?.slug}`} />
      <meta property="og:site_name" content="pixelpack.io" />
      <meta property="og:image" content={collection.metadata?.bannerImage || collection.metadata?.profileImage} />
      <meta property="og:image:alt" content={collection.metadata?.description} />
      <meta property="og:description" content={collection.metadata?.description} />

      <meta name="theme-color" content="#000000" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@pixelpackio" />
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
          {(selectedCollectionTab === CollectionPageTabs.Intent.toString() ||
            selectedCollectionTab === CollectionPageTabs.Bid.toString() ||
            selectedCollectionTab === CollectionPageTabs.Buy.toString()) && (
            <div className={twMerge('mt-2 px-4')}>
              <div className={twMerge('flex text-sm')}>
                <div
                  className={twMerge(
                    'flex mr-1',
                    cartType === CartType.CollectionBid ? 'opacity-30 duration-300 pointer-events-none' : 'duration-300'
                  )}
                >
                  <CollectionNftSearchInput
                    collectionAddress={collection.address}
                    expanded
                    collectionFloorPrice={floorPrice}
                    chainId={chainId}
                  />
                </div>

                <div className="flex space-x-2 text-sm">
                  {(selectedCollectionTab === CollectionPageTabs.Buy ||
                    selectedCollectionTab === CollectionPageTabs.Bid.toString()) && (
                    <AButton
                      primary
                      className="px-5 py-1 text-sm"
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
                          <div>Collection Bid</div>
                        </div>
                      ) : (
                        'Collection Bid'
                      )}
                    </AButton>
                  )}

                  <div
                    className={twMerge(
                      'flex flex-row rounded-lg border cursor-pointer',
                      borderColor,
                      cartType === CartType.CollectionBid || cartType === CartType.CollectionBidIntent
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

                  {selectedCollectionTab === CollectionPageTabs.Intent && (
                    <div
                      className={twMerge(
                        'flex space-x-1',
                        cartType === CartType.CollectionBid || cartType === CartType.CollectionBidIntent
                          ? 'opacity-30 duration-300 pointer-events-none'
                          : 'duration-300'
                      )}
                    >
                      <ASortButton filter={filter} setFilter={setFilter} />
                      <AStatusFilterButton filter={filter} setFilter={setFilter} />
                      <APriceFilter filter={filter} setFilter={setFilter} />
                      {/* <ATraitFilter
                        collectionAddress={collection.address}
                        filter={filter}
                        setFilter={setFilter}
                        collectionAttributes={props.collectionAttributes}
                      /> */}
                    </div>
                  )}

                  {/* {selectedCollectionTab === CollectionPageTabs.Bid && (
                    <div
                      className={twMerge(
                        'flex space-x-1',
                        cartType === CartType.CollectionBid || cartType === CartType.CollectionBidIntent
                          ? 'opacity-30 duration-300 pointer-events-none'
                          : 'duration-300'
                      )}
                    >
                      <ATraitFilter
                        collectionAddress={collection.address}
                        filter={filter}
                        setFilter={setFilter}
                        collectionAttributes={props.collectionAttributes}
                      />
                    </div>
                  )} */}
                  <Spacer />
                  <StatusIcon status="pending-indefinite" label="Live" />
                </div>
              </div>

              {selectedCollectionTab === CollectionPageTabs.Intent.toString() && (
                <div className="flex mt-2 text-sm">
                  <div
                    className={twMerge(
                      'flex flex-row rounded-lg border cursor-pointer',
                      borderColor,
                      cartType === CartType.CollectionBid || cartType === CartType.CollectionBidIntent
                        ? 'opacity-30 duration-300 pointer-events-none'
                        : 'duration-300'
                    )}
                  >
                    <div className={twMerge('flex items-center border-r-[1px] px-6 cursor-default', borderColor)}>
                      Bid below price:
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        bidBelowPct === '1' && selectedColor
                      )}
                      onClick={() => {
                        bidBelowPct === '1' ? setBidBelowPct('') : setBidBelowPct('1');
                      }}
                    >
                      1%
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        bidBelowPct === '2' && selectedColor
                      )}
                      onClick={() => {
                        bidBelowPct === '2' ? setBidBelowPct('') : setBidBelowPct('2');
                      }}
                    >
                      2%
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        bidBelowPct === '5' && selectedColor
                      )}
                      onClick={() => {
                        bidBelowPct === '5' ? setBidBelowPct('') : setBidBelowPct('5');
                      }}
                    >
                      5%
                    </div>
                    <div
                      className={twMerge(
                        'px-4 h-full flex items-center border-r-[1px]',
                        borderColor,
                        hoverColor,
                        bidBelowPct === '10' && selectedColor
                      )}
                      onClick={() => {
                        bidBelowPct === '10' ? setBidBelowPct('') : setBidBelowPct('10');
                      }}
                    >
                      10%
                    </div>
                    <div className="p-3 h-full flex items-center">
                      <TextInputBox
                        addPctSymbol={true}
                        autoFocus={false}
                        inputClassName="text-sm"
                        className="border-0 w-20 p-0 text-sm"
                        type="number"
                        placeholder="Custom"
                        value={String(bidBelowPct)}
                        onChange={(value) => {
                          let valueNum = parseFloat(value);
                          if (valueNum > 100) {
                            valueNum = 100;
                          }
                          setBidBelowPct(valueNum.toString());
                        }}
                      />
                    </div>
                  </div>

                  <div className={twMerge('flex ml-2 items-center space-x-1', secondaryTextColor)}>
                    <HiOutlineLightBulb className="w-6 h-6" />
                    <div className="mt-1">Matched bids are automatically sniped on your behalf.</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTraits.length > 0 && (
            <div className="flex px-4 mt-2 space-x-2">
              {selectedTraits.map((trait) => {
                return (
                  <div
                    key={trait}
                    className={twMerge('flex items-center rounded-lg border p-2 text-sm font-medium', borderColor)}
                  >
                    {trait}
                    <div className="ml-2">
                      <MdClose
                        className={twMerge('h-4 w-4 cursor-pointer', hoverColorBrandText)}
                        onClick={() => {
                          setSelectedTraits(selectedTraits.filter((t) => t !== trait));
                          // update filter
                          const newFilter = { ...filter };
                          const traitType = trait.split(':')[0];
                          const traitValue = trait.split(':')[1].trim();
                          // remove from filter
                          newFilter.traitTypes = newFilter.traitTypes?.filter((t) => t !== traitType);
                          newFilter.traitValues = newFilter.traitValues?.filter((t) => t !== traitValue);
                          setFilter(newFilter);
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(selectedCollectionTab === CollectionPageTabs.Intent.toString() ||
            selectedCollectionTab === CollectionPageTabs.Bid.toString() ||
            selectedCollectionTab === CollectionPageTabs.Buy.toString()) && (
            <div className="flex flex-row">
              <div className={(twMerge('flex'), showCart ? 'w-full' : 'w-2/3')}>
                <TokenGrid
                  key={collectionAddress}
                  collectionCreator={collectionCreator}
                  collectionFloorPrice={floorPrice}
                  listMode={listMode}
                  className={twMerge(
                    'px-4 py-4 min-h-[600px]',
                    cartType === CartType.CollectionBid || cartType === CartType.CollectionBidIntent
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

              <div className={`${showCart ? 'w-0' : 'flex w-1/3'} transition-width duration-100`}>
                <CollectionItemsPageSidebar
                  key={collectionAddress}
                  collectionChainId={collection.chainId as ChainId}
                  collectionAddress={collection.address}
                  collectionImage={collection.metadata.profileImage}
                />
              </div>
            </div>
          )}

          {selectedCollectionTab === CollectionPageTabs.LiveBids && (
            <CollectionManualBidList
              key={collectionAddress}
              collectionAddress={collection.address}
              collectionChainId={collection.chainId as ChainId}
            />
          )}

          {selectedCollectionTab === CollectionPageTabs.LiveIntents && (
            <CollectionOrderList
              key={collectionAddress}
              collectionAddress={collection.address}
              collectionChainId={collection.chainId as ChainId}
            />
          )}

          {selectedCollectionTab === CollectionPageTabs.Analytics && (
            <CollectionCharts
              key={collectionAddress}
              collectionAddress={collection.address}
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

  const id = context.query.name as string;
  const collDataPromise = apiGet(`/collections/${id}`);
  const [collData] = await Promise.all([collDataPromise]);

  return {
    props: {
      collection: collData.result ?? null,
      error: collData.error ?? null
    }
  };
}

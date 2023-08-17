import { ChainId, Collection, CollectionAttributes, CollectionStats } from '@infinityxyz/lib-frontend/types/core';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { GiBroom } from 'react-icons/gi';
import { AButton } from 'src/components/astra/astra-button';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { CollectionCharts } from 'src/components/collection/collection-charts';
import { CollectionItemsPageSidebar } from 'src/components/collection/collection-items-page-sidebar';
import { CollectionManualBidList } from 'src/components/collection/collection-manual-bid-list';
import { CollectionPageHeader, CollectionPageHeaderProps } from 'src/components/collection/collection-page-header';
import { Spacer, TextInputBox, ToggleTab } from 'src/components/common';
import { CollectionNftSearchInput } from 'src/components/common/search/collection-nft-search-input';
import { StatusIcon } from 'src/components/common/status-icon';
import { useCollectionListingsFetcher } from 'src/hooks/api/useTokenFetcher';
import useScreenSize from 'src/hooks/useScreenSize';
import { useScrollInfo } from 'src/hooks/useScrollHook';
import { CollectionPageTabs, apiGet, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721CollectionCartItem, ERC721TokenCartItem } from 'src/utils/types';
import { borderColor, brandTextColor, hoverColor, iconButtonStyle, selectedColor } from 'src/utils/ui-constants';
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

  const chainId = collection.chainId as ChainId;
  const { setRef } = useScrollInfo();
  const { isDesktop } = useScreenSize();

  const {
    data: listings,
    error: listingsError,
    hasNextPage: listingsHasNextPage,
    isLoading: listingsIsLoading,
    fetch: fetchListings
  } = useCollectionListingsFetcher(collection.address, chainId);

  // deep copy original listings to a new array
  const originalData = listings.map((x) => Object.assign({}, x));
  const [mutatedData, setMutatedData] = useState<ERC721TokenCartItem[]>(listings);

  const tabs = [
    CollectionPageTabs.Buy.toString(),
    CollectionPageTabs.Bid.toString(),
    CollectionPageTabs.LiveBids.toString(),
    CollectionPageTabs.Analytics.toString()
  ];

  const types = ['Collections', 'Graph'];

  const { cartType, setCartType } = useCartContext();
  const [numSweep, setNumSweep] = useState('');
  const [bidBelowPct, setBidBelowPct] = useState('');
  const [customSweep, setCustomSweep] = useState('');
  const [type, setType] = useState(types[0]);
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
      <meta property="og:url" content={`https://pixl.so/collection/${collection?.slug}`} />
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

        <div ref={setRef} className="overflow-y-auto scrollbar-hide">
          {(selectedCollectionTab === CollectionPageTabs.Bid.toString() ||
            selectedCollectionTab === CollectionPageTabs.Buy.toString()) && (
            <div className={twMerge('mt-2 px-4')}>
              <div className={twMerge('md:flex text-sm')}>
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
                  {selectedCollectionTab === CollectionPageTabs.Bid.toString() && isDesktop && (
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
                          <div className="flex mt-1">Collection Bid</div>
                        </div>
                      ) : (
                        <div className="flex mt-1">Collection Bid</div>
                      )}
                    </AButton>
                  )}

                  <div
                    className={twMerge(
                      'flex flex-row rounded-lg border md:m-0 my-2 h-10 cursor-pointer',
                      borderColor,
                      cartType === CartType.CollectionBid
                        ? 'opacity-30 duration-300 pointer-events-none'
                        : 'duration-300'
                    )}
                  >
                    {isDesktop && (
                      <div className={twMerge('flex items-center border-r-[1px] px-6 cursor-default', borderColor)}>
                        <GiBroom className={twMerge(iconButtonStyle, brandTextColor)} />
                      </div>
                    )}
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
                        inputClassName="text-sm font-body"
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
                  <Spacer />
                  {isDesktop && <StatusIcon status="pending-indefinite" label="Live" />}
                </div>
              </div>

              {selectedCollectionTab === CollectionPageTabs.Bid.toString() && (
                <>
                  {!isDesktop && <div className="text-sm">Bid below price (%):</div>}
                  <div className="flex md:mt-2 mb-2 text-sm">
                    <div
                      className={twMerge(
                        'flex flex-row rounded-lg border cursor-pointer',
                        borderColor,
                        cartType === CartType.CollectionBid
                          ? 'opacity-30 duration-300 pointer-events-none'
                          : 'duration-300'
                      )}
                    >
                      {isDesktop && (
                        <div className={twMerge('flex items-center border-r-[1px] px-6 cursor-default', borderColor)}>
                          Bid below price:
                        </div>
                      )}
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
                        1<span className="md:block hidden">%</span>
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
                        2<span className="md:block hidden">%</span>
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
                        5<span className="md:block hidden">%</span>
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
                        10<span className="md:block hidden">%</span>
                      </div>
                      <div className="p-3 h-full flex items-center">
                        <TextInputBox
                          addPctSymbol={true}
                          autoFocus={false}
                          inputClassName="text-sm font-body"
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
                  </div>
                </>
              )}
            </div>
          )}

          {(selectedCollectionTab === CollectionPageTabs.Bid.toString() ||
            selectedCollectionTab === CollectionPageTabs.Buy.toString()) && (
            <>
              {selectedCollectionTab === CollectionPageTabs.Bid.toString() && !isDesktop && (
                <AButton
                  primary
                  className="absolute bottom-2 left-20 right-4 z-50 bg-black"
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
              {!isDesktop && (
                <div className="flex justify-between">
                  <ToggleTab
                    className="text-sm ml-4"
                    options={types}
                    defaultOption={types[0]}
                    onChange={setType}
                    border
                    small
                  />
                </div>
              )}
              <div className="flex md:flex-row flex-col">
                {(isDesktop || type === 'Collections') && (
                  <div className={(twMerge('flex'), showCart ? 'w-full' : 'md:w-2/3')}>
                    <TokenGrid
                      key={collectionAddress}
                      collectionCreator={collectionCreator}
                      collectionFloorPrice={floorPrice}
                      listMode={listMode}
                      className={twMerge(
                        'px-4 py-4 min-h-[600px]',
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

                {(isDesktop || type === 'Graph') && (
                  <div className={`${showCart ? 'w-0' : 'flex md:w-1/3'} transition-width duration-100`}>
                    <CollectionItemsPageSidebar
                      key={collectionAddress}
                      collectionChainId={collection.chainId as ChainId}
                      collectionAddress={collection.address}
                      collectionImage={collection.metadata.profileImage}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {selectedCollectionTab === CollectionPageTabs.LiveBids && (
            <CollectionManualBidList
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

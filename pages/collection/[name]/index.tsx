import {
  BaseCollection,
  ChainId,
  Collection,
  CollectionStats,
  CuratedCollection,
  ERC721CardData
} from '@infinityxyz/lib-frontend/types/core';
import { CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto/stats';
import { useRouter } from 'next/router';
import NotFound404Page from 'pages/not-found-404';
import { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { BsCheck } from 'react-icons/bs';
import { AvatarImage } from 'src/components/collection/avatar-image';
import { CollectionActivityTab } from 'src/components/collection/collection-activity-tab';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { StatsChips } from 'src/components/collection/stats-chips';
import { Button, EthPrice, Heading, PageBox, Spinner, SVG, ToggleTab, useToggleTab } from 'src/components/common';
import { FeesAprStats, FeesAccruedStats } from 'src/components/curation/statistics';
import { VoteModal } from 'src/components/curation/vote-modal';
import { VoteProgressBar } from 'src/components/curation/vote-progress-bar';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { OrderbookContainer } from 'src/components/market/orderbook-list';
import { ellipsisAddress, getChainScannerBase, nFormatter, PLACEHOLDER_IMAGE } from 'src/utils';
import { useFetch } from 'src/utils/apiUtils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { useSWRConfig } from 'swr';
import { twMerge } from 'tailwind-merge';

const CollectionPage = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const { checkSignedIn, chainId } = useAppContext();
  const { addCartItem, removeCartItem, ordersInCart, cartItems, addOrderToCart, updateOrders } = useOrderContext();
  const [isBuyClicked, setIsBuyClicked] = useState(false);
  const { options, onChange, selected } = useToggleTab(
    ['NFTs', 'Orders', 'Activity'],
    (router?.query?.tab as string) || 'NFTs'
  );
  const {
    query: { name }
  } = router;
  const { mutate } = useSWRConfig();
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);

  useEffect(() => {
    if (isBuyClicked === true) {
      setIsBuyClicked(false);
      addOrderToCart();
    }
  }, [isBuyClicked]);

  // useEffect(() => void fetchUserCurated(), [userReady]);
  const path = `/collections/${name}`;
  const { result: collection, isLoading, error } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: currentStats } = useFetch<CollectionStatsDto>(name ? `${path}/stats/current` : '', {
    chainId
  });
  const { result: allTimeStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path + '/stats?offset=0&limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=all'
      : '',
    { chainId }
  );
  const firstAllTimeStats = allTimeStats?.data[0]; // first row = latest daily stats

  const createdBy = collection?.deployer ?? collection?.owner ?? '';

  const { result: userCurated } = useFetch<CuratedCollection>(
    user?.address ? `${path}/curated/${user.address}` : null,
    { apiParams: { requiresAuth: true } }
  );

  const isAlreadyAdded = (data: ERC721CardData | undefined) => {
    // check if this item was already added to cartItems or order.
    const found1 =
      cartItems.find((item) => item.collectionAddress === data?.address && item.tokenId === data.tokenId) !== undefined;
    let found2 = false;
    for (const order of ordersInCart) {
      const foundInOrder = order.cartItems.find(
        (item) => item.collectionAddress === data?.address && item.tokenId === data.tokenId
      );
      if (foundInOrder) {
        found2 = true;
        break;
      }
    }
    return found1 || found2;
  };

  // find & remove this item in cartItems & all orders' cartItems:
  const findAndRemove = (data: ERC721CardData | undefined) => {
    const foundItemIdx = cartItems.findIndex(
      (item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId
    );
    removeCartItem(cartItems[foundItemIdx]);
    ordersInCart.forEach((order) => {
      order.cartItems = order.cartItems.filter(
        (item) => !(item.collectionAddress === data?.address && item.tokenId === data?.tokenId)
      );
    });
    updateOrders(ordersInCart.filter((order) => order.cartItems.length > 0));
  };

  if (error) {
    // failed to load collection (collection not indexed?)
    return <NotFound404Page collectionSlug={name?.toString()} />;
  }

  if (!collection) {
    return (
      <PageBox showTitle={false} title={'Collection'}>
        {error ? <div className="flex flex-col mt-10">Unable to load this collection.</div> : null}
      </PageBox>
    );
  }

  return (
    <PageBox showTitle={false} title={collection?.metadata?.name ?? ''}>
      <div className="flex flex-col mt-10">
        <span>
          {collection ? (
            <AvatarImage url={collection?.metadata.profileImage} className="mb-2 rounded-[50%]" />
          ) : (
            <AvatarImage url={PLACEHOLDER_IMAGE} className="mb-2 border-gray-200 border-2 rounded-[50%]" />
          )}

          <div className="flex gap-3 items-center">
            <div className="text-6xl">
              {collection?.metadata?.name ? (
                collection?.metadata?.name
              ) : (
                <div className="relative">
                  &nbsp;
                  <Spinner className="absolute top-10" />
                </div>
              )}
            </div>
            {collection?.hasBlueCheck ? <SVG.blueCheck className={twMerge(iconButtonStyle, 'mt-3')} /> : null}
          </div>
        </span>

        <main>
          <div className="text-secondary mt-6 mb-6 font-heading">
            {collection ? (
              <>
                {createdBy && (
                  <>
                    <span>Created by </span>
                    <button
                      onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection?.owner)}
                      className="mr-12"
                    >
                      {ellipsisAddress(createdBy)}
                    </button>
                  </>
                )}
                <span className="font-heading">Collection address </span>
                <button onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection?.address)}>
                  {ellipsisAddress(collection?.address ?? '')}
                </button>
              </>
            ) : (
              <>
                <span>&nbsp;</span>
              </>
            )}
          </div>

          <StatsChips collection={collection} currentStatsData={currentStats || firstAllTimeStats} />

          {isLoading ? (
            <div className="mt-6">
              <LoadingDescription />
            </div>
          ) : (
            <div className="text-secondary mt-12 md:w-2/3">{collection?.metadata.description ?? ''}</div>
          )}

          {collection?.metadata.benefits && (
            <div className="mt-7 md:w-2/3">
              <div className="font-medium">Ownership includes</div>

              <div className="flex space-x-8 mt-3 font-normal">
                {collection?.metadata.benefits?.slice(0, 3).map((benefit) => {
                  const benefitStr = benefit.slice(0, 300);
                  return (
                    <div className="flex items-center text-secondary">
                      <BsCheck className="text-2xl mr-2 text-black" />
                      {benefitStr}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {collection?.metadata.partnerships && (
            <div className="mt-7 md:w-2/3">
              <div className="font-medium">Partnerships</div>

              <div className="flex space-x-12 mt-3 ml-2 font-normal">
                {collection?.metadata.partnerships?.slice(0, 3).map((partnership) => {
                  const partnershipStr = partnership?.name.slice(0, 100);
                  return (
                    <div
                      className="flex items-center text-secondary hover:text-black cursor-pointer"
                      onClick={() => {
                        window.open(partnership.link);
                      }}
                    >
                      {partnershipStr}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <table className="mt-8">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left font-medium font-heading">Items</th>
                <th className="text-left font-medium font-heading">Owned by</th>
                <th className="text-left font-medium font-heading">Floor price</th>
                <th className="text-left font-medium font-heading">Volume traded</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold font-heading text-2xl">
                <td className="pr-20">{nFormatter(firstAllTimeStats?.numNfts) ?? '—'}</td>
                <td className="pr-20">{nFormatter(firstAllTimeStats?.numOwners) ?? '—'}</td>
                <td className="pr-20">
                  {firstAllTimeStats?.floorPrice ? (
                    <EthPrice
                      label={`${nFormatter(currentStats?.floorPrice ?? firstAllTimeStats?.floorPrice)}`}
                      labelClassName="font-bold"
                    />
                  ) : (
                    '—'
                  )}
                </td>
                <td className="pr-20">
                  {firstAllTimeStats?.volume ? (
                    <EthPrice label={`${nFormatter(firstAllTimeStats?.volume)}`} labelClassName="font-bold" />
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <section className="mt-8 space-y-4 md:w-1/2">
            <Heading as="h2" className="font-body text-4xl">
              Curate collection
            </Heading>
            <FeesAprStats value={userCurated?.feesAPR || 0} className="mr-2" />
            <FeesAccruedStats value={userCurated?.fees || 0} />

            <div className="flex flex-row space-x-2 relative">
              <VoteProgressBar votes={userCurated?.votes || 0} totalVotes={collection.numCuratorVotes || 0} />
              <Button onClick={() => checkSignedIn() && setIsStakeModalOpen(true)}>Vote</Button>
            </div>
            <VoteModal
              collection={collection}
              curated={userCurated}
              isOpen={isStakeModalOpen}
              onClose={() => setIsStakeModalOpen(false)}
              onVote={async (votes) => {
                // update local collection cache with latest amount of total votes
                await mutate(path, {
                  ...collection,
                  numCuratorVotes: (collection.numCuratorVotes || 0) + votes
                } as Collection);

                // reload user votes and estimates from API
                await mutate(`${path}/curated/${user?.address}`);
              }}
            />
          </section>

          <ToggleTab
            className="mt-12 font-heading pointer-events-auto"
            tabWidth="150px"
            options={options}
            selected={selected}
            onChange={onChange}
          />

          <div className="mt-6 min-h-[1024px]">
            {selected === 'NFTs' && collection && (
              <GalleryBox
                pageId="COLLECTION"
                getEndpoint={`/collections/${collection?.chainId}:${collection?.address}/nfts`}
                collection={collection}
                cardProps={{
                  cardActions: [
                    {
                      label: (data) => {
                        const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? '';
                        if (price) {
                          return (
                            <div className="flex justify-center">
                              <span className="mr-4 font-normal">Buy</span>
                              <EthPrice label={`${price}`} />
                            </div>
                          );
                        }
                        if (isAlreadyAdded(data)) {
                          return <div className="font-normal">✓ Added</div>;
                        }
                        return <div className="font-normal">Add to order</div>;
                      },
                      onClick: (ev, data) => {
                        if (!checkSignedIn()) {
                          return;
                        }
                        if (isAlreadyAdded(data)) {
                          findAndRemove(data);
                          return;
                        }
                        const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? '';
                        addCartItem({
                          chainId: data?.chainId as ChainId,
                          collectionName: data?.collectionName ?? '',
                          collectionAddress: data?.tokenAddress ?? '',
                          collectionImage: data?.cardImage ?? data?.image ?? '',
                          collectionSlug: data?.collectionSlug ?? '',
                          tokenImage: data?.image ?? '',
                          tokenName: data?.name ?? '',
                          tokenId: data?.tokenId ?? '-1',
                          isSellOrder: false,
                          attributes: data?.attributes ?? []
                        });
                        if (price) {
                          setIsBuyClicked(true); // to add to cart as a Buy order. (see: useEffect)
                        }
                      }
                    }
                  ]
                }}
              />
            )}

            {selected === 'Orders' && (
              <OrderbookContainer collectionId={collection?.address} className="mt-[-70px] pointer-events-none" />
            )}

            {/* {currentTab === 1 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />} */}
            {selected === 'Activity' && <CollectionActivityTab collectionAddress={collection?.address ?? ''} />}

            {selected === '???' && (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
                <div className="lg:col-span-1 xl:col-span-2">
                  <CollectionFeed collectionAddress={collection?.address ?? ''} />
                </div>
                <div className="col-span-1">{collection && <CommunityRightPanel collection={collection} />}</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </PageBox>
  );
};

const LoadingDescription = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={120}
    viewBox="0 0 400 120"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="3" y="3" rx="12" ry="12" width="390" height="20" />
    <rect x="3" y="34" rx="12" ry="12" width="390" height="20" />
    <rect x="3" y="66" rx="12" ry="12" width="203" height="20" />
  </ContentLoader>
);

export default CollectionPage;

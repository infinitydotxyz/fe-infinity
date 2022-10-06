import {
  BaseCollection,
  ChainId,
  CollectionAttributes,
  CollectionStats,
  ERC721CardData
} from '@infinityxyz/lib-frontend/types/core';
import { CuratedCollectionDto } from '@infinityxyz/lib-frontend/types/dto/collections/curation/curated-collections.dto';
import { CollectionStatsDto } from '@infinityxyz/lib-frontend/types/dto/stats';
import { NULL_ADDRESS } from '@infinityxyz/lib-frontend/utils';
import { useRouter } from 'next/router';
import NotFound404Page from 'pages/not-found-404';
import { useEffect, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { BsCheck } from 'react-icons/bs';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { AvatarImage } from 'src/components/collection/avatar-image';
import { CollectionSalesTab } from 'src/components/collection/collection-activity-tab';
import { StatsChips } from 'src/components/collection/stats-chips';
import {
  Button,
  Chip,
  EthPrice,
  Heading,
  PageBox,
  Spinner,
  SVG,
  toastSuccess,
  ToggleTab,
  useToggleTab
} from 'src/components/common';
import { FeesAprStats, FeesAccruedStats } from 'src/components/curation/statistics';
import { VoteModal } from 'src/components/curation/vote-modal';
import { VoteProgressBar } from 'src/components/curation/vote-progress-bar';
import { CommunityFeed } from 'src/components/feed-list/community-feed';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { OrderbookContainer } from 'src/components/orderbook/orderbook-list';
import { useFetchSignedOBOrder } from 'src/hooks/api/useFetchSignedOBOrder';
import { ellipsisAddress, getChainScannerBase, nFormatter, standardCard } from 'src/utils';
import { useFetch } from 'src/utils/apiUtils';
import { useDrawerContext } from 'src/utils/context/DrawerContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import Linkify from '@amit.rajput/react-linkify';

const CollectionPage = () => {
  const { user, chainId, checkSignedIn } = useOnboardContext();

  const { fetchSignedOBOrder } = useFetchSignedOBOrder();
  const router = useRouter();
  const { addCartItem, removeCartItem, ordersInCart, cartItems, addOrderToCart, updateOrders } = useOrderContext();
  const [isBuyClicked, setIsBuyClicked] = useState(false);
  const toggleOptions = ['NFTs', 'Orders', 'Sales', 'Community'];
  const { options, onChange, selected } = useToggleTab(toggleOptions, (router?.query?.tab as string) || 'NFTs');
  const {
    query: { name }
  } = router;
  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const { fulfillDrawerParams } = useDrawerContext();

  useEffect(() => {
    if (isBuyClicked === true) {
      setIsBuyClicked(false);
      addOrderToCart();
    }
  }, [isBuyClicked]);

  const path = `/collections/${name}`;
  const { result: collection, isLoading, error } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: collectionAttributes } = useFetch<CollectionAttributes>(
    name ? `/collections/${name}/attributes` : '',
    {
      chainId: '1'
    }
  );

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

  const { result: userCurated } = useFetch<CuratedCollectionDto>(
    `${path}/curated/${chainId}:${user?.address ?? NULL_ADDRESS}`
  );

  const isAlreadyAdded = (data: ERC721CardData | undefined) => {
    // check if this item was already added to cartItems or order.
    const found1 =
      cartItems.find((item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId) !==
      undefined;
    let found2 = false;
    for (const order of ordersInCart) {
      const foundInOrder = order.cartItems.find(
        (item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId
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
    return (
      <NotFound404Page
        collectionSlug={name?.toString()}
        collectionAddress={collection?.address}
        chainId={collection?.chainId}
      />
    );
  }

  if (!collection) {
    return (
      <PageBox showTitle={false} title={'Collection'}>
        {error ? <div className="flex flex-col mt-10">Unable to load this collection.</div> : null}
      </PageBox>
    );
  }

  // not sure if this is the best regex, but could not find anything better
  const markdownRegex = /\[(.*?)\]\((.+?)\)/g;
  const isMarkdown = markdownRegex.test(collection.metadata?.description ?? '');

  let description = <div>{collection.metadata?.description ?? ''}</div>;

  if (isMarkdown) {
    description = (
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          a: ({ node, ...props }) => <a style={{ color: 'blue' }} {...props} />
        }}
      >
        {collection.metadata?.description ?? ''}
      </ReactMarkdown>
    );
  } else {
    // convert \n to '<br />'
    const escapedNewLineToLineBreakTag = (str: string) => {
      return str.split('\n').map((item, index) => {
        return index === 0 ? (
          <Linkify key={index + 1000}>{item}</Linkify>
        ) : (
          [<br key={index} />, <Linkify key={index + 2000}>{item}</Linkify>]
        );
      });
    };

    description = (
      // className colors all a tags with blue
      <div className="[&_a]:text-blue-700">{escapedNewLineToLineBreakTag(collection.metadata?.description ?? '')}</div>
    );
  }

  return (
    <PageBox showTitle={false} title={collection.metadata?.name ?? ''}>
      <div className="flex flex-col mt-10">
        <span>
          <AvatarImage url={collection.metadata?.profileImage} className="mb-2" />

          <div className="flex gap-3 items-center">
            <div className="text-6xl">
              {collection.metadata?.name ? (
                collection.metadata?.name
              ) : (
                <div className="relative">
                  &nbsp;
                  <Spinner className="absolute top-10" />
                </div>
              )}
            </div>
            {collection.hasBlueCheck ? <SVG.blueCheck className={twMerge(iconButtonStyle, 'mt-3')} /> : null}
          </div>
        </span>

        <main>
          <div className="flex flex-col space-x-0 xl:flex-row xl:space-x-10">
            <section className="w-fit">
              <div className="text-secondary mt-6 mb-6 font-heading">
                {collection ? (
                  <>
                    {createdBy && (
                      <>
                        <span>Created by </span>
                        <button
                          onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection.owner)}
                          className="mr-12"
                        >
                          {ellipsisAddress(createdBy)}
                        </button>
                      </>
                    )}
                    <span className="font-heading">Collection address </span>
                    <button
                      onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection.address)}
                      className="mr-8"
                    >
                      {ellipsisAddress(collection.address ?? '')}
                    </button>
                    {collection?.metadata?.links?.external && (
                      <Chip
                        content={<HiOutlineExternalLink className="text-md" />}
                        onClick={() => window.open(collection?.metadata?.links?.external)}
                        iconOnly={true}
                      />
                    )}
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
                <div className="text-secondary mt-12 md:w-2/3">{description}</div>
              )}
              {collection.metadata?.benefits && (
                <div className="mt-7 md:w-2/3">
                  <div className="font-medium">Ownership includes</div>
                  <div className="flex space-x-8 mt-3 font-normal">
                    {collection.metadata?.benefits?.slice(0, 3).map((benefit) => {
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
              {collection.metadata?.partnerships && (
                <div className="mt-7 md:w-2/3">
                  <div className="font-medium">Partnerships</div>
                  <div className="flex space-x-12 mt-3 ml-2 font-normal">
                    {collection.metadata?.partnerships?.slice(0, 3).map((partnership) => {
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
                    <td className="pr-20">{nFormatter(firstAllTimeStats?.numNfts ?? currentStats?.numNfts) ?? '—'}</td>
                    <td className="pr-20">
                      {nFormatter(firstAllTimeStats?.numOwners ?? currentStats?.numOwners) ?? '—'}
                    </td>
                    <td className="pr-20">
                      {currentStats?.floorPrice ? (
                        <EthPrice label={`${nFormatter(currentStats?.floorPrice)}`} labelClassName="font-bold" />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="pr-20">
                      {firstAllTimeStats?.volume ? (
                        <EthPrice
                          label={`${nFormatter(firstAllTimeStats?.volume ?? currentStats?.volume)}`}
                          labelClassName="font-bold"
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
            <section className="mt-20 md:w-1/2">
              <div className={twMerge(standardCard, 'items-center space-y-8')}>
                <Heading as="h2" className="font-body text-3xl font-medium">
                  Curate this collection
                </Heading>
                <FeesAprStats value={userCurated?.feesAPR || 0} className="mr-8" />
                <FeesAccruedStats value={userCurated?.fees || 0} />
                <div className="flex flex-row space-x-2 relative">
                  <VoteProgressBar
                    votes={userCurated?.votes || 0}
                    totalVotes={userCurated?.numCuratorVotes || 0}
                    className="max-w-[15rem] bg-white"
                  />
                </div>
                <Button onClick={() => checkSignedIn() && setIsStakeModalOpen(true)} className="font-heading">
                  Vote
                </Button>
              </div>
              <VoteModal
                collection={{
                  ...collection,
                  ...collection.metadata,
                  ...(userCurated || {
                    votes: 0,
                    fees: 0,
                    feesAPR: 0,
                    timestamp: 0,
                    numCuratorVotes: 0,
                    userAddress: '',
                    userChainId: '' as ChainId,
                    stakerContractAddress: '',
                    stakerContractChainId: '' as ChainId,
                    tokenContractAddress: '',
                    tokenContractChainId: '' as ChainId
                  })
                }}
                isOpen={isStakeModalOpen}
                onClose={() => setIsStakeModalOpen(false)}
                onVote={() => {
                  toastSuccess('Votes registered successfully. Changes will reflect shortly.');
                }}
              />
            </section>
          </div>

          <section>
            <ToggleTab
              className="mt-20 font-heading pointer-events-auto"
              options={options}
              selected={selected}
              onChange={onChange}
            />
            <div className="mt-6">
              {selected === 'NFTs' && collection && (
                <GalleryBox
                  pageId="COLLECTION"
                  getEndpoint={`/collections/${collection.chainId}:${collection.address}/nfts`}
                  collection={collection}
                  collectionAttributes={collectionAttributes || undefined}
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
                        onClick: async (ev, data) => {
                          if (!checkSignedIn()) {
                            return;
                          }
                          if (isAlreadyAdded(data)) {
                            findAndRemove(data);
                            return;
                          }
                          const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0;
                          // setPrice(`${price}`);
                          // addCartItem...
                          if (price) {
                            // Buy a listing
                            // setIsBuyClicked(true); // to add to cart as a Buy order. (see: useEffect)
                            const signedOBOrder = await fetchSignedOBOrder(
                              data?.orderSnippet?.listing?.orderItem?.id ?? ''
                            );
                            if (signedOBOrder) {
                              fulfillDrawerParams.addOrder(signedOBOrder);
                              fulfillDrawerParams.setShowDrawer(true);
                            }
                          } else {
                            // Add a Buy order to cart (Make offer)
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
                          }
                        }
                      }
                    ]
                  }}
                />
              )}
              {selected === 'Orders' && (
                <OrderbookContainer collectionId={collection.address} className="mt-[-70px] pointer-events-none" />
              )}
              {/* {currentTab === 1 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />} */}
              {selected === 'Sales' && <CollectionSalesTab collectionAddress={collection.address} />}
              {selected === 'Community' && <CommunityFeed collection={collection} className="mt-16" />}
            </div>
          </section>
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

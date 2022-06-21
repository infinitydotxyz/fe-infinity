import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BaseCollection, ERC721CardData, CollectionStats, ChainId } from '@infinityxyz/lib-frontend/types/core';
import { ToggleTab, PageBox, useToggleTab, SVG, EthPrice } from 'src/components/common';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { useFetch } from 'src/utils/apiUtils';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { CollectionActivityTab } from 'src/components/collection/collection-activity-tab';
import { StatsChips } from 'src/components/collection/stats-chips';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { BsCheck } from 'react-icons/bs';
import { AvatarImage } from 'src/components/collection/avatar-image';
import { useOrderContext } from 'src/utils/context/OrderContext';
import ContentLoader from 'react-content-loader';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { OrderbookContainer } from 'src/components/market/orderbook-list';
import { useAppContext } from 'src/utils/context/AppContext';
import NotFound404Page from 'pages/not-found-404';

const CollectionPage = () => {
  const router = useRouter();
  const { checkSignedIn } = useAppContext();
  const { addCartItem, removeCartItem, ordersInCart, cartItems, addOrderToCart, updateOrders } = useOrderContext();
  const [isBuyClicked, setIsBuyClicked] = useState(false);
  const { options, onChange, selected } = useToggleTab(
    ['NFT', 'Activity', 'Orderbook'],
    (router?.query?.tab as string) || 'NFT'
  );
  const {
    query: { name }
  } = router;

  // todo: the logic below caused console error. http://localhost:3000/collection/0mnipunks
  // if (!router.isReady) {
  //   return null;
  // }

  // todo: the logic below caused console error. http://localhost:3000/collection/0mnipunks
  // useEffect(() => {
  //   if (selected === 'NFT') {
  //     const updateQueryParams = { ...router.query };
  //     delete updateQueryParams.tab;
  //     router.replace({ pathname: router.pathname, href: router.pathname, query: { ...updateQueryParams } });
  //   } else {
  //     router.replace({ pathname: router.pathname, href: router.pathname, query: { ...router.query, tab: selected } });
  //   }
  // }, [selected]);

  useEffect(() => {
    if (isBuyClicked === true) {
      setIsBuyClicked(false);
      addOrderToCart();
    }
  }, [isBuyClicked]);

  const path = `/collections/${name}`;
  const { result: collection, isLoading, error } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: dailyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path +
          '/stats?offset=0&limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=daily'
      : '',
    { chainId: '1' }
  );
  const { result: weeklyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path +
          '/stats?offset=0&limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=weekly'
      : '',
    { chainId: '1' }
  );
  const firstDailyStats = dailyStats?.data[0];

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
    return <NotFound404Page collectionSlug={name?.toString()} />;
  }

  if (!collection) {
    // failed to load collection (collection not indexed?)
    return (
      <PageBox showTitle={false} title={'Collection'}>
        {error ? <div className="flex flex-col mt-10">Unable to load this collection.</div> : null}
      </PageBox>
    );
  }
  return (
    <PageBox showTitle={false} title={collection.metadata?.name ?? ''}>
      <div className="flex flex-col mt-10">
        <span>
          <AvatarImage url={collection.metadata.profileImage} className="mb-2 rounded-[50%]" />

          <div className="flex gap-3 items-center">
            <div className="text-6xl">{collection.metadata?.name}</div>
            {collection.hasBlueCheck ? <SVG.blueCheck className={iconButtonStyle} /> : null}
          </div>
        </span>
        <main>
          <div className="text-secondary mt-6 mb-6 font-heading">
            <span>Created by </span>
            <button onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection.owner)}>
              {ellipsisAddress(collection.owner ?? '')}
            </button>
            <span className="ml-12 font-heading">Collection address </span>
            <button onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection.address)}>
              {ellipsisAddress(collection.address ?? '')}
            </button>
          </div>

          <StatsChips collection={collection} weeklyStatsData={weeklyStats?.data ?? []} />

          {isLoading ? (
            <div className="mt-6">
              <LoadingDescription />
            </div>
          ) : (
            <div className="text-secondary mt-12 md:w-2/3">{collection.metadata.description ?? ''}</div>
          )}

          {collection.metadata.benefits && (
            <div className="mt-7 md:w-2/3">
              <div className="font-medium">Ownership includes</div>

              <div className="flex space-x-8 mt-3 font-normal">
                {collection.metadata.benefits?.slice(0, 3).map((benefit) => {
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

          {collection.metadata.partnerships && (
            <div className="mt-7 md:w-2/3">
              <div className="font-medium">Partnerships</div>

              <div className="flex space-x-12 mt-3 ml-2 font-normal">
                {collection.metadata.partnerships?.slice(0, 3).map((partnership) => {
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

          <table className="mt-8 md:w-1/2">
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
                <td>{collection.numNfts?.toLocaleString() ?? '—'}</td>
                <td>{collection.numOwners?.toLocaleString() ?? '—'}</td>
                <td>
                  {firstDailyStats?.floorPrice ? (
                    <EthPrice label={String(firstDailyStats?.floorPrice)} labelClassName="font-bold" />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {firstDailyStats?.volume ? (
                    <EthPrice label={String(firstDailyStats?.volume?.toLocaleString())} labelClassName="font-bold" />
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          <ToggleTab
            className="mt-12 font-heading pointer-events-auto"
            tabWidth="150px"
            options={options}
            selected={selected}
            onChange={onChange}
          />

          <div className="mt-6 min-h-[1024px]">
            {selected === 'NFT' && collection && (
              <GalleryBox
                pageId="COLLECTION"
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

            {selected === 'Orderbook' && (
              <OrderbookContainer collectionId={collection.address} className="mt-[-70px] pointer-events-none" />
            )}

            {/* {currentTab === 1 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />} */}
            {selected === 'Activity' && <CollectionActivityTab collectionAddress={collection.address ?? ''} />}

            {selected === '???' && (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
                <div className="lg:col-span-1 xl:col-span-2">
                  <CollectionFeed collectionAddress={collection.address ?? ''} />
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

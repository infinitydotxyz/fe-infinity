import React from 'react';
import { useRouter } from 'next/router';
import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { ToggleTab, PageBox, useToggleTab, SVG } from 'src/components/common';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { useFetch } from 'src/utils/apiUtils';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { ActivityTab } from 'src/components/collection/activity-tab';
import { StatsChips } from 'src/components/collection/stats-chips';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { AiOutlineCheck } from 'react-icons/ai';
import { AvatarImage } from 'src/components/collection/avatar-image';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderDrawer } from 'src/components/market/order-drawer/order-drawer';
import ContentLoader from 'react-content-loader';
import { iconButtonStyle } from 'src/utils/ui-constants';

const CollectionPage = () => {
  const { orderDrawerOpen, setOrderDrawerOpen, addCartItem } = useOrderContext();
  const router = useRouter();
  const {
    query: { name }
  } = router;

  const { options, onChange, selected } = useToggleTab(['NFT', 'Activity'], 'NFT');

  const path = `/collections/${name}`;
  const { result: collection, isLoading } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: dailyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path + '/stats?limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=daily'
      : '',
    { chainId: '1' }
  );
  const { result: weeklyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path + '/stats?limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=weekly'
      : '',
    { chainId: '1' }
  );
  const firstDailyStats = dailyStats?.data[0];

  if (!collection) {
    return <></>;
  }

  return (
    <PageBox showTitle={false} title={collection.metadata?.name ?? ''}>
      <div className="flex flex-col mt-10">
        <span>
          <AvatarImage url={collection.metadata.profileImage} className="mb-2 rounded-[50%]" />

          <div className="flex gap-3 items-center">
            <div className="text-6xl  ">{collection.metadata?.name}</div>
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

          <div className="mt-7">
            <div className="font-medium">Ownership includes</div>
            <div className="flex space-x-8 mt-3 font-normal">
              <div className="flex items-center text-secondary">
                <AiOutlineCheck className="mr-2 text-black" />
                Access
              </div>
              <div className="flex items-center text-secondary">
                <AiOutlineCheck className="mr-2 text-black" />
                Royalties
              </div>
              <div className="flex items-center text-secondary">
                <AiOutlineCheck className="mr-2 text-black" />
                IP rights
              </div>
            </div>
          </div>

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
                <td>{firstDailyStats?.floorPrice ?? '—'}</td>
                <td>{firstDailyStats?.volume?.toLocaleString() ?? '—'}</td>
              </tr>
            </tbody>
          </table>

          <ToggleTab className="mt-12 pointer-events-auto" options={options} selected={selected} onChange={onChange} />

          <div className="mt-6 min-h-[1024px]">
            {selected === 'NFT' && collection && (
              <GalleryBox
                collection={collection}
                cardProps={{
                  cardActions: [
                    {
                      // label: 'Details',
                      label: (data) => {
                        const price = data?.orderSnippet?.offer?.orderItem?.endPriceEth ?? '';
                        if (price) {
                          return (
                            <>
                              <span className="mr-4 font-bold">Buy</span>
                              <span className="font-heading">{price} ETH</span>
                            </>
                          );
                        }
                        return <span className="font-bold">Add to order</span>;
                      },
                      onClick: (ev, data) => {
                        addCartItem({
                          collectionName: data?.collectionName ?? '(no name)',
                          collectionAddress: data?.tokenAddress ?? '(no address)',
                          tokenImage: data?.image ?? '',
                          tokenName: data?.name ?? '(no name)',
                          tokenId: data?.tokenId ?? '0',
                          isSellOrder: false
                        });
                        // router.push(`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`);
                      }
                    }
                  ]
                }}
              />
            )}
            {/* {currentTab === 1 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />} */}
            {selected === 'Activity' && <ActivityTab collectionAddress={collection.address ?? ''} />}

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

      <OrderDrawer open={orderDrawerOpen} onClose={() => setOrderDrawerOpen(false)} />
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
    <rect x="3" y="3" rx="2" ry="2" width="390" height="14" />
    <rect x="3" y="28" rx="2" ry="2" width="390" height="14" />
    <rect x="3" y="52" rx="2" ry="2" width="222" height="14" />
  </ContentLoader>
);

export default CollectionPage;

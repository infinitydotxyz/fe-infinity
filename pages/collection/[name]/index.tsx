import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { FaCheck } from 'react-icons/fa';
import { Chip, RoundedNav } from 'src/components/common';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { useFetch } from 'src/utils/apiUtils';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { ellipsisAddress, getChainScannerBase } from 'src/utils';
import { ActivityTab } from 'src/components/collection/activity-tab';
import { Layout } from 'src/components/common/layout';
import { StatsChips } from 'src/components/collection/stats-chips';

import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { AvatarImage } from 'src/components/collection/avatar-image';

export default function CollectionPage() {
  const {
    query: { name },
    push: pushRoute
  } = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const path = `/collections/${name}`;
  const { result: collection } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: dailyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path +
          '/stats?limit=10&interval=oneDay&orderBy=volume&orderDirection=asc&minDate=0&maxDate=2648764957623&period=daily'
      : '',
    { chainId: '1' }
  );
  const { result: weeklyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path +
          '/stats?limit=10&interval=oneDay&orderBy=volume&orderDirection=asc&minDate=0&maxDate=2648764957623&period=weekly'
      : '',
    { chainId: '1' }
  );
  const onEdit = useCallback(() => pushRoute(`/collection/${collection?.slug}/edit`), [collection?.slug]);

  const lastDailyStats = dailyStats?.data[dailyStats?.data.length - 1];

  return (
    <Layout title={collection?.metadata?.name ?? ''} padded>
      <div className="flex flex-col mt-4">
        <span>
          <AvatarImage url={collection?.metadata.profileImage} className="mb-4" />
          <span className="text-7xl mr-2">{collection?.metadata?.name}</span>
          {collection?.hasBlueCheck ? (
            <Image src="/images/blue-check.png" width={24} height={24} alt="Blue check icon" />
          ) : null}
        </span>
        <main>
          <div className="text-secondary mt-6 mb-6 text-sm font-heading">
            Created by{' '}
            <button onClick={() => window.open(getChainScannerBase('1') + '/address/' + collection?.owner)}>
              {ellipsisAddress(collection?.owner ?? '')}
            </button>
          </div>

          <div className="flex flex-row space-x-1">
            <Chip content="+ Follow" />
            <Chip content="Edit" onClick={onEdit} />
            <StatsChips collection={collection} weeklyStatsData={weeklyStats?.data ?? []} />
          </div>

          <div className="text-secondary mt-6 text-sm md:w-2/3">{collection?.metadata.description ?? ''}</div>

          <div className="text-sm mt-6">
            <div className="font-medium">Ownership includes</div>
            <div className="flex space-x-8 mt-4 font-normal">
              <div className="flex text-secondary">
                <FaCheck className="mt-1 mr-2 text-black" />
                Access
              </div>
              <div className="flex text-secondary">
                <FaCheck className="mt-1 mr-2 text-black" />
                Royalties
              </div>
              <div className="flex text-secondary">
                <FaCheck className="mt-1 mr-2 text-black" />
                IP rights
              </div>
            </div>
          </div>

          {/* <Button variant="outline" className="mt-6">
            Claim Collection
          </Button> */}

          <table className="mt-8 text-sm md:w-1/2">
            <thead>
              <tr className="text-gray-400">
                <th className="text-left font-medium font-heading">Items</th>
                <th className="text-left font-medium font-heading">Owned by</th>
                <th className="text-left font-medium font-heading">Floor price</th>
                <th className="text-left font-medium font-heading">Volume traded</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold font-heading">
                <td>{collection?.numNfts?.toLocaleString()}</td>
                <td>{collection?.numOwners?.toLocaleString()}</td>
                <td>{lastDailyStats?.floorPrice ?? '—'}</td>
                <td>{lastDailyStats?.volume?.toLocaleString() ?? ''}</td>
              </tr>
            </tbody>
          </table>

          <RoundedNav
            items={[{ title: 'NFT' }, { title: 'Activity' }, { title: 'Community' }]}
            onChange={(currentIndex) => setCurrentTab(currentIndex)}
            className="mt-8"
          />

          <div className="mt-6 min-h-[1024px]">
            {currentTab === 0 && <>{collection && <GalleryBox collection={collection} />}</>}
            {currentTab === 1 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />}
            {currentTab === 2 && (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
                <div className="lg:col-span-1 xl:col-span-2">
                  {/* <div className="text-3xl mb-6">Feed</div> */}
                  <CollectionFeed header="Feed" collectionAddress={collection?.address ?? ''} />
                </div>
                <div className="col-span-1">{collection && <CommunityRightPanel collection={collection} />}</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </Layout>
  );
}

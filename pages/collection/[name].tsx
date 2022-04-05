import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { BaseCollection, CollectionStats } from '@infinityxyz/lib/types/core';
import { FaCaretDown, FaCaretUp, FaCheck, FaDiscord, FaTwitter } from 'react-icons/fa';
import { Chip, PageBox, RoundedNav } from 'src/components/common';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { useFetch } from 'src/utils/apiUtils';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { ellipsisAddress } from 'src/utils';

export function CollectionPage() {
  const {
    query: { name }
  } = useRouter();
  const [currentTab, setCurrentTab] = useState(0);
  const path = `/collections/${name}`;
  const { result: collection } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });
  const { result: stats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path +
          '/stats?limit=10&interval=oneDay&orderBy=volume&orderDirection=asc&minDate=0&maxDate=2648764957623&period=daily'
      : '',
    { chainId: '1' }
  );
  const lastStats = stats?.data[stats?.data.length - 1];
  console.log('lastStats', lastStats);

  return (
    <PageBox
      title={name?.toString() ?? ''}
      titleElement={
        <span>
          <img src={collection?.metadata.profileImage} className="w-20 h-20" />
          {name}{' '}
          {collection?.hasBlueCheck ? (
            <Image src="/images/blue-check.png" width={24} height={24} alt="Blue check icon" />
          ) : null}
        </span>
      }
      center={false}
    >
      <div className="text-secondary mb-8 text-sm">{ellipsisAddress(collection?.owner ?? '')}</div>

      <div className="flex flex-row space-x-1">
        <Chip content="+ Follow" />
        <Chip content="Edit" />
        <Chip
          left={<FaTwitter />}
          content={
            <span className="flex items-center">
              {lastStats?.twitterFollowers?.toLocaleString()}
              {(lastStats?.twitterFollowersPercentChange ?? 0) < 0 ? (
                <span className="ml-2 px-2 rounded-xl bg-red-500 text-white text-xs flex items-center">
                  <FaCaretDown /> {`${(lastStats?.twitterFollowersPercentChange ?? 0) * 100}`.slice(0, 4)}%
                </span>
              ) : (
                <span className="ml-2 px-2 rounded-xl bg-green-500 text-white text-xs flex items-center">
                  <FaCaretUp /> {`${(lastStats?.twitterFollowersPercentChange ?? 0) * 100}`.slice(0, 4)}%
                </span>
              )}
            </span>
          }
        />
        <Chip
          left={<FaDiscord />}
          content={
            <span className="flex items-center">
              {lastStats?.discordFollowers?.toLocaleString()}
              {(lastStats?.discordFollowersPercentChange ?? 0) < 0 ? (
                <span className="ml-2 px-2 rounded-xl bg-red-500 text-white text-xs flex items-center">
                  <FaCaretDown /> {`${(lastStats?.discordFollowersPercentChange ?? 0) * 100}`.slice(0, 4)}%
                </span>
              ) : (
                <span className="ml-2 px-2 rounded-xl bg-green-500 text-white text-xs flex items-center">
                  <FaCaretUp /> {`${(lastStats?.discordFollowersPercentChange ?? 0) * 100}`.slice(0, 4)}%
                </span>
              )}
            </span>
          }
        />
      </div>

      <div className="text-secondary mt-6 text-sm">{collection?.metadata.description ?? ''}</div>

      <div className="text-sm font-bold mt-6">
        <div>Ownership includes</div>
        <div className="flex space-x-8 mt-4 font-normal">
          <div className="flex text-secondary">
            <FaCheck className="mr-2" />
            Access
          </div>
          <div className="flex text-secondary">
            <FaCheck className="mr-2" />
            Royalties
          </div>
          <div className="flex text-secondary">
            <FaCheck className="mr-2" />
            IP rights
          </div>
        </div>
      </div>

      {/* <Button variant="outline" className="mt-6">
        Claim Collection
      </Button> */}

      <table className="mt-8 text-sm w-1/2">
        <thead>
          <tr className="text-gray-400">
            <th className="text-left font-medium">Items</th>
            <th className="text-left font-medium">Owned by</th>
            <th className="text-left font-medium">Floor price</th>
            <th className="text-left font-medium">Volume traded</th>
          </tr>
        </thead>
        <tbody>
          <tr className="font-bold">
            <td>{collection?.numNfts}</td>
            <td>{collection?.numOwners}</td>
            <td>{lastStats?.floorPrice ?? '—'}</td>
            <td>{lastStats?.volume ?? ''}</td>
          </tr>
        </tbody>
      </table>

      <RoundedNav
        items={[{ title: 'NFTs' }, { title: 'Community' }]}
        onChange={(currentIndex) => setCurrentTab(currentIndex)}
        className="w-40 mt-8"
      />

      <div className="mt-6">
        {currentTab === 0 ? (
          <>{collection && <GalleryBox collection={collection} />}</>
        ) : (
          <div className="flex">
            <div className="w-2/3">
              <div className="text-3xl mb-6">Feed</div>
              <CollectionFeed collectionAddress={collection?.address ?? ''} />
            </div>
            <div className="w-1/3">
              <div className="text-3xl mb-6">
                Trending
                <span className="ml-6 text-secondary">7 day vol</span>
              </div>
              <div>Trending component</div>
            </div>
          </div>
        )}
      </div>
    </PageBox>
  );
}

export default CollectionPage;

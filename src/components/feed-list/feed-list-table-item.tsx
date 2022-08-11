import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { ReactNode } from 'react';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress, isProd, NEWS_IMAGE_URL, standardBorderCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { NftEventRec } from '../asset/activity/activity-item';

interface Props {
  activity: NftEventRec;
}

export const FeedListTableItem = ({ activity }: Props) => {
  const saleItem = () => {
    const buyer = activity.toDisplayName ? ellipsisAddress(activity.toDisplayName) : ellipsisAddress(activity.to);

    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">{activity.price ? <EthPrice label={`${activity.price}`} /> : '—'}</TableItem>

            <TableItem label="Buyer">
              {buyer && <NextLink href={`/profile/${activity.to}`}>{buyer}</NextLink>}
              {!buyer && <div>None</div>}
            </TableItem>

            <TableItem label="Seller">
              <NextLink href={`/profile/${activity.from}`}>
                {activity.fromDisplayName ? ellipsisAddress(activity.fromDisplayName) : ellipsisAddress(activity.from)}
              </NextLink>
            </TableItem>

            <TableItem label="Date">
              <a href={activity.externalUrl} target="_blank" rel="noopener noreferrer">
                {format(activity.timestamp)}
              </a>
            </TableItem>
          </div>
        </div>
      </div>
    );
  };

  const offerItem = () => {
    const buyer = activity.toDisplayName ? ellipsisAddress(activity.toDisplayName) : ellipsisAddress(activity.to);

    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">{activity.price ? <EthPrice label={`${activity.price}`} /> : '—'}</TableItem>

            <TableItem label="Buyer">
              {buyer && <NextLink href={`/profile/${activity.to}`}>{buyer}</NextLink>}
              {!buyer && <div>None</div>}
            </TableItem>

            <TableItem label="Maker">
              <NextLink href={`/profile/${activity.from}`}>
                {activity.fromDisplayName ? ellipsisAddress(activity.fromDisplayName) : ellipsisAddress(activity.from)}
              </NextLink>
            </TableItem>

            <TableItem label="Date">
              <a href={activity.externalUrl} target="_blank" rel="noopener noreferrer">
                {format(activity.timestamp)}
              </a>
            </TableItem>
          </div>
        </div>
      </div>
    );
  };

  const listingItem = () => {
    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">{activity.price ? <EthPrice label={`${activity.price}`} /> : '—'}</TableItem>

            <TableItem label="Maker">
              <NextLink href={`/profile/${activity.from}`}>
                {activity.fromDisplayName ? ellipsisAddress(activity.fromDisplayName) : ellipsisAddress(activity.from)}
              </NextLink>
            </TableItem>

            <TableItem label="Date">
              <a href={activity.externalUrl} target="_blank" rel="noopener noreferrer">
                {format(activity.timestamp)}
              </a>
            </TableItem>
          </div>
        </div>
      </div>
    );
  };

  const transferItem = () => {
    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            <TableItem label="From">
              <NextLink href={`/profile/${activity.from}`}>
                {activity.fromDisplayName ? ellipsisAddress(activity.fromDisplayName) : ellipsisAddress(activity.from)}
              </NextLink>
            </TableItem>

            <TableItem label="To">
              <NextLink href={`/profile/${activity.to}`}>
                {activity.toDisplayName ? ellipsisAddress(activity.toDisplayName) : ellipsisAddress(activity.to)}
              </NextLink>
            </TableItem>

            <TableItem label="Date">
              <a href={activity.externalUrl} target="_blank" rel="noopener noreferrer">
                {format(activity.timestamp)}
              </a>
            </TableItem>
          </div>
        </div>
      </div>
    );
  };

  const newsItem = () => {
    return (
      <a href={activity.externalUrl} className=" " target="_blank">
        <div className={twMerge(standardBorderCard, 'flex items-stretch font-heading')}>
          <NewsImage className="w-28 h-auto overflow-clip rounded-2xl" src={activity?.image} />

          <div className="flex flex-col font-body w-full justify-around ml-8">
            <div className="font-bold">{activity.paymentToken}</div>
            <div>{activity.internalUrl}</div>

            <div className="flex item-center mt-2">
              <div className="font-bold">{activity.fromDisplayName}</div>
              <div className="ml-4">{format(activity.timestamp)}</div>
            </div>
          </div>
        </div>
      </a>
    );
  };

  const tweetItem = () => {
    return (
      <a href={activity.externalUrl} className=" " target="_blank">
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image || activity?.paymentToken} />

          <div className="flex flex-col font-body w-full justify-around ml-8">
            <div className=" font-bold">{activity.collectionName}</div>
            <div>{activity.to}</div>

            <div className="flex item-center mt-2">
              <div className="font-bold">{activity.toDisplayName}</div>
              <div className="ml-4">{format(activity.timestamp)}</div>
            </div>
          </div>
        </div>
      </a>
    );
  };

  const discordItem = () => {
    return (
      <a href={activity.externalUrl} className=" " target="_blank">
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />

          <div className="flex flex-col font-body w-full justify-around ml-8">
            <div className=" font-bold">{activity.paymentToken}</div>
            <div>{activity.internalUrl}</div>

            <div className="flex item-center mt-2">
              <div className="font-bold">{activity.fromDisplayName}</div>
              <div className="ml-4">{format(activity.timestamp)}</div>
            </div>
          </div>
        </div>
      </a>
    );
  };

  switch (activity.type) {
    case EventType.NftSale:
      return saleItem();

    case EventType.NftOffer:
      return offerItem();

    case EventType.NftListing:
      return listingItem();
    case EventType.CoinMarketCapNews:
      return newsItem();

    case EventType.TwitterTweet:
      return tweetItem();

    case EventType.NftTransfer:
      return transferItem();

    case EventType.DiscordAnnouncement:
      return discordItem();
  }

  if (!isProd()) {
    return <div className="bg-red-800">{activity.type}: Not implemented</div>;
  }

  return <></>;
};

// ======================================================

interface Props2 {
  label: string;
  children: ReactNode;
}

const TableItem = ({ label, children }: Props2) => {
  return (
    <div className="w-auto mr-4">
      <div className="text-gray-400">{label}</div>
      <div className="font-medium">{children}</div>
    </div>
  );
};

// ===================================================================

interface Props3 {
  src?: string;
  className?: string;
}

export const NewsImage = ({ src, className = '' }: Props3) => {
  if (!src) {
    return <EZImage cover={false} className={twMerge(className, 'border p-1')} src={NEWS_IMAGE_URL} />;
  }

  return <EZImage className={className} src={src} />;
};

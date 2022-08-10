import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { ReactNode } from 'react';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress, isProd, standardBorderCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { NftEventRec } from '../asset/activity/activity-item';

interface Props {
  activity: NftEventRec;
}

export const FeedListTableItem = ({ activity }: Props) => {
  const feedItem = (showBuyer = true) => {
    const buyer = activity.toDisplayName ? ellipsisAddress(activity.toDisplayName) : ellipsisAddress(activity.to);

    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            {/* <TableItem label="Event">
            <a href={`${activity.externalUrl}`} target="_blank" rel="noopener noreferrer">
              {EventTypeNames[activity.type as EventType]}
            </a>
          </TableItem> */}

            <TableItem label="Price">{activity.price ? <EthPrice label={`${activity.price}`} /> : '—'}</TableItem>

            {showBuyer && (
              <TableItem label="Buyer">
                {buyer && <NextLink href={`/profile/${activity.to}`}>{buyer}</NextLink>}
                {!buyer && <div>None</div>}
              </TableItem>
            )}

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

  const newsItem = () => {
    return (
      <a href={activity.externalUrl} className=" " target="_blank">
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />

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
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />

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

  switch (activity.type) {
    case EventType.NftSale:
    case EventType.NftOffer:
      return feedItem();

    case EventType.NftListing:
      return feedItem(false);
    case EventType.CoinMarketCapNews:
      return newsItem();

    case EventType.TwitterTweet:
      return tweetItem();

    case EventType.NftTransfer:
      return feedItem(false);

    case EventType.DiscordAnnouncement:
      // console.log(activity.type);
      // console.log(JSON.stringify(activity, null, 2));
      break;
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

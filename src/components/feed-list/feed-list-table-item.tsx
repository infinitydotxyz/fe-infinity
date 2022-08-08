import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { ReactNode } from 'react';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress, isProd, standardCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { NftEventRec } from '../asset/activity/activity-item';

interface Props {
  activity: NftEventRec;
}

export const FeedListTableItem = ({ activity }: Props) => {
  const sale = () => {
    return (
      <div>
        <div className={twMerge(standardCard, 'flex items-center font-heading')}>
          <EZImage className="w-16 h-16 max-h-[80px] rounded-full" src={activity?.image} />

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.collectionData?.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId)}
              </NextLink>
            </TableItem>

            {/* <TableItem label="Event">
            <a href={`${activity.externalUrl}`} target="_blank" rel="noopener noreferrer">
              {EventTypeNames[activity.type as EventType]}
            </a>
          </TableItem> */}

            <TableItem label="Price">{activity.price ? <EthPrice label={`${activity.price}`} /> : '—'}</TableItem>

            <TableItem label="Buyer">
              <NextLink href={`/profile/${activity.to}`}>
                {activity.toDisplayName ? ellipsisAddress(activity.toDisplayName) : ellipsisAddress(activity.to)}
              </NextLink>
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

  switch (activity.type) {
    case EventType.NftSale:
    case EventType.NftOffer:
      return sale();
    case EventType.NftListing:
    case EventType.TwitterTweet:
    case EventType.DiscordAnnouncement:
    case EventType.CoinMarketCapNews:
    case EventType.NftTransfer:
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

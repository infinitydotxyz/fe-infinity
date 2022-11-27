import { EventType } from '@infinityxyz/lib-frontend/types/core/feed';
import { formatEth, round } from '@infinityxyz/lib-frontend/utils';
import { ReactNode } from 'react';
import { EthPrice, ExternalLink, EZImage, LinkText, NextLink } from 'src/components/common';
import { ellipsisAddress, ellipsisString, NEWS_IMAGE_URL, nFormatter, standardBorderCard } from 'src/utils';
import { twMerge } from 'tailwind-merge';
import { format } from 'timeago.js';
import { NftEventRec } from '../asset/activity/activity-item';
import person from 'src/images/person.png';
import { useEnsName } from 'src/hooks/useEnsName';

interface Props {
  activity: NftEventRec;
}

const ellipseParams = [4, 4];

export const FeedListTableItem = ({ activity }: Props) => {
  const fromEns = useEnsName(activity.from);
  const toEns = useEnsName(activity.to ?? '');

  let fromName = ellipsisAddress(activity.from, ...ellipseParams);
  if (activity.fromDisplayName) {
    fromName = ellipsisString(activity.fromDisplayName, ...ellipseParams);
  } else {
    if (fromEns) {
      fromName = ellipsisString(fromEns, 9, 0);
    }
  }

  let toName = ellipsisAddress(activity.to, ...ellipseParams);
  if (activity.toDisplayName) {
    toName = ellipsisString(activity.toDisplayName, ...ellipseParams);
  } else {
    if (toEns) {
      toName = ellipsisString(toEns, 9, 0);
    }
  }

  const saleItem = () => {
    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId, ...ellipseParams)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">
              {activity.price ? (
                <EthPrice label={`${ellipsisString(activity.price.toString(), ...ellipseParams)}`} />
              ) : (
                '—'
              )}
            </TableItem>

            <TableItem label="Buyer">
              {toName && <NextLink href={`/profile/${activity.to}`}>{toName}</NextLink>}
              {!toName && <div>None</div>}
            </TableItem>

            <TableItem label="Seller">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
          </div>
        </div>
      </div>
    );
  };

  const offerItem = () => {
    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId, ...ellipseParams)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">
              {activity.price ? (
                <EthPrice label={`${ellipsisString(activity.price.toString(), ...ellipseParams)}`} />
              ) : (
                '—'
              )}
            </TableItem>

            <TableItem label="Buyer">
              {toName && <NextLink href={`/profile/${activity.to}`}>{toName}</NextLink>}
              {!toName && <div>None</div>}
            </TableItem>

            <TableItem label="Maker">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
          </div>
        </div>
      </div>
    );
  };

  const listingItem = () => {
    let url = activity.internalUrl;

    if (!url) {
      url = `/collection/${activity.collectionSlug}`;
    }

    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={url}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="Token">
              <NextLink href={`/asset/${activity.chainId}/${activity.address}/${activity.tokenId}`}>
                {ellipsisAddress(activity.tokenId, ...ellipseParams)}
              </NextLink>
            </TableItem>

            <TableItem label="Price">
              {activity.price ? (
                <EthPrice label={`${ellipsisString(activity.price.toString(), ...ellipseParams)}`} />
              ) : (
                '—'
              )}
            </TableItem>

            <TableItem label="Maker">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
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
                {ellipsisAddress(activity.tokenId, ...ellipseParams)}
              </NextLink>
            </TableItem>

            <TableItem label="From">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="To">
              <NextLink href={`/profile/${activity.to}`}>{toName}</NextLink>
            </TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
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
      <div className={twMerge(standardBorderCard, 'flex items-start font-heading')}>
        <ExternalLink href={activity.tokenId}>
          <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image || activity?.paymentToken} />
        </ExternalLink>

        <div className="flex flex-col font-body w-full justify-around ml-8">
          <div className=" font-bold">{activity.collectionName}</div>

          <LinkText text={activity.to ?? ''} />

          <div className="flex item-center mt-2">
            <div className="font-bold">{activity.toDisplayName}</div>
            <div className="ml-4">{format(activity.timestamp)}</div>
          </div>
        </div>
      </div>
    );
  };

  const discordItem = () => {
    return (
      <div className={twMerge(standardBorderCard, 'flex items-start font-heading')}>
        <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />

        <div className="flex flex-col font-body w-full justify-around ml-8 break-all">
          <div className=" font-bold">{activity.paymentToken}</div>

          <LinkText text={activity.internalUrl ?? ''} />

          <div className="flex item-center mt-2">
            <div className="font-bold">{activity.fromDisplayName}</div>
            <div className="ml-4">{format(activity.timestamp)}</div>
          </div>
        </div>
      </div>
    );
  };

  const tokensStakedItem = () => {
    const url = `/profile/${activity.from}`;

    const amount = [EventType.TokensStaked, EventType.TokensUnStaked, EventType.TokensRageQuit].includes(activity.type)
      ? nFormatter(round(formatEth(activity.paymentToken), 3))
      : activity.paymentToken
      ? ellipsisString(activity.paymentToken, ...ellipseParams)
      : '—';

    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={url}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image || person.src} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="User">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="Amount">{amount}</TableItem>
            <TableItem label="Duration">{activity.price ? <div>{activity.price}</div> : '—'}</TableItem>
            <TableItem label="Power">{activity.externalUrl ? <div>{activity.externalUrl}</div> : '—'}</TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
          </div>
        </div>
      </div>
    );
  };

  const voteItem = () => {
    return (
      <div>
        <div className={twMerge(standardBorderCard, 'flex items-center font-heading')}>
          <NextLink href={`/collection/${activity.collectionSlug}`}>
            <EZImage className="w-16 h-16 overflow-clip rounded-2xl" src={activity?.image} />
          </NextLink>

          <div className="flex w-full justify-around ml-8">
            <TableItem label="User">
              <NextLink href={`/profile/${activity.from}`}>{fromName}</NextLink>
            </TableItem>

            <TableItem label="Votes">{activity.price ? <div>{nFormatter(activity.price)}</div> : '—'}</TableItem>

            <TableItem label="# Users">{activity.toDisplayName}</TableItem>

            <TableItem label="Date">{format(activity.timestamp)}</TableItem>
          </div>
        </div>
      </div>
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
    case EventType.TokensStaked:
      return tokensStakedItem();
    case EventType.UserVote:
      return voteItem();

    case EventType.TokensUnStaked:
    case EventType.UserVoteRemoved:
    case EventType.TokensRageQuit:
      return <div></div>;
  }

  return <div className="bg-red-800">{activity.type}: Not implemented</div>;

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
      <div className="text-gray-400 whitespace-nowrap">{label}</div>
      <div className="font-medium whitespace-nowrap">{children}</div>
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

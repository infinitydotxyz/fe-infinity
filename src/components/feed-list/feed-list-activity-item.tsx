import { ReactNode } from 'react';
import { EthPrice, EZImage, NextLink } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { format } from 'timeago.js';
import { NftActivity } from '../asset/activity/activity-item';

interface Props {
  activity: NftActivity;
}

export const FeedListActivityItem = ({ activity }: Props) => {
  return (
    <div>
      <div className="bg-gray-100 px-10 py-6 rounded-3xl flex items-center font-heading">
        <EZImage
          className="w-16 h-16 max-h-[80px] rounded-full"
          src={activity.collectionData?.metadata?.profileImage}
        />

        {/* <NextLink href={`/asset/${activity.chainId}/${activity.collectionData?.address}/${activity.tokenId}`}>Link</NextLink> */}
        <div className="flex w-full ml-8">
          <TableItem label="Link">
            <a href={`/asset/${activity.chainId}/${activity.collectionData?.address}/${activity.tokenId}`}>
              {ellipsisAddress(activity.tokenId)}
            </a>
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

// ======================================================

interface Props2 {
  label: string;
  children: ReactNode;
}

const TableItem = ({ label, children }: Props2) => {
  return (
    <div className="w-auto mr-4">
      <div className="text-gray-400">{label}</div>
      <div className="font-bold">{children}</div>
    </div>
  );
};

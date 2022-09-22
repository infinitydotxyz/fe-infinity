import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { format } from 'timeago.js';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { getCollectionLink, getTokenLink, getUserToDisplay } from 'src/utils';
import {
  ChainId,
  EtherscanLinkType,
  NftTransferEvent as NftTransferEventFeed
} from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';

interface Props {
  event: NftTransferEventFeed;
}

export const NftTransferEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const from = getUserToDisplay(
    { address: event.from, username: '', displayName: event.fromDisplayName },
    currentUser?.address || ''
  );

  const to = getUserToDisplay(
    { address: event.to, username: '', displayName: event.toDisplayName },
    currentUser?.address || ''
  );

  const collectionLink = getCollectionLink({
    slug: event.collectionSlug,
    address: event.collectionAddress,
    chainId: event.chainId as ChainId
  });
  const nftLink = getTokenLink({
    chainId: event.chainId as ChainId,
    address: event.collectionAddress,
    tokenId: event.tokenId
  });

  const avatar = UserActivityItemImage({ src: event.image || event.collectionProfileImage, relativeLink: nftLink });
  const title = UserActivityItemTitle({
    title: event.collectionName,
    hasBlueCheck: event.hasBlueCheck,
    titleRelativeLink: collectionLink,
    subtitle: event.tokenId ? event.tokenId : undefined,
    subtitleRelativeLink: nftLink
  });

  return (
    <UserActivityItem avatar={avatar} title={title}>
      <>
        <UserActivityItemTextField
          title={'Event'}
          link={getEtherscanLink(
            { type: EtherscanLinkType.Transaction, transactionHash: event.txHash },
            event.chainId as ChainId
          )}
        >
          {'Transfer'}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'From'} link={from.link}>
          {from.value}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'To'} link={to.link}>
          {to.value}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

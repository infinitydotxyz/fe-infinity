import {
  ChainId,
  EtherscanLinkType,
  NftTransferEvent as NftTransferEventFeed
} from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';
import { getCollectionLink, getUserToDisplay } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { format } from 'timeago.js';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';

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

  const avatar = UserActivityItemImage({
    src: event.image || event.collectionProfileImage,
    showModal: true,
    basicTokenInfo: {
      chainId: event.chainId as ChainId,
      collectionAddress: event.collectionAddress,
      tokenId: event.tokenId
    }
  });

  const title = UserActivityItemTitle({
    title: event.collectionName,
    hasBlueCheck: event.hasBlueCheck,
    titleRelativeLink: collectionLink,
    subtitle: event.tokenId ? event.tokenId : undefined
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

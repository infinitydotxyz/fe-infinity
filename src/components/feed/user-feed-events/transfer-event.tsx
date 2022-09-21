import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { format } from 'timeago.js';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { getUserToDisplay } from 'src/utils';
import { ChainId, EtherscanLinkType, NftTransferEvent } from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';

interface Props {
  event: NftTransferEvent;
}

export const NftSaleEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const from = getUserToDisplay(
    { address: event.from, username: '', displayName: event.fromDisplayName },
    currentUser?.address || ''
  );

  const to = getUserToDisplay(
    { address: event.to, username: '', displayName: event.toDisplayName },
    currentUser?.address || ''
  );

  const collectionLink = `/collection/${event.collectionSlug || event.chainId + event.collectionAddress}`;
  const nftLink = `/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`;
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
          content={'Transfer'}
          link={getEtherscanLink(
            { type: EtherscanLinkType.Transaction, transactionHash: event.txHash },
            event.chainId as ChainId
          )}
        />
        <UserActivityItemTextField title={'From'} content={from.value} link={from.link} />
        <UserActivityItemTextField title={'To'} content={to.value} link={to.link} />
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

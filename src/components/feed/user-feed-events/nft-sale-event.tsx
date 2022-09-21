import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { EthPrice } from 'src/components/common';
import { format } from 'timeago.js';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { getUserToDisplay, nFormatter } from 'src/utils';
import { ChainId, EtherscanLinkType, NftSaleEvent as NftSaleFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';

interface Props {
  event: NftSaleFeedEvent;
}

export const NftSaleEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const seller = getUserToDisplay(
    { address: event.seller, username: '', displayName: event.sellerDisplayName },
    currentUser?.address || ''
  );

  const buyer = getUserToDisplay(
    { address: event.buyer, username: '', displayName: event.buyerDisplayName },
    currentUser?.address || ''
  );

  const collectionLink = `/collection/${event.collectionSlug || event.chainId + event.collectionAddress}`;
  const link = event.tokenId
    ? `/asset/${event.chainId}/${event.collectionAddress}/${event.tokenId}`
    : `/collection/${event.collectionSlug || event.chainId + event.collectionAddress}`;
  const avatar = UserActivityItemImage({ src: event.image || event.collectionProfileImage, relativeLink: link });
  const title = UserActivityItemTitle({
    title: event.collectionName,
    hasBlueCheck: event.hasBlueCheck,
    titleRelativeLink: collectionLink,
    subtitle: event.tokenId ? event.tokenId : undefined,
    subtitleRelativeLink: link
  });

  return (
    <UserActivityItem avatar={avatar} title={title}>
      <>
        <UserActivityItemTextField
          title={'Event'}
          content={'Sale'}
          link={getEtherscanLink(
            { type: EtherscanLinkType.Transaction, transactionHash: event.txHash },
            event.chainId as ChainId
          )}
        />
        <UserActivityItemTextField title={'Price'}>
          <EthPrice label={`${nFormatter(event.price)}`} />
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Buyer'} content={buyer.value} link={buyer.link} />
        <UserActivityItemTextField title={'Seller'} content={seller.value} link={seller.link} />
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

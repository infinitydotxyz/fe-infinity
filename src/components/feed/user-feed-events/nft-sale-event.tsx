import { ChainId, EtherscanLinkType, NftSaleEvent as NftSaleFeedEvent } from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';
import { EthPrice } from 'src/components/common';
import { getCollectionLink, getUserToDisplay, nFormatter } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { format } from 'timeago.js';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';

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
          {'Sale'}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Price'}>
          <EthPrice label={`${nFormatter(event.price)}`} />
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Buyer'} link={buyer.link}>
          {buyer.value}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Seller'} link={seller.link}>
          {seller.value}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

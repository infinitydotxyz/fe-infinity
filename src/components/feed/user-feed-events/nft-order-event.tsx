import { ChainId, EventType } from '@infinityxyz/lib-frontend/types/core';
import { NftListingEvent, NftOfferEvent } from '@infinityxyz/lib-frontend/types/core/feed/NftEvent';
import { EthPrice } from 'src/components/common';
import { getCollectionLink, getUserToDisplay, nFormatter } from 'src/utils';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { format } from 'timeago.js';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';

interface Props {
  event: NftListingEvent | NftOfferEvent;
}

export const NftOrderEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const eventType = event.type === EventType.NftListing ? 'Listing' : 'Offer';

  const maker = getUserToDisplay(
    { address: event.makerAddress, username: event.makerUsername, displayName: '' },
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
        <UserActivityItemTextField title={'Event'}>{eventType}</UserActivityItemTextField>
        <UserActivityItemTextField title={'Price'}>
          <EthPrice label={`${nFormatter(event.startPriceEth)}`} />
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Maker'} link={maker.link}>
          {maker.value}
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Date'}>{format(event.startTimeMs)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

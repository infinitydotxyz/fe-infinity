import { NftListingEvent, NftOfferEvent } from '@infinityxyz/lib-frontend/types/core/feed/NftEvent';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { EthPrice } from 'src/components/common';
import { format } from 'timeago.js';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { getUserToDisplay, nFormatter } from 'src/utils';
import { EventType } from '@infinityxyz/lib-frontend/types/core';

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
        <UserActivityItemTextField title={'Event'} content={eventType} />
        <UserActivityItemTextField title={'Price'}>
          <EthPrice label={`${nFormatter(event.startPriceEth)}`} />
        </UserActivityItemTextField>
        <UserActivityItemTextField title={'Date'}>{format(event.startTimeMs)}</UserActivityItemTextField>
        <UserActivityItemTextField title={'Maker'} content={maker.value} link={maker.link} />
      </>
    </UserActivityItem>
  );
};

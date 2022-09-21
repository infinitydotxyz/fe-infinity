import { NftListingEvent, NftOfferEvent } from '@infinityxyz/lib-frontend/types/core/feed/NftEvent';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { EthPrice } from 'src/components/common';
import { format } from 'timeago.js';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { getCollectionLink, getTokenLink, getUserToDisplay, nFormatter } from 'src/utils';
import { ChainId, EventType } from '@infinityxyz/lib-frontend/types/core';

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
  const link = event.tokenId
    ? getTokenLink({ chainId: event.chainId as ChainId, address: event.collectionAddress, tokenId: event.tokenId })
    : collectionLink;
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
        <UserActivityItemTextField title={'Maker'} content={maker.value} link={maker.link} />
        <UserActivityItemTextField title={'Date'}>{format(event.startTimeMs)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

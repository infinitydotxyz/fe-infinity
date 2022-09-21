import {
  ChainId,
  EtherscanLinkType,
  EventType,
  UserVoteEvent,
  UserVoteRemovedEvent
} from '@infinityxyz/lib-frontend/types/core';
import { getEtherscanLink } from '@infinityxyz/lib-frontend/utils';
import { ellipsisAddress, getCollectionLink, getUserToDisplay, nFormatter } from 'src/utils/commonUtils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { format } from 'timeago.js';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';

interface Props {
  event: UserVoteEvent | UserVoteRemovedEvent;
}

const voteEventNameByType = {
  [EventType.UserVote]: 'Vote',
  [EventType.UserVoteRemoved]: 'Votes Removed'
};

export const VoteEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const user = getUserToDisplay(
    {
      address: event.userAddress,
      username: event.userUsername,
      displayName: event.userDisplayName
    },
    currentUser?.address || ''
  );
  const collectionLink = getCollectionLink({
    slug: event.collectionSlug,
    address: event.collectionAddress,
    chainId: event.chainId as ChainId
  });

  const title = UserActivityItemTitle({
    title: event.collectionName,
    hasBlueCheck: event.hasBlueCheck,
    titleRelativeLink: collectionLink,
    subtitle: ellipsisAddress(event.collectionAddress),
    subtitleRelativeLink: getEtherscanLink(
      { type: EtherscanLinkType.Address, address: event.collectionAddress },
      event.stakerContractChainId
    )
  });

  const votes =
    'votesAdded' in event
      ? { name: 'Votes Added', value: event.votesAdded }
      : { name: 'Votes Removed', value: event.votesRemoved };

  const avatar = UserActivityItemImage({ src: event.collectionProfileImage, relativeLink: collectionLink });
  return (
    <UserActivityItem avatar={avatar} title={title}>
      <>
        <UserActivityItemTextField title={'Event'} content={voteEventNameByType[event.type]} link={collectionLink} />
        <UserActivityItemTextField title={votes.name} content={`${nFormatter(votes.value) ?? ''}`} />
        <UserActivityItemTextField title={'User'} content={user.value} link={user.link} />
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

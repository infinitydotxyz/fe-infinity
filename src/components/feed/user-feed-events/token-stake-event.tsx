import {
  EtherscanLinkType,
  EventType,
  UserRageQuitEvent,
  UserStakedEvent,
  UserUnStakedEvent
} from '@infinityxyz/lib-frontend/types/core';
import { formatEth, getEtherscanLink } from '@infinityxyz/lib-frontend/utils';
import { mapDurationToMonths } from 'src/hooks/contract/staker/useRemainingLockTime';
import { ellipsisAddress, getUserToDisplay, nFormatter } from 'src/utils/commonUtils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { format } from 'timeago.js';
import { UserActivityItem } from '../activity-item/user-activity-item';
import { UserActivityItemImage } from '../activity-item/user-activity-item-image';
import { UserActivityItemTextField } from '../activity-item/user-activity-item-text-field';
import { UserActivityItemTitle } from '../activity-item/user-activity-item-title';

interface Props {
  event: UserStakedEvent | UserUnStakedEvent | UserRageQuitEvent;
}

const stakeEventNameByType = {
  [EventType.TokensStaked]: 'Staked',
  [EventType.TokensUnStaked]: 'Unstaked',
  [EventType.TokensRageQuit]: 'Rage Quit'
};

export const TokenStakeEvent = ({ event }: Props) => {
  const { user: currentUser } = useOnboardContext();

  const user = getUserToDisplay(
    {
      address: event.userAddress,
      username: event.userUsername,
      displayName: event.userDisplayName
    },
    currentUser?.address || ''
  );

  const title = UserActivityItemTitle({
    title: user.value,
    subtitle: ellipsisAddress(user.address),
    titleRelativeLink: user.link,
    subtitleRelativeLink: user.link
  });

  const avatar = UserActivityItemImage({ src: event.userProfileImage, relativeLink: user.link });
  return (
    <UserActivityItem avatar={avatar} title={title}>
      <>
        <UserActivityItemTextField
          title={'Event'}
          content={stakeEventNameByType[event.type]}
          link={getEtherscanLink(
            { type: EtherscanLinkType.Transaction, transactionHash: event.txHash },
            event.stakerContractChainId
          )}
        />
        <UserActivityItemTextField title={'Amount'} content={`${nFormatter(formatEth(event.amount)) ?? ''}`} />

        {event.type === EventType.TokensRageQuit && (
          <UserActivityItemTextField
            title={'Penalty'}
            content={`${nFormatter(formatEth(event.penaltyAmount)) ?? ''}`}
          />
        )}
        {event.type === EventType.TokensStaked && (
          <UserActivityItemTextField title={'Duration'} content={`${mapDurationToMonths[event.duration]} Months`} />
        )}
        <UserActivityItemTextField title={'Votes'} content={`${nFormatter(event.stakePower) ?? ''}`} />
        <UserActivityItemTextField title={'Date'}>{format(event.timestamp)}</UserActivityItemTextField>
      </>
    </UserActivityItem>
  );
};

import { UserProfileActivityList } from '../feed/user-profile-activity-list';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { shortEventTypes } from '../feed-list/filter-popdown';

interface Props {
  userInfo: UserProfileDto;
}

export const UserPageActivityTab = ({ userInfo }: Props) => {
  return <UserProfileActivityList types={shortEventTypes} userAddress={userInfo?.address} forUserActivity={true} />;
};

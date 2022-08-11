import { UserProfileActivityList } from '../feed/user-profile-activity-list';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';

interface Props {
  userInfo: UserProfileDto;
}

export const UserPageActivityTab = ({ userInfo }: Props) => {
  return (
    <div>{userInfo?.address && <UserProfileActivityList userAddress={userInfo?.address} forUserActivity={true} />}</div>
  );
};

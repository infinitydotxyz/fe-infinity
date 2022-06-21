import { UserProfileActivityList } from '../feed/user-profile-activity-list';
import { UserProfileDto } from './user-profile-dto';

interface Props {
  userInfo: UserProfileDto;
}

export const UserPageActivityTab = ({ userInfo }: Props) => {
  return (
    <div>{userInfo?.address && <UserProfileActivityList userAddress={userInfo?.address} forUserActivity={true} />}</div>
  );
};

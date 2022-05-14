import { UserProfileFeed } from '../feed/user-profile-feed';
import { UserProfileDto } from './user-profile-dto';

interface Props {
  userInfo: UserProfileDto;
}

export const UserPageActivityTab = ({ userInfo }: Props) => {
  return (
    <div>
      {userInfo?.address && <UserProfileFeed header="" userAddress={userInfo?.address} forUserActivity={true} />}
    </div>
  );
};

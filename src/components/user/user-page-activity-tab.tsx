import { FunctionComponent } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { UserProfileFeed } from '../feed/user-profile-feed';

export const UserPageActivityTab: FunctionComponent = () => {
  const { user } = useAppContext();

  return (
    <div>{user?.address && <UserProfileFeed header="Activity" userAddress={user?.address} forActivity={true} />}</div>
  );
};

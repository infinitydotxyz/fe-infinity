import { FunctionComponent } from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { UserProfileFeed } from '../feed/user-profile-feed';

export const UserPageActivityTab: FunctionComponent = () => {
  const { user } = useAppContext();

  return (
    <div>
      {user?.address && (
        <UserProfileFeed
          header="Activity"
          userAddress={'0x7f8e4fd9acf59856ca2f4c94fc4dd46427ca9cc9'}
          forActivity={true}
        />
      )}
    </div>
  );
};

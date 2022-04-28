import { FunctionComponent } from 'react';
import { PageBox } from 'src/components/common';
import { UserPage } from 'src/components/user/user-page';
import { useAppContext } from 'src/utils/context/AppContext';
import { useFetch } from 'src/utils';
import { UserProfileDto } from 'src/components/user/user-profile-dto';

const USER_API_END_POINT = '/user';

const ProfilePage: FunctionComponent = () => {
  const { user } = useAppContext();

  if (!user) {
    return (
      <PageBox title="Account" className="mb-12">
        Please sign in.
      </PageBox>
    );
  }

  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  if (isLoading) {
    return <PageBox title="Loading..."></PageBox>;
  }

  if (isError) {
    console.error(error);
    return (
      <PageBox title="Error" className="mb-12">
        Failed Fetch User Info
      </PageBox>
    );
  }

  const userInfo = result as UserProfileDto;
  return (
    <PageBox title={userInfo.username || userInfo.address} className="pb-12">
      <UserPage userInfo={result as UserProfileDto} isOwner />
    </PageBox>
  );
};

export default ProfilePage;

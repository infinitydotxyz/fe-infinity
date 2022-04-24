import { FunctionComponent } from 'react';
import { Layout } from 'src/components/common';
import { UserPage } from 'src/components/user/user-page';
import { useAppContext } from 'src/utils/context/AppContext';
import { useFetch } from 'src/utils';
import { UserProfileDto } from 'src/components/user/user-profile-dto';

const USER_API_END_POINT = '/user';

const ProfilePage: FunctionComponent = () => {
  const { user } = useAppContext();

  if (!user) return <Layout title={'Account'} className="mb-12"></Layout>;

  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  if (isLoading) {
    return <Layout title="Loading..."></Layout>;
  }

  if (isError) {
    console.error(error);
    return (
      <Layout title={'Error'} className="mb-12">
        Failed Fetch User Info
      </Layout>
    );
  }

  const userInfo = result as UserProfileDto;
  return (
    <Layout title={userInfo.username || userInfo.address} className="pb-12">
      <UserPage userInfo={result as UserProfileDto} isOwner />
    </Layout>
  );
};

export default ProfilePage;

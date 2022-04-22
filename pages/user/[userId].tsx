import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { Layout } from 'src/components/common';
import { useFetch } from 'src/utils';
import { UserPage } from 'src/components/user/user-page';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useAppContext } from 'src/utils/context/AppContext';

const USER_API_END_POINT = '/user';

const UserDetailPage: FunctionComponent = () => {
  const { user } = useAppContext();
  const router = useRouter();
  const { query } = router;

  if (!query.userId) {
    return <Layout title="Loading..."></Layout>;
  }

  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${query.userId}`);

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
    <Layout title={userInfo.username || userInfo.address} className="pb-8">
      <UserPage userInfo={result as UserProfileDto} isOwner={!!(user && user.address === userInfo.address)} />
    </Layout>
  );
};

export default UserDetailPage;

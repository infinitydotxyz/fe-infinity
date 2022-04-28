import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { PageBox } from 'src/components/common';
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
    return <PageBox title="Loading..."></PageBox>;
  }

  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${query.userId}`);

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
    <PageBox title={userInfo.username || userInfo.address} className="pb-8">
      <UserPage userInfo={result as UserProfileDto} isOwner={!!(user && user.address === userInfo.address)} />
    </PageBox>
  );
};

export default UserDetailPage;

import { useRouter } from 'next/router';
import { CenteredContent, PageBox, Spinner } from 'src/components/common';
import { useFetch, USER_API_END_POINT } from 'src/utils';
import { UserPage } from 'src/components/user/user-page';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const UserDetailPage = () => {
  const { user } = useOnboardContext();
  const router = useRouter();
  const { query } = router;

  if (!query.userId) {
    return <PageBox title="Loading..."></PageBox>;
  }

  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${query.userId}`);

  if (isLoading) {
    return (
      <PageBox title="Loading...">
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </PageBox>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <PageBox title="Error" className="mb-12">
        Failed fetching user profile
      </PageBox>
    );
  }

  const userInfo = result as UserProfileDto;
  return (
    <PageBox title={userInfo.username || userInfo.address} showTitle={false} className="pb-8">
      <UserPage userInfo={result as UserProfileDto} isOwner={!!(user && user.address === userInfo.address)} />
    </PageBox>
  );
};

export default UserDetailPage;

import { useRouter } from 'next/router';
import { CenteredContent, PageBox, Spinner } from 'src/components/common';
import { UserPage } from 'src/components/user/user-page';
import { useAppContext, User } from 'src/utils/context/AppContext';
import { PleaseConnectMsg, useFetch } from 'src/utils';
import { UserProfileDto } from 'src/components/user/user-profile-dto';

const USER_API_END_POINT = '/user';

const ProfilePage = () => {
  const router = useRouter();
  const {
    query: { address }
  } = router;
  const { user } = useAppContext();

  if (!address) {
    return null;
  }
  const isMyProfile = address === 'me';
  if (isMyProfile && !user) {
    return (
      <PageBox title="Account" className="mb-12">
        <PleaseConnectMsg />
      </PageBox>
    );
  }

  return <ProfilePageContents userAddress={isMyProfile ? `${user?.address ?? ''}` : `${address ?? ''}`} user={user} />;
};

// ================================================

interface Props {
  user: User | null;
  userAddress: string;
}

const ProfilePageContents = ({ user, userAddress }: Props) => {
  const { result, isLoading, isError, error } = useFetch(`${USER_API_END_POINT}/${userAddress}`);

  if (isLoading) {
    return (
      <PageBox title="Loading..." showTitle={false}>
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
        Failed fetching profile
      </PageBox>
    );
  }

  const userInfo = result as UserProfileDto;
  userInfo.address = userInfo.address || userAddress;

  const isOwner = user?.address === userInfo.address;

  return (
    <PageBox showTitle={false} title={userInfo.username || userInfo.address}>
      <UserPage userInfo={userInfo} isOwner={isOwner} />
    </PageBox>
  );
};

export default ProfilePage;

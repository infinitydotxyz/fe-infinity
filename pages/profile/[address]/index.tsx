import { useRouter } from 'next/router';
import { CenteredContent, PageBox, Spinner } from 'src/components/common';
import { UserPage } from 'src/components/user/user-page';
import { User } from 'src/utils/context/AppContext';
import { PleaseConnectMsg, useFetch, USER_API_END_POINT } from 'src/utils';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { APageBox } from 'src/components/astra/astra-page-box';

const ProfilePage = () => {
  const router = useRouter();
  const {
    query: { address }
  } = router;
  const { user } = useOnboardContext();

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

  const userInfo = (result ?? {}) as UserProfileDto;
  userInfo.address = userInfo?.address || userAddress;

  const isOwner = user?.address === userInfo.address;

  return (
    <APageBox showTitle={false} title="">
      <UserPage userInfo={userInfo} isOwner={isOwner} />
    </APageBox>
  );
};

export default ProfilePage;

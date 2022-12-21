import { useRouter } from 'next/router';
import { CenteredContent, Spinner } from 'src/components/common';
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
      <APageBox title="Account" className="mb-12">
        <PleaseConnectMsg />
      </APageBox>
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
      <APageBox title="Loading..." showTitle={false}>
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </APageBox>
    );
  }

  if (isError) {
    console.error(error);
    return (
      <APageBox title="Error" className="mb-12">
        Failed fetching profile
      </APageBox>
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

import { AccountSettingsPage } from 'src/components/user/profile-settings';
import { PageBox } from 'src/components/common';
import { useAppContext, User } from 'src/utils/context/AppContext';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useFetch } from 'src/utils';

const USER_API_END_POINT = '/user';

const AccountSettings = () => {
  const { user, chainId } = useAppContext();

  if (!user) {
    return <PageBox title="Account Settings"></PageBox>;
  }

  return <AccountSettingsContent user={user} chainId={chainId} />;
};

// ==============================================

interface Props {
  user: User;
  chainId: string;
}

const AccountSettingsContent = ({ user, chainId }: Props) => {
  const { result, isLoading } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  if (isLoading) {
    return <PageBox title="Loading..."></PageBox>;
  }

  return (
    <PageBox title="Account" showTitle={false} className="pb-8">
      <AccountSettingsPage user={user} chainId={chainId} userInfo={result as UserProfileDto} />
    </PageBox>
  );
};

export default AccountSettings;

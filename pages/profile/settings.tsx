import { AccountSettingsPage } from 'src/components/user/profile-settings';
import { CenteredContent, PageBox, Spinner } from 'src/components/common';
import { User } from 'src/utils/context/AppContext';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useFetch, USER_API_END_POINT } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

const AccountSettings = () => {
  const { user, chainId } = useOnboardContext();

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
    return (
      <PageBox title="Loading..." showTitle={false}>
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </PageBox>
    );
  }

  return (
    <PageBox title="Account" showTitle={false} className="pb-8">
      <AccountSettingsPage user={user} chainId={chainId} userInfo={result as UserProfileDto} />
    </PageBox>
  );
};

export default AccountSettings;

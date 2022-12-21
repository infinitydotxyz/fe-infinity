import { AccountSettingsPage } from 'src/components/user/profile-settings';
import { CenteredContent, Spinner } from 'src/components/common';
import { User } from 'src/utils/context/AppContext';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user';
import { useFetch, USER_API_END_POINT } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { APageBox } from 'src/components/astra/astra-page-box';

const AccountSettings = () => {
  const { user, chainId } = useOnboardContext();

  if (!user) {
    return <APageBox title="Account Settings"></APageBox>;
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
      <APageBox title="Loading..." showTitle={false}>
        <CenteredContent>
          <Spinner />
        </CenteredContent>
      </APageBox>
    );
  }

  return (
    <APageBox title="Account" showTitle={false} className="pb-8">
      <AccountSettingsPage user={user} chainId={chainId} userInfo={result as UserProfileDto} />
    </APageBox>
  );
};

export default AccountSettings;

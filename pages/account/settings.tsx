import { FunctionComponent } from 'react';
import Head from 'next/head';
import { AccountSettingsPage } from 'src/components/user/account-settings';
import { Layout } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { UserProfileDto } from 'src/components/user/user-profile-dto';
import { useFetch } from 'src/utils';

const USER_API_END_POINT = '/user';

const AccountSettings: FunctionComponent = () => {
  const { user, chainId } = useAppContext();

  if (!user) {
    return <Layout title="Account Settings"></Layout>;
  }

  const { result, isLoading } = useFetch(`${USER_API_END_POINT}/${user.address}`);

  if (isLoading) {
    return <Layout title="Loading..."></Layout>;
  }

  return (
    <div className="pb-8">
      <Head>
        <title>Account Settings</title>
      </Head>
      <AccountSettingsPage user={user} chainId={chainId} userInfo={result as UserProfileDto} />
    </div>
  );
};

export default AccountSettings;

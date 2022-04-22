import { FunctionComponent } from 'react';
import { AccountSettingsPage } from 'src/components/user/account-settings';
import { Layout } from 'src/components/common';

const AccountSettings: FunctionComponent = () => {
  return (
    <Layout title="Account Settings" className="pb-8">
      <AccountSettingsPage />
    </Layout>
  );
};

export default AccountSettings;

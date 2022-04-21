import { FunctionComponent } from 'react';
import { AccountSettingsPage } from 'src/components/account/account-settings';
import { Layout } from 'src/components/common';
const AccountSettings: FunctionComponent = () => {
  return (
    <Layout title="Account Settings">
      <AccountSettingsPage />
    </Layout>
  );
};

export default AccountSettings;

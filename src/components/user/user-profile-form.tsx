import { FunctionComponent } from 'react';
import { TextInputBox, TextAreaBox } from 'src/components/common';

export const UserProfileForm: FunctionComponent = () => {
  return (
    <div>
      <TextInputBox bind="displayName" type="text" label="Display name" placeholder="Display Name" />
      <TextInputBox bind="username" type="text" label="Username" placeholder="User Name" />
      <TextAreaBox bind="bio" label="Description" placeholder="Description" rows={8} />
    </div>
  );
};

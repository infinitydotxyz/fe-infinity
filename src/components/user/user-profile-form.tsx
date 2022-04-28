import { FunctionComponent } from 'react';
import { TextAreaForm, TextInputForm } from 'src/components/common';

export const UserProfileForm: FunctionComponent = () => {
  return (
    <div>
      <TextInputForm bind="displayName" type="text" label="Display name" placeholder="Display Name" />
      <TextInputForm bind="username" type="text" label="Username" placeholder="User Name" />
      <TextAreaForm bind="bio" label="Description" placeholder="Description" rows={8} />
    </div>
  );
};

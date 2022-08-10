import { TextAreaForm, TextInputForm } from 'src/components/common';

export const UserProfileForm = () => {
  return (
    <div>
      <TextInputForm bind="displayName" type="text" label="Display name" placeholder="Enter display name" />
      <TextInputForm bind="username" type="text" label="Username" placeholder="Enter user name" />
      <TextAreaForm bind="bio" label="Description" placeholder="Enter description" rows={8} />
    </div>
  );
};

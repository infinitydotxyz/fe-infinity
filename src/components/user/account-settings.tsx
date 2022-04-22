import { FunctionComponent, useState } from 'react';
import { Button } from '../common';

import { User } from 'src/utils/context/AppContext';
import { apiPut } from 'src/utils';

import { ProfileImageUpload } from './profile-image-upload';
import { UserProfileDto } from './user-profile-dto';
import { ProfileBannerImageUpload } from './profile-banner-image-upload';

interface AccountSettingsProps {
  user: User;
  userInfo: UserProfileDto;
  chainId: string;
}

export const AccountSettingsPage: FunctionComponent<AccountSettingsProps> = (props) => {
  const { user, chainId } = props;
  const [userInfo, setUserInfo] = useState(props.userInfo);

  const IMAGE_UPLOAD_PATH = `/user/${chainId}:${user.address}/images`;

  const handleProfileImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    await apiPut(IMAGE_UPLOAD_PATH, { data: formData });
  };

  const handleProfileImageRemove = async () => {
    await apiPut(IMAGE_UPLOAD_PATH, { data: { deleteProfileImage: true } });
  };

  const handleBannerImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('bannerImage', file);
    await apiPut(IMAGE_UPLOAD_PATH, { data: formData });
  };

  const handleBannerImageRemove = async () => {
    await apiPut(IMAGE_UPLOAD_PATH, { data: { deleteBannerImage: true } });
  };

  return (
    <div className="flex flex-col bg-white max-w-2xl mx-auto  px-4 sm:px-12  rounded-3xl">
      <div className="mt-12">
        <ProfileImageUpload
          onUpload={handleProfileImageUpload}
          onDelete={handleProfileImageRemove}
          imgSource={userInfo.profileImage}
        />
        <ProfileBannerImageUpload
          onUpload={handleBannerImageUpload}
          onDelete={handleBannerImageRemove}
          imgSource={userInfo.profileImage}
        />
      </div>
      <div className="sm:grid sm:grid-cols-2 sm:gap-2 mt-6">
        <Button variant="primary" className="py-2.5 w-full">
          Done
        </Button>
        <Button variant="outline" className="py-2.5 w-full" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

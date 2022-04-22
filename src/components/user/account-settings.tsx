import { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../common';
import { Formik, Form } from 'formik';

import { User } from 'src/utils/context/AppContext';
import { apiPut } from 'src/utils';

import { ProfileImageUpload } from './profile-image-upload';
import { UserProfileDto } from './user-profile-dto';
import { ProfileBannerImageUpload } from './profile-banner-image-upload';
import { UserProfileForm } from './user-profile-form';
import { UserProfileSchema } from './schemas/user-profile-schema';
// import { UserWalletForm } from './user-wallet-form';

interface AccountSettingsProps {
  user: User;
  userInfo: UserProfileDto;
  chainId: string;
}

export const AccountSettingsPage: FunctionComponent<AccountSettingsProps> = (props) => {
  const { user, chainId } = props;
  const router = useRouter();
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

  const handleSubmit = async (values: UserProfileDto) => {
    const {
      displayName,
      username,
      bio,
      discordUsername = '',
      twitterUsername = '',
      instagramUsername = '',
      facebookUsername = ''
    } = values;
    const { error } = await apiPut(`/user/${user.address}`, {
      data: { displayName, username, bio, discordUsername, twitterUsername, instagramUsername, facebookUsername }
    });
    if (error) {
      console.error(error);
    } else {
      setUserInfo({
        ...userInfo,
        displayName,
        username,
        bio,
        discordUsername,
        twitterUsername,
        instagramUsername,
        facebookUsername
      });
    }
  };

  return (
    <div className="flex flex-col bg-white max-w-3xl mx-auto  px-4 sm:px-12  rounded-3xl">
      <div className="mt-12">
        <ProfileImageUpload
          onUpload={handleProfileImageUpload}
          onDelete={handleProfileImageRemove}
          imgSource={userInfo.profileImage}
        />
      </div>
      <h2 className="font-body text-4xl mt-20 mb-4 font-bold">Edit Profile</h2>
      <Formik
        initialValues={userInfo}
        validationSchema={UserProfileSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          await handleSubmit(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <UserProfileForm />
            <div className="mt-12">
              <ProfileBannerImageUpload
                onUpload={handleBannerImageUpload}
                onDelete={handleBannerImageRemove}
                imgSource={userInfo.profileImage}
              />
            </div>
            {/* <h2 className="font-body text-4xl mt-10 mb-10 font-bold">Wallets</h2> */}
            {/* <UserWalletForm /> */}
            <div className="sm:grid sm:grid-cols-2 sm:gap-2 mt-10">
              <Button variant="primary" className="py-2.5 w-full" type="submit" disabled={isSubmitting}>
                Save
              </Button>
              <Button
                variant="outline"
                className="py-2.5 w-full"
                onClick={() => {
                  router.push('/account');
                }}
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

import { FunctionComponent, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from 'src/components/common';
import { Formik, Form } from 'formik';

import { User } from 'src/utils/context/AppContext';
import { apiPut } from 'src/utils';

import { ProfileImageUpload } from './profile-image-upload';
import { UserProfileDto } from './user-profile-dto';
import { ProfileBannerImageUpload } from './profile-banner-image-upload';
import { UserProfileForm } from './user-profile-form';
import { getUserProfileSchema } from './schemas/user-profile-schema';
// import { UserWalletForm } from './user-wallet-form';

interface AccountSettingsProps {
  user: User;
  userInfo: UserProfileDto;
  chainId: string;
}

export const AccountSettingsPage: FunctionComponent<AccountSettingsProps> = (props) => {
  const { user } = props;
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(props.userInfo);

  const IMAGE_UPLOAD_PATH = `/user/${user.address}/images`;

  const handleProfileImageUpload = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    await apiPut(IMAGE_UPLOAD_PATH, { data: formData });
  };

  const handleProfileImageRemove = async () => {
    await apiPut(IMAGE_UPLOAD_PATH, { data: { deleteProfileImage: true } });
  };

  const handleBannerImageUpload = async (file: File | Blob) => {
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

    const postBody: { [key: string]: string | undefined } = {
      displayName,
      username,
      bio,
      discordUsername,
      twitterUsername,
      instagramUsername,
      facebookUsername
    };

    Object.keys(postBody).forEach((key) => {
      if (postBody[key] === '' || postBody[key] === undefined) {
        delete postBody[key];
      }
    });

    const { error } = await apiPut(`/user/${user.address}`, {
      data: postBody
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
    <Formik
      initialValues={userInfo}
      validationSchema={getUserProfileSchema({ user })}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true);
        await handleSubmit(values);
        setSubmitting(false);

        // go back
        router.push('/profile');
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row justify-end my-12">
            <Button
              variant="outline"
              className="py-2.5 mx-3 w-auto font-zagmamono"
              onClick={() => {
                router.push('/profile');
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" className="py-2.5 w-auto font-zagmamono" type="submit" disabled={isSubmitting}>
              Save
            </Button>
          </div>
          <div className="flex flex-col bg-white max-w-3xl mx-auto px-4 sm:px-12 rounded-3xl">
            <div className="mt-12">
              <ProfileImageUpload
                onUpload={handleProfileImageUpload}
                onDelete={handleProfileImageRemove}
                imgSource={userInfo.profileImage}
              />
            </div>
            {/* <h2 className="font-body text-4xl mt-20 mb-4 font-bold">Edit Profile</h2> */}

            <UserProfileForm />
            <div className="mt-4 mb-12">
              <h3 className="font-body text-2xl mt-10 mb-10 font-bold">Header photo</h3>
              <ProfileBannerImageUpload
                onUpload={handleBannerImageUpload}
                onDelete={handleBannerImageRemove}
                imgSource={userInfo.bannerImage}
              />
            </div>
            {/* <h2 className="font-body text-4xl mt-10 mb-10 font-bold">Wallets</h2> */}
            {/* <UserWalletForm /> */}
          </div>
        </Form>
      )}
    </Formik>
  );
};

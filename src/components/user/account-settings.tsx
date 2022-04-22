import * as React from 'react';
import { Dialog } from '@headlessui/react';
import clsx from 'classnames';
import { Button, RoundedNav, TextInputBox, TextAreaBox } from '../common';
import { FaPlus, FaDiscord, FaTwitter, FaTelegram, FaFacebook } from 'react-icons/fa';
import { BiPlus } from 'react-icons/bi';

import { useAppContext } from 'src/utils/context/AppContext';
import { apiPut } from 'src/utils';

import { ProfileImageUpload } from './profile-image-upload';
import { ProfileBannerImageUpload } from './profile-banner-image-upload';

export const AccountSettingsPage: React.FunctionComponent = () => {
  const [displayName, setDisplayName] = React.useState('Sandy K.');
  const [userName, setUserName] = React.useState('sandyk567');
  const [bio, setBio] = React.useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  );

  const { user, chainId } = useAppContext();

  if (!user) {
    return <div> Please connect your wallet </div>;
  }

  const IMAGE_UPLOAD_PATH = `/user/${chainId}:${user.address}/images`;

  const handleProfileImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('profileImage', file);
    await apiPut(IMAGE_UPLOAD_PATH, { data: formData });
  };

  return (
    <div className="flex flex-col bg-white max-w-2xl mx-auto  px-4 sm:px-12  rounded-3xl">
      <div className="pl-2 mt-12">
        <div>
          <ProfileImageUpload onUpload={handleProfileImageUpload} />
          <h2 className="font-body text-4xl mt-20 mb-10">Edit Profile</h2>
          <div className="mt-4">
            <div className="my-6">
              <TextInputBox
                type="text"
                value={displayName}
                label="Display Name"
                placeholder=""
                onChange={(value) => {
                  setDisplayName(value as string);
                }}
              />
            </div>
            <div className="my-6">
              <TextInputBox
                type="text"
                value={userName}
                label="Username"
                placeholder=""
                onChange={(value) => {
                  setUserName(value as string);
                }}
              />
            </div>
            <div className="my-6">
              <TextAreaBox
                value={bio}
                label="Bio"
                rows={3}
                placeholder=""
                onChange={(value) => {
                  setBio(value as string);
                }}
              />
            </div>
          </div>
          <div className="flex mt-4 my-6 items-center">
            <div className="w-full h-32 rounded-md overflow-hidden">
              <ProfileBannerImageUpload />
            </div>
            <div className="pl-4">
              <Button variant="primary" className="py-2.5 w-44 px-12 mb-2 block">
                Upload
              </Button>
              <Button variant="outline" className="py-2 w-44 px-12 block">
                Delete
              </Button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-body text-4xl mt-20 mb-10">Wallets</h2>
          <div className="my-4">
            <TextInputBox
              type="text"
              value={userName}
              label="Address or ENS Name"
              placeholder=""
              onChange={(value) => {
                setUserName(value as string);
              }}
            />
          </div>
          <div className="my-4">
            <TextInputBox
              type="text"
              value={userName}
              label="Address or ENS Name"
              placeholder=""
              onChange={(value) => {
                setUserName(value as string);
              }}
            />
          </div>
          <Button variant="primary" className="w-full">
            <span className="flex items-center w-full text-center">
              <span className="pr-4">Add Wallet</span> <BiPlus />
            </span>
          </Button>
        </div>
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

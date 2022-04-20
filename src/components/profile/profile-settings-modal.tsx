import * as React from 'react';
import { Dialog } from '@headlessui/react';
import clsx from 'classnames';
import { Button, RoundedNav, TextInputBox, TextAreaBox } from '../common';
import { ProfileImage } from './profile-image';
import { ProfileBackground } from './profile-background';
import { FaPlus, FaDiscord, FaTwitter, FaTelegram, FaFacebook } from 'react-icons/fa';
import { BiPlus } from 'react-icons/bi';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  close: () => void;
}

export const ProfileSettingsModal: React.FunctionComponent<ProfileSettingsModalProps> = ({ isOpen, close }) => {
  const [currentTab, setCurrentTab] = React.useState(0);

  const [displayName, setDisplayName] = React.useState('Sandy K.');
  const [userName, setUserName] = React.useState('sandyk567');
  const [bio, setBio] = React.useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.'
  );

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      as="div"
      className={clsx('fixed inset-0 z-50 flex items-center justify-center overflow-y-auto', {
        'bg-gray-800 bg-opacity-75': isOpen === true
      })}
    >
      <div className="flex flex-col bg-white sm:w-128 py-12 sm:py-16 px-4 sm:px-12  rounded-3xl shadow-md ">
        <Dialog.Overlay />

        <Dialog.Title className="text-black font-heading text-2xl">Edit Profile</Dialog.Title>

        <RoundedNav
          items={[{ title: 'You' }, { title: 'Wallets' }, { title: 'Social' }]}
          onChange={(currentTab) => setCurrentTab(currentTab)}
          className="mt-4 -ml-2 w-full"
        />
        <div className="pl-2 mt-12">
          {currentTab === 0 && (
            <div>
              <div className="flex items-center justify-between">
                <label className="font-body">Profile Picture</label>
                <ProfileImage className="w-16 h-16" />
              </div>
              <div className="mt-4 -ml-1">
                <div className="my-4">
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
                <div className="my-4">
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
                <div className="my-4">
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
              <div className="mt-4">
                <label className="font-body">Background</label>
                <div className="w-full h-24 rounded-md overflow-hidden">
                  <ProfileBackground />
                </div>
              </div>
            </div>
          )}
          {currentTab === 1 && (
            <div>
              <label className="font-body">Wallets</label>
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
              <Button variant="plain">
                <span className="flex items-center">
                  <BiPlus /> <span className="pl-4">Add another</span>
                </span>
              </Button>
            </div>
          )}
          {currentTab === 2 && (
            <div>
              <label className="font-body">Social</label>

              <div className="my-4">
                <TextInputBox
                  type="text"
                  icon={<FaDiscord className="text-xl" />}
                  value={userName}
                  label="Discord Username"
                  placeholder=""
                  onChange={(value) => {
                    setUserName(value as string);
                  }}
                />
              </div>
              <div className="my-4">
                <TextInputBox
                  type="text"
                  icon={<FaTwitter className="text-xl" />}
                  value={userName}
                  label="Twitter Username"
                  placeholder=""
                  onChange={(value) => {
                    setUserName(value as string);
                  }}
                />
              </div>
              <div className="my-4">
                <TextInputBox
                  type="text"
                  icon={<FaTelegram className="text-xl" />}
                  value={userName}
                  label="Telegram Username"
                  placeholder=""
                  onChange={(value) => {
                    setUserName(value as string);
                  }}
                />
              </div>
              <div className="my-4">
                <TextInputBox
                  type="text"
                  icon={<FaFacebook className="text-xl" />}
                  value={userName}
                  label="Facebook Username"
                  placeholder=""
                  onChange={(value) => {
                    setUserName(value as string);
                  }}
                />
              </div>
            </div>
          )}
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
    </Dialog>
  );
};

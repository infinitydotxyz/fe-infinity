import { FunctionComponent } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FaShareAlt } from 'react-icons/fa';

import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  InstapaperShareButton,
  InstapaperIcon,
  WhatsappShareButton,
  WhatsappIcon
} from 'react-share';

interface UserProfileShareProps {
  userAddress?: string;
}

export const UserProfileShare: FunctionComponent<UserProfileShareProps> = ({ userAddress }) => {
  const profileLink = `${window.location.origin}/user/${userAddress}`;

  return (
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <Menu.Button>
              <div className="flex justify-center items-center m-1 font-medium font-heading px-4 h-[50px] rounded-full border border-gray-300 cursor-pointer hover:bg-gray-200 ">
                <FaShareAlt className="text-md" />
                <div className="pl-2">Share</div>
              </div>
            </Menu.Button>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute mt-2 pl-8 pr-0 pt-4 pb-4 w-72 origin-top-right divide-y divide-gray-100 rounded-3xl border border-gray-200 bg-white shadow-2xl outline-none">
                <div className="flex flex-wrap gap-4">
                  <EmailShareButton subject="Infinity User Profile" body={'Infinity User Profile'} url={profileLink}>
                    <EmailIcon size={32} />
                  </EmailShareButton>
                  <FacebookShareButton url={profileLink}>
                    <FacebookIcon size={32} />
                  </FacebookShareButton>
                  <TwitterShareButton url={profileLink}>
                    <TwitterIcon size={32} />
                  </TwitterShareButton>
                  <InstapaperShareButton url={profileLink}>
                    <InstapaperIcon size={32} />
                  </InstapaperShareButton>
                  <WhatsappShareButton url={profileLink}>
                    <WhatsappIcon size={32} />
                  </WhatsappShareButton>
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

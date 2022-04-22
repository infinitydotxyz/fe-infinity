import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { UserProfileDto } from './user-profile-dto';
import { UserBannerImage } from './user-banner-image';
import { UserProfileImage } from './user-profile-image';
import { UserWatchList } from './user-watch-list';
import { UserProfileShare } from './user-profile-share';
import { UserProfileTab } from './user-profile-tab';
import { Chip } from 'src/components/common';
import { FaPen } from 'react-icons/fa';

interface UserPageProps {
  userInfo: UserProfileDto;
  isOwner?: boolean;
}

export const UserPage: FunctionComponent<UserPageProps> = ({ userInfo, isOwner = false }) => {
  const router = useRouter();

  return (
    <>
      <UserBannerImage imgSrc={userInfo.bannerImage} isOwner={isOwner} />
      <div className="flex flex-col mx-auto px-4 lg:px-32 translate-x-1 -mt-16">
        <UserProfileImage imgSrc={userInfo.profileImage} isOwner={isOwner} />
        <h2 className="my-6 font-heading text-6xl">{userInfo.displayName || 'No Display Name'}</h2>
        <div className="flex flex-wrap font-heading -ml-3 mb-8">
          <p className="leading-wide mx-4 font-bold">@{userInfo.username || 'no-username'}</p>
          <UserWatchList userWatchList={[userInfo.address, userInfo.address]} />
        </div>
        <div className="my-4 -ml-2 flex flex-wrap">
          {isOwner && (
            <Chip
              content={
                <span className="flex items-center">
                  <FaPen className="text-md" />
                  <span className="pl-2">Edit profile</span>
                </span>
              }
              onClick={() => {
                router.push(`/account/settings`);
              }}
            />
          )}
          <UserProfileShare />
        </div>
        <p className="text-theme-light-800 mt-8 ml-1 max-w-md">{userInfo.bio || '---'}</p>
        <UserProfileTab />
      </div>
    </>
  );
};

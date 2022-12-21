import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { UserProfileShare } from './user-profile-share';
import { ToggleTab, useToggleTab, ExternalLink } from 'src/components/common';
import { UserPageNftsTab } from './user-page-nfts-tab';
import { UserPageActivityTab } from './user-page-activity-tab';
import { ellipsisAddress } from 'src/utils';
import { ETHEREUM_CHAIN_SCANNER_BASE } from '@infinityxyz/lib-frontend/utils';
import { UserPageOrderList } from '../feed/user-page-order-list';
import { UserBannerImage } from './user-banner-image';
import { UserProfileImage } from './user-profile-image';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto/user/user-profile.dto';
import { twMerge } from 'tailwind-merge';
import { textClr } from 'src/utils/ui-constants';
import { AOutlineButton } from '../astra';

interface UserPageProps {
  userInfo: UserProfileDto;
  isOwner?: boolean;
}

export const UserPage: FunctionComponent<UserPageProps> = ({ userInfo, isOwner = false }) => {
  const router = useRouter();
  let tabs = [];

  if (isOwner) {
    tabs = ['Collected', 'Orders', 'Activity', 'Send'];
  } else {
    tabs = ['Collected', 'Activity'];
  }

  tabs.push('Curated');
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'Collected');

  return (
    <div className="overflow-y-auto overflow-x-clip">
      <ProfilePageHeader userInfo={userInfo} isOwner={isOwner} />

      <div className={twMerge(textClr, 'relative flex flex-col')}>
        <h2 className="my-2 text-6xl font-body">{userInfo.displayName || 'No Display Name'}</h2>

        <div className="flex flex-wrap font-heading -ml-3 mb-8">
          <span className="leading-wide ml-4 font-bold">@{userInfo.username || 'no-username'}</span>
          <ExternalLink
            href={`${ETHEREUM_CHAIN_SCANNER_BASE}/address/${userInfo.address}`}
            className="leading-wide font-bold ml-8"
          >
            {ellipsisAddress(userInfo.address)}
          </ExternalLink>
          {userInfo.createdAt && (
            <span className="leading-wide ml-8 text-gray-500">
              Joined {new Date(userInfo.createdAt ?? '').toLocaleDateString()}
            </span>
          )}

          {/* <UserWatchList userWatchList={[userInfo.address, userInfo.address]} /> */}
        </div>
        <div className="my-2 flex flex-wrap items-center space-x-3">
          {isOwner && (
            <AOutlineButton
              onClick={() => {
                router.push(`/profile/settings`);
              }}
            >
              Edit
            </AOutlineButton>
          )}
          <UserProfileShare username={userInfo.username} userAddress={userInfo.address} />
        </div>
        {userInfo.bio && <p className="text-theme-light-800 mt-8 ml-1 max-w-md">{userInfo.bio || ''}</p>}

        <ToggleTab small className="mt-14 " options={options} selected={selected} onChange={onChange} />

        <div className="mt-6 min-h-[50vh] pointer-events-none">
          {selected === 'Collected' && <UserPageNftsTab userInfo={userInfo} />}
          {selected === 'Orders' && <UserPageOrderList userInfo={userInfo} />}
          {selected === 'Activity' && <UserPageActivityTab userInfo={userInfo} />}
          {selected === 'Send' && <UserPageNftsTab userInfo={userInfo} forTransfers={true} />}
        </div>
      </div>
    </div>
  );
};

// ================================================================

interface Props2 {
  userInfo: UserProfileDto;
  isOwner: boolean;
}

export const ProfilePageHeader = ({ userInfo, isOwner }: Props2) => {
  return (
    <div className="relative w-full mb-20">
      <UserBannerImage imgSrc={userInfo.bannerImage} isOwner={isOwner} />

      <div className="absolute -bottom-16 left-10 w-full">
        <UserProfileImage imgSrc={userInfo.profileImage} isOwner={isOwner} />
      </div>
    </div>
  );
};

import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';
import { UserProfileDto } from './user-profile-dto';
import { UserProfileShare } from './user-profile-share';
import { Chip, ToggleTab, useToggleTab, ExternalLink } from 'src/components/common';
import { UserPageNftsTab } from './user-page-nfts-tab';
import { UserPageActivityTab } from './user-page-activity-tab';
import { ellipsisAddress, isProd } from 'src/utils';
import { ETHEREUM_CHAIN_SCANNER_BASE } from '@infinityxyz/lib-frontend/utils';
import { UserPageOrderList } from '../feed/user-page-order-list';
import { UserBannerImage } from './user-banner-image';
import { UserProfileImage } from './user-profile-image';
import { UserPageCuratedTab } from './user-page-curated-tab';

interface UserPageProps {
  userInfo: UserProfileDto;
  isOwner?: boolean;
}

export const UserPage: FunctionComponent<UserPageProps> = ({ userInfo, isOwner = false }) => {
  const router = useRouter();
  let tabs = [];
  if (!isProd()) {
    tabs = ['Collected', 'Curated', 'Orders', 'Activity'];
  } else {
    tabs = ['Collected', 'Orders', 'Activity'];
  }
  if (isOwner) {
    tabs.push('Send');
  }
  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'Collected');

  return (
    <>
      <ProfilePageHeader userInfo={userInfo} isOwner={isOwner} />

      <div className="relative flex flex-col">
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
        <div className="my-2 -ml-2 flex flex-wrap">
          {isOwner && (
            <Chip
              content="Edit"
              onClick={() => {
                router.push(`/profile/settings`);
              }}
            />
          )}
          <UserProfileShare username={userInfo.username} userAddress={userInfo.address} />
        </div>
        {userInfo.bio && <p className="text-theme-light-800 mt-8 ml-1 max-w-md">{userInfo.bio || ''}</p>}

        <ToggleTab
          className="mt-14 -ml-2 font-heading pointer-events-auto"
          tabWidth="150px"
          options={options}
          selected={selected}
          onChange={onChange}
        />

        <div className="mt-6 min-h-[1024px] pointer-events-none">
          {selected === 'Collected' && <UserPageNftsTab userInfo={userInfo} />}
          {selected === 'Orders' && <UserPageOrderList userInfo={userInfo} />}
          {selected === 'Activity' && <UserPageActivityTab userInfo={userInfo} />}
          {selected === 'Send' && <UserPageNftsTab userInfo={userInfo} forTransfers={true} />}
          {!isProd() && selected === 'Curated' && <UserPageCuratedTab userInfo={userInfo} />}
        </div>
      </div>
    </>
  );
};

// ================================================================

interface Props2 {
  userInfo: UserProfileDto;
  isOwner: boolean;
}

export const ProfilePageHeader = ({ userInfo, isOwner }: Props2) => {
  return (
    <div className="relative w-screen mb-20" style={{ marginLeft: 'calc(-1 * ((100vw - 100%) / 2))' }}>
      <UserBannerImage imgSrc={userInfo.bannerImage} isOwner={isOwner} />

      <div className="absolute -bottom-16 left-10 w-full">
        <UserProfileImage imgSrc={userInfo.profileImage} isOwner={isOwner} />
      </div>
    </div>
  );
};

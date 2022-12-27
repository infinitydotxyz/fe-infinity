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

  const { options, onChange, selected } = useToggleTab(tabs, (router?.query?.tab as string) || 'Collected');

  return (
    <div className="overflow-y-auto overflow-x-clip">
      <div className={twMerge(textClr, 'relative flex flex-col')}>
        <div className="my-4 space-x-4 flex flex-row items-center">
          <h2 className="text-4xl font-body">
            <ExternalLink href={`${ETHEREUM_CHAIN_SCANNER_BASE}/address/${userInfo.address}`} className="font-bold">
              {ellipsisAddress(userInfo.address)}
            </ExternalLink>
          </h2>
          <UserProfileShare username={userInfo.username} userAddress={userInfo.address} />
        </div>

        <ToggleTab small className="mt-6" options={options} selected={selected} onChange={onChange} />

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

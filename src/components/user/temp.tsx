import { FunctionComponent, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, ReadMoreText, RoundedNav } from 'src/components/common';
import { BLANK_IMAGE_URL, useFetch } from 'src/utils';
import { Token, Collection } from '@infinityxyz/lib/types/core';
import { Layout } from 'src/components/common/layout';
import { useRouter } from 'next/router';
import { ShortAddress } from 'src/components/common';

import {
  TraitList,
  ActivityList,
  ListModal,
  CancelModal,
  TransferNFTModal,
  PlaceBidModal,
  MakeOfferModal
} from 'src/components/asset';

import BlueCheckSvg from 'src/images/blue-check.svg';
// import {HiOutlineSwitchHorizontal} from 'react-icons';

import {
  FaEdit,
  FaCaretDown,
  FaCaretUp,
  FaDiscord,
  FaInstagram,
  FaTwitter,
  FaPen,
  FaFacebook,
  FaShareAlt,
  FaLink
} from 'react-icons/fa';

import { CollectionStats, BaseCollection } from '@infinityxyz/lib/types/core';
import { GalleryBox } from 'src/components/gallery/gallery-box';
import { ActivityTab } from 'src/components/collection/activity-tab';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { CommunityRightPanel } from 'src/components/collection/community-right-panel';
import { useAppContext } from 'src/utils/context/AppContext';
import { Chip } from 'src/components/common';
import { ellipsisAddress } from 'src/utils';
import { Dropdown } from 'src/components/common';
import { BiCaretDown, BiCaretUp } from 'react-icons/bi';
import { AccountSettingsModal } from 'src/components/account/account-settings-modal';
import { ProfileImage } from 'src/components/account/profile-image';
import { ProfileBackground } from 'src/components/account/profile-background';

const AccountPage: FunctionComponent = () => {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState(0);

  const name = 'boredapeyachtclub';
  const path = `/collections/${name}`;

  const [IsOpenSettings, setOpenSettings] = useState<boolean>(false);

  const { result: collection } = useFetch<BaseCollection>(name ? path : '', { chainId: '1' });

  const { result: dailyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path + '/stats?limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=daily'
      : '',
    { chainId: '1' }
  );
  const { result: weeklyStats } = useFetch<{ data: CollectionStats[] }>(
    name
      ? path + '/stats?limit=10&orderBy=volume&orderDirection=desc&minDate=0&maxDate=2648764957623&period=weekly'
      : '',
    { chainId: '1' }
  );

  const { user } = useAppContext();

  if (!user) {
    return <div>'Please Connect Your Wallet';</div>;
  }

  return (
    <Layout title={'profile'} className="mb-12">
      <div className="h-48 lg:h-56 xl:h-64 overflow-hidden bg-theme-light-200">
        <ProfileBackground />
      </div>
      <div className="flex flex-col mx-auto px-4 lg:px-32 translate-x-1 -mt-11">
        <ProfileImage className="w-24 h-24" />
        <h2 className="my-6 font-heading text-6xl">Sandy K.</h2>
        <div className="flex flex-wrap font-heading -mx-4">
          <p className="leading-wide mx-4">
            <b>@sandyK</b>
          </p>
          <p className="leading-wide mx-4">
            <Dropdown
              toggler={
                <span className="flex items-center">
                  <b>{ellipsisAddress(user.address)}</b>
                  <BiCaretDown />
                </span>
              }
              togglerClose={
                <span className="flex items-center">
                  <b>{ellipsisAddress(user.address)}</b>
                  <BiCaretUp />
                </span>
              }
              items={[
                {
                  label: (
                    <span className="flex items-center">
                      <FaLink />
                      <span className="pl-4">{ellipsisAddress(user.address)}</span>
                    </span>
                  ),
                  onClick: console.log
                },
                {
                  label: (
                    <span className="flex items-center">
                      <FaLink />
                      <span className="pl-4">{ellipsisAddress(user.address)}</span>
                    </span>
                  ),
                  onClick: console.log
                }
              ]}
            />
          </p>
          <p className="leading-wide mx-4">
            <b>200</b>
            <span className="text-theme-light-800 pl-2">Followers</span>
          </p>
          <p className="leading-wide mx-4">
            <b>150</b>
            <span className="text-theme-light-800 pl-2">Following</span>
          </p>
        </div>
        <div className="my-14 -m-3 flex flex-wrap">
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
          <Chip
            content={
              <span className="flex items-center">
                <FaShareAlt className="text-md" />
                <span className="pl-2">Share</span>
              </span>
            }
          />
          <Chip content={<FaDiscord className="text-2xl" />} className="py-2 px-1" />
          <Chip content={<FaTwitter className="text-2xl" />} className="py-3 px-1" />
          <Chip content={<FaInstagram className="text-2xl" />} className="py-3 px-1" />
          <Chip content={<FaFacebook className="text-2xl" />} className="py-3 px-1" />
        </div>
        <p className="text-theme-light-800 max-w-md">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam.
        </p>

        <RoundedNav
          items={[{ title: 'Collected' }, { title: 'Curated' }, { title: 'Activity' }, { title: 'Feed' }]}
          onChange={(currentTab) => setCurrentTab(currentTab)}
          className="mt-14 -ml-2"
        />
        <div className="mt-6 min-h-[1024px]">
          {currentTab === 0 && collection && (
            <GalleryBox
              collection={collection}
              cardProps={{
                cardActions: [
                  {
                    label: 'Details',
                    onClick: (ev, data) => {
                      router.push(`/asset/${data?.chainId}/${data?.tokenAddress}/${data?.tokenId}`);
                    }
                  }
                ]
              }}
            />
          )}
          {currentTab === 1 && <div>Curated</div>}
          {currentTab === 2 && <ActivityTab dailyStats={dailyStats} weeklyStats={weeklyStats} />}
          {currentTab === 3 && (
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-16">
              <div className="lg:col-span-1 xl:col-span-2">
                {/* <div className="text-3xl mb-6">Feed</div> */}
                <CollectionFeed header="Feed" collectionAddress={collection?.address ?? ''} />
              </div>
              <div className="col-span-1">{collection && <CommunityRightPanel collection={collection} />}</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AccountPage;

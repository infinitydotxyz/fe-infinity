import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { twMerge } from 'tailwind-merge';
import { textClr } from 'src/utils/ui-constants';
import React from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SiReadthedocs, SiDiscord } from 'react-icons/si';
import { BsTwitter } from 'react-icons/bs';
import { RiMediumFill } from 'react-icons/ri';
import { MdFavorite, MdFeed } from 'react-icons/md';

import { Menu } from '@headlessui/react';
import {
  ConnectButton,
  Spacer,
  CustomMenuItem,
  NextLink,
  DropdownItem,
  CustomMenuItems,
  CustomMenuButton,
  CustomMenuContents
} from 'src/components/common';
import { useRouter } from 'next/router';
import { HiCollection, HiTrendingUp } from 'react-icons/hi';

export const ANavbar = () => {
  return (
    <div className="flex px-5 py-2 space-x-4 items-center">
      <div className=" max-w-96">
        {/* <CollectionSearchInput expanded /> */}
        <div className={twMerge(textClr, 'text-2xl')}>Infinity</div>
      </div>

      <Spacer />

      <ANavbarButtons />

      <ConnectButton />
      <AstraCartButton />
    </div>
  );
};

// ===========================================================================

export const ANavbarButtons = () => {
  const router = useRouter();

  const iconStyle = 'h-5 w-5 text-black';

  const content = {
    buttons: {
      items: [
        {
          type: 'link',
          label: 'Orderbook',
          props: {
            href: '/orderbook'
          }
        },
        {
          type: 'link',
          label: 'Rewards',
          props: {
            href: '/rewards'
          }
        },
        {
          type: 'dropdown',
          label: 'Discover',
          menu: [
            {
              label: 'Trending',
              icon: <HiTrendingUp className={iconStyle} />,
              onClick: () => router.push('/trending')
            },
            {
              label: 'Feed',
              icon: <MdFeed className={iconStyle} />,
              onClick: () => router.push('/feed')
            },
            {
              label: 'Curated',
              icon: <HiCollection className={iconStyle} />,
              onClick: () => router.push('/curated')
            },
            {
              label: 'Favorites',
              onClick: () => router.push('/favorites'),
              icon: <MdFavorite className={iconStyle} />
            },
            {
              label: 'Raffles',
              icon: <FaTicketAlt className={iconStyle} />,
              onClick: () => router.push('/raffles')
            }
          ]
        },
        {
          type: 'dropdown',
          label: 'Community',
          menu: [
            {
              label: 'Read docs',
              icon: <SiReadthedocs className={iconStyle} />,
              onClick: () => {
                window.open('https://docs.infinity.xyz');
              }
            } as DropdownItem,
            {
              label: 'Twitter',
              icon: <BsTwitter className={iconStyle} />,
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            } as DropdownItem,
            {
              label: 'Discord',
              icon: <SiDiscord className={iconStyle} />,
              onClick: () => {
                window.open('https://discord.com/invite/infinitydotxyz');
              }
            } as DropdownItem,
            {
              label: 'Medium',
              icon: <RiMediumFill className={iconStyle} />,
              onClick: () => {
                window.open('https://medium.com/@infinitydotxyz');
              }
            } as DropdownItem
          ]
        }
      ],
      connect: {
        label: 'Connect'
      }
    }
  };

  return (
    <>
      {content?.buttons?.items?.map((item, i) => (
        <React.Fragment key={i}>
          {item.type === 'link' && <NextLink href={item?.props?.href ? item.props.href : ''}>{item?.label}</NextLink>}
          {item.type === 'dropdown' && (
            <Menu>
              {({ open }) => (
                <CustomMenuContents>
                  <CustomMenuButton className="flex gap-1 items-center select-none">
                    <div>{item?.label}</div>
                    <IoMdArrowDropdown className="h-4 w-4" />
                  </CustomMenuButton>
                  <CustomMenuItems open={open}>
                    {item?.menu?.map((x, j) => (
                      <CustomMenuItem key={j} onClick={x.onClick}>
                        <div className="flex items-center cursor-pointer">
                          {x.icon && <div className="mr-4">{x.icon}</div>}
                          {x.label}
                        </div>
                      </CustomMenuItem>
                    ))}
                  </CustomMenuItems>
                </CustomMenuContents>
              )}
            </Menu>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

import React from 'react';
import { BsTwitter } from 'react-icons/bs';
import { IoMdArrowDropdown } from 'react-icons/io';
import { RiMediumFill } from 'react-icons/ri';
import { SiDiscord, SiReadthedocs } from 'react-icons/si';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

import { Menu } from '@headlessui/react';
import { ConnectButton, Spacer } from 'src/components/common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import {
  ACustomMenuButton,
  ACustomMenuContents,
  ACustomMenuItem,
  ACustomMenuItems,
  ADropdownItem
} from './astra-dropdown';

export const ANavbar = () => {
  return (
    <div className="flex px-5 py-3 space-x-4 items-center">
      <div className=" max-w-96">
        <CollectionSearchInput expanded />
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
  const iconStyle = twMerge(textClr, 'h-5 w-5');

  const content = {
    buttons: {
      items: [
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
            } as ADropdownItem,
            {
              label: 'Twitter',
              icon: <BsTwitter className={iconStyle} />,
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Discord',
              icon: <SiDiscord className={iconStyle} />,
              onClick: () => {
                window.open('https://discord.com/invite/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Medium',
              icon: <RiMediumFill className={iconStyle} />,
              onClick: () => {
                window.open('https://medium.com/@infinitydotxyz');
              }
            } as ADropdownItem
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
          {item.type === 'dropdown' && (
            <Menu>
              {({ open }) => (
                <ACustomMenuContents>
                  <ACustomMenuButton className="flex gap-1 items-center select-none">
                    <div className={textClr}>{item?.label}</div>
                    <IoMdArrowDropdown className={twMerge(textClr, 'h-4 w-4')} />
                  </ACustomMenuButton>
                  <ACustomMenuItems open={open}>
                    {item?.menu?.map((x, j) => (
                      <ACustomMenuItem key={j} onClick={x.onClick}>
                        <div className={twMerge(textClr, 'flex items-center cursor-pointer')}>
                          {x.icon && <div className={twMerge('mr-4')}>{x.icon}</div>}
                          {x.label}
                        </div>
                      </ACustomMenuItem>
                    ))}
                  </ACustomMenuItems>
                </ACustomMenuContents>
              )}
            </Menu>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

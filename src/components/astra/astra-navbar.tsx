import React from 'react';
import { BsMedium, BsTwitter } from 'react-icons/bs';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SiDiscord } from 'react-icons/si';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { infoBoxBGClr, smallIconButtonStyle, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

import { Menu } from '@headlessui/react';
import { AiFillRead } from 'react-icons/ai';
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
    <div className={twMerge(infoBoxBGClr, 'flex px-5 py-3 space-x-4 items-center border-b-2')}>
      <div className="w-4/12">
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
  const content = {
    buttons: {
      items: [
        {
          type: 'dropdown',
          label: 'Community',
          menu: [
            {
              label: 'Read docs',
              icon: <AiFillRead className={smallIconButtonStyle} />,
              onClick: () => {
                window.open('https://docs.infinity.xyz');
              }
            } as ADropdownItem,
            {
              label: 'Twitter',
              icon: <BsTwitter className={smallIconButtonStyle} />,
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Discord',
              icon: <SiDiscord className={smallIconButtonStyle} />,
              onClick: () => {
                window.open('https://discord.com/invite/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Medium',
              icon: <BsMedium className={smallIconButtonStyle} />,
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
                    <IoMdArrowDropdown className={twMerge(textClr, 'h-4 w-4 mt-1')} />
                  </ACustomMenuButton>
                  <ACustomMenuItems open={open} innerClassName="border-0">
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

import { BsMedium, BsTwitter } from 'react-icons/bs';
import { SiDiscord } from 'react-icons/si';
import { AstraCartButton } from 'src/components/astra/astra-cart-button';
import { borderColor, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

import { AiFillRead } from 'react-icons/ai';
import { ConnectButton, Spacer } from 'src/components/common';
import { CollectionSearchInput } from '../common/search/collection-search-input';
import { ADropdown, ADropdownItem } from './astra-dropdown';

export const ANavbar = () => {
  return (
    <div className={twMerge('flex px-5 py-2 space-x-4 items-center border-b-[1px]', borderColor)}>
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
  const menuItems = [
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
  ];

  return (
    <>
      <ADropdown label={`Community`} items={menuItems} alignMenuRight={true} />
    </>
  );
};

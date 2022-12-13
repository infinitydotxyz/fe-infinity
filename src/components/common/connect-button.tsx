import React from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiLogoutCircleFill } from 'react-icons/ri';
import { FaEthereum } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useRouter } from 'next/router';
import { AOutlineButton } from '../astra';
import { ADropdown, ADropdownItem } from '../astra/astra-dropdown';
import { twMerge } from 'tailwind-merge';
import { textClr } from 'src/utils/ui-constants';

export const ConnectButton = () => {
  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;
  const address = user?.address;
  const router = useRouter();

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const menuItems: ADropdownItem[] = [
    {
      label: 'Copy Address',
      icon: <IoIosCopy className={twMerge(textClr, 'h-5 w-5')} />,
      onClick: () => {
        address ? copyToClipboard(address) : null;
      }
    },
    {
      label: '-',
      onClick: () => console.log('separator')
    },
    {
      label: 'My Profile',
      icon: <BsFillPersonFill className={twMerge(textClr, 'h-5 w-5')} />,
      onClick: () => router.push('/profile/me')
    },
    {
      label: 'Etherscan',
      icon: <FaEthereum className={twMerge(textClr, 'h-5 w-5')} />,
      onClick: () => window.open(`https://etherscan.io/address/${address}`)
    },
    {
      label: '-',
      onClick: () => console.log('separator')
    },
    {
      label: 'Sign Out',
      icon: <RiLogoutCircleFill className={twMerge(textClr, 'h-5 w-5')} />,
      onClick: () => {
        signOut();
      }
    }
  ];

  return (
    <>
      {connected && <ADropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} alignMenuRight={true} />}
      {!connected && <AOutlineButton onClick={signIn}>Connect</AOutlineButton>}
    </>
  );
};

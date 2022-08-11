import React from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiLogoutBoxRFill } from 'react-icons/ri';
import { FaEthereum } from 'react-icons/fa';
import { BsFillPersonFill } from 'react-icons/bs';
import { Dropdown, DropdownItem } from './dropdown';
import { Button } from './button';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useRouter } from 'next/router';

export const ConnectButton = () => {
  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;
  const address = user?.address;
  const router = useRouter();

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const menuItems: DropdownItem[] = [
    {
      label: 'Copy Address',
      icon: <IoIosCopy className=" h-5 w-5 text-gray-500" />,
      onClick: () => {
        address ? copyToClipboard(address) : null;
      }
    },
    {
      label: 'My Profile',
      icon: <BsFillPersonFill className=" h-5 w-5 text-gray-500" />,
      onClick: () => router.push('/profile/me')
    },
    {
      label: 'Etherscan',
      icon: <FaEthereum className=" h-5 w-5 text-gray-500" />,
      onClick: () => window.open(`https://etherscan.io/address/${address}`)
    },
    {
      label: '-',
      onClick: () => console.log('separator')
    },
    {
      label: 'Sign Out',
      icon: <RiLogoutBoxRFill className=" h-5 w-5 text-gray-500" />,
      onClick: () => {
        signOut();
      }
    }
  ];

  return (
    <>
      {connected && <Dropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} />}
      {!connected && <Button onClick={signIn}>Connect</Button>}
    </>
  );
};

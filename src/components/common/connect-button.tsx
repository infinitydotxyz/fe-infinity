import React from 'react';
import { IoIosCopy } from 'react-icons/io';
import { RiLogoutBoxRLine } from 'react-icons/ri';
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
      icon: <IoIosCopy className=" h-5 w-5 text-black" />,
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
      icon: <BsFillPersonFill className=" h-5 w-5 text-black" />,
      onClick: () => router.push('/profile/me')
    },
    {
      label: 'Etherscan',
      icon: <FaEthereum className=" h-5 w-5 text-black" />,
      onClick: () => window.open(`https://etherscan.io/address/${address}`)
    },
    {
      label: '-',
      onClick: () => console.log('separator')
    },
    {
      label: 'Sign Out',
      icon: <RiLogoutBoxRLine className=" h-5 w-5 text-black" />,
      onClick: () => {
        signOut();
      }
    }
  ];

  return (
    <>
      {connected && <Dropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} alignMenuRight={true} />}
      {!connected && <Button onClick={signIn}>Connect</Button>}
    </>
  );
};

import React from 'react';
import { useAppContext } from 'src/utils/context/AppContext';
import { BiCopyAlt, BiCheck } from 'react-icons/bi';
import { Dropdown } from './dropdown';
import { useRouter } from 'next/router';
import { Button } from './button';
import { ellipsisAddress } from 'src/utils';

export const ConnectButton = () => {
  const { user, signOut } = useAppContext();
  const connected = user?.address ? true : false;
  const address = user?.address;
  const router = useRouter();

  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 1000);
      },
      (err) => {
        console.log('failed to copy', err.mesage);
      }
    );
  };

  const menuItems = [
    {
      label: (
        <div className="flex items-center gap-2">
          <div>Copy Address</div>
          {copied ? <BiCheck /> : <BiCopyAlt />}
        </div>
      ),
      onClick: () => {
        address ? copyToClipboard(address) : null;
      }
    },
    {
      label: 'Etherscan',
      onClick: () => window.open(`https://etherscan.io/address/${address}`)
    },
    {
      label: 'Sign Out',
      onClick: () => {
        signOut();
      }
    }
  ];

  return (
    <>
      {connected && <Dropdown label={`${ellipsisAddress(address)}`} items={menuItems} />}
      {!connected && <Button onClick={() => router.push('/connect')}>Connect</Button>}
    </>
  );
};

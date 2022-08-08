import React from 'react';
import { BiCopyAlt, BiCheck } from 'react-icons/bi';
import { Dropdown } from './dropdown';
import { Button } from './button';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const ConnectButton = () => {
  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;
  const address = user?.address;

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
      {connected && <Dropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} />}
      {!connected && <Button onClick={signIn}>Connect</Button>}
    </>
  );
};

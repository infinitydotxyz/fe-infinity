import { HiOutlineExternalLink } from 'react-icons/hi';
import { RiLogoutCircleLine } from 'react-icons/ri';
import { RxCopy } from 'react-icons/rx';
import { ellipsisAddress } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { iconButtonStyle } from 'src/utils/ui-constants';
import { AOutlineButton } from '../astra/astra-button';
import { ADropdown, ADropdownItem } from '../astra/astra-dropdown';

export const ConnectButton = () => {
  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;
  const address = user?.address;

  const copyToClipboard = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
  };

  const menuItems: ADropdownItem[] = [
    {
      label: 'Copy Address',
      icon: <RxCopy className={iconButtonStyle} />,
      onClick: () => {
        address ? copyToClipboard(address) : null;
      }
    },
    {
      label: 'Etherscan',
      icon: <HiOutlineExternalLink className={iconButtonStyle} />,
      onClick: () => window.open(`https://etherscan.io/address/${address}`)
    },
    {
      label: 'Sign Out',
      icon: <RiLogoutCircleLine className={iconButtonStyle} />,
      onClick: () => {
        signOut();
      }
    }
  ];

  return (
    <>
      {connected && <ADropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} alignMenuRight={true} />}
      {!connected && (
        <AOutlineButton onClick={signIn} className="text-sm py-2.5">
          Connect
        </AOutlineButton>
      )}
    </>
  );
};

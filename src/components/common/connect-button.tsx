import { ConnectKitButton } from 'connectkit';

export const ConnectButton = () => {
  return <ConnectKitButton />;

  // const { signIn, signOut } = useOnboardContext();
  // const { address: user } = useAccount();

  // const connected = user ? true : false;
  // const address = user;

  // const copyToClipboard = (textToCopy: string) => {
  //   navigator.clipboard.writeText(textToCopy);
  // };

  // const menuItems: ADropdownItem[] = [
  //   {
  //     label: 'Copy Address',
  //     icon: <RxCopy className={iconButtonStyle} />,
  //     onClick: () => {
  //       address ? copyToClipboard(address) : null;
  //     }
  //   },
  //   {
  //     label: 'Etherscan',
  //     icon: <HiOutlineExternalLink className={iconButtonStyle} />,
  //     onClick: () => window.open(`https://etherscan.io/address/${address}`)
  //   },
  //   {
  //     label: 'Sign Out',
  //     icon: <RiLogoutCircleLine className={iconButtonStyle} />,
  //     onClick: () => {
  //       signOut();
  //     }
  //   }
  // ];

  // return (
  //   <>
  //     {connected && <ADropdown label={`${ellipsisAddress(address, 5, 3)}`} items={menuItems} alignMenuRight={true} />}
  //     {!connected && (
  //       <AOutlineButton onClick={signIn} className="text-sm py-2.5">
  //         Connect
  //       </AOutlineButton>
  //     )}
  //   </>
  // );
};

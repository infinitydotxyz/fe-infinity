import React from 'react';
import Link from 'next/link';
import { Popover, Transition } from '@headlessui/react';
import { useAppContext } from 'src/utils/context/AppContext';
import { BiCopyAlt } from 'react-icons/bi';
import { BiCheck } from 'react-icons/bi';
import { AiOutlineWallet } from 'react-icons/ai';

export const ConnectButton: React.FC = () => {
  const { user, signOut } = useAppContext();
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

  const styles = {
    menu: {
      container: {
        className: `
          relative w-full h-full
        `
      },
      transition: {
        enter: 'transition duration-100 ease-out',
        enterFrom: 'transform scale-95 opacity-0',
        enterTo: 'transform scale-100 opacity-100',
        leave: 'transition duration-75 ease-out',
        leaveFrom: 'transform scale-100 opacity-100',
        leaveTo: 'transform scale-95 opacity-0'
      },
      items: {
        className: `
          absolute w-content h-content py-2 px-2
          desktop:left-[0px]
          tablet:left-[-30px]
          mobile:left-[-80px]
          flex flex-col bg-theme-light-50
          shadow-xl rounded-xl
          ring-1 ring-inset ring-slate-400 ring-opacity-10
        `
      },
      item: {
        className: `
          w-full h-full rounded-xl
          flex flex-nowrap whitespace-nowrap hover:bg-theme-light-200 items-center gap-2
          desktop:pl-2 desktop:pr-2 desktop:py-2
          tablet:pl-2 tablet:pr-2 tablet:py-2
          mobile:pl-2 mobile:pr-2 mobile:py-2
          desktop-8k:text-md
          desktop-4k:text-md
          desktop-lg:text-sm
          desktop-md:text-sm
          desktop-sm:text-sm
          tablet:text-xs
          mobile:text-xs
        `
      },
      button: {
        container: {
          className: `
            transition w-full h-full rounded-full
            justify-self-end
            font-mono grid place-content-center
            ${
              connected
                ? 'bg-theme-light-50 font-bold hover:bg-theme-light-200 ring-1 ring-inset ring-theme-light-700'
                : 'bg-theme-light-900 text-theme-light-50 font-bold hover:bg-opacity-80 hover:cursor-pointer'
            }
          `
        },
        regular: {
          className: `
            w-full h-full
            desktop:visible
            tablet:visible
            mobile:hidden
            desktop-8k:text-md
            desktop-4k:text-md
            desktop-lg:text-sm
            desktop-md:text-sm
            desktop-sm:text-sm
            tablet:text-xs
            mobile:text-xs
            flex shrink-0 flex-nowrap justify-center place-items-center gap-2
          `
        },
        disconnected: {
          className: `
            w-full h-full
            desktop:text-sm
            tablet:text-xs
            mobile:text-xs mobile:px-4
            flex shrink-0 flex-nowrap justify-center place-items-center gap-2
          `
        },
        mobile: {
          className: `
            w-full h-full
            grid place-content-center
            w-8 h-8 px-6
            desktop:hidden
            tablet:hidden
            mobile:visible
          `
        }
      }
    }
  };

  const content = {
    button: connected ? `${address?.substring(0, 8)}` : 'Connect',
    wallet: <AiOutlineWallet />,
    menu: [
      /*
        ======================================
          Menu props returns an object. Props of
          each item in the dropdown looks
          weird because each of these item can
          either close the popover manually or it
          can choose not to depending on their function.
          For example: If you want to sign out, the
          popover should close, but if you want to
          copy address - the popover should not close.
          So to give the power to close popover, we need to
          use Popover comopnent (instead of Menu) and do
          it this way.
        ======================================
      */
      {
        type: 'button',
        label: <>Copy Address {copied ? <BiCheck /> : <BiCopyAlt />}</>,
        props: () => ({
          href: '',
          onClick: () => {
            address ? copyToClipboard(address) : null;
          }
        })
      },
      {
        type: 'external',
        label: 'Etherscan',
        props: () => ({
          href: `https://etherscan.io/address/${address}`
        })
      },
      {
        type: 'button',
        label: 'Sign Out',
        props: ({ open, close }: { open: boolean; close(): void }) => ({
          href: '',
          onClick: () => {
            signOut();
            open ? close() : null;
          }
        })
      }
    ]
  };

  return (
    <>
      {connected && (
        <Popover as="div" {...styles?.menu?.container}>
          {({ open, close }) => (
            <>
              <Popover.Button {...styles?.menu?.button?.container}>
                <div {...styles?.menu?.button?.mobile}>{content?.wallet}</div>
                <div {...styles?.menu?.button?.regular}>{content?.button}</div>
              </Popover.Button>
              <Transition {...styles?.menu?.transition}>
                <Popover.Panel {...styles?.menu?.items}>
                  {content?.menu?.map((item, i) => (
                    <React.Fragment key={i}>
                      {item.type === 'external' && (
                        <Link passHref {...item?.props({ open, close })}>
                          <a target="_blank" rel="noopener noreferrer">
                            <button {...styles?.menu?.item}>{item?.label}</button>
                          </a>
                        </Link>
                      )}
                      {item.type === 'link' && (
                        <Link passHref {...item?.props({ open, close })}>
                          <button {...styles?.menu?.item}>{item?.label}</button>
                        </Link>
                      )}
                      {item.type === 'button' && (
                        <button {...styles?.menu?.item} {...item?.props({ open, close })}>
                          {item?.label}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      )}
      {!connected && (
        <>
          <Link href="/connect" passHref>
            <div {...styles?.menu?.button?.container}>
              <div {...styles?.menu?.button?.disconnected}>{content?.button}</div>
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default ConnectButton;

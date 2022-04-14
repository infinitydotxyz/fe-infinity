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
          desktop:left-[-20px]
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
          desktop:text-sm
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
                : 'bg-theme-light-50 drop-shadow-lg font-bold hover:bg-theme-light-200 hover:cursor-pointer'
            }
          `
        },
        regular: {
          className: `
            w-full h-full
            desktop:visible
            tablet:visible
            mobile:hidden
            desktop:text-sm
            tablet:text-xs
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
        props: ({ open, close }: { open: boolean; close(): void }) => ({
          onClick: () => {
            address ? copyToClipboard(address) : null;
          }
        })
      },
      {
        type: 'external',
        label: 'Etherscan',
        props: ({ open, close }: { open: boolean; close(): void }) => ({
          href: `https://etherscan.io/address/${address}`
        })
      },
      {
        type: 'button',
        label: 'Sign Out',
        props: ({ open, close }: { open: boolean; close(): void }) => ({
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
              <div {...styles?.menu?.button?.disconnected}>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
                    fill="#333"
                  />
                </svg>
                {content?.button}
              </div>
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default ConnectButton;

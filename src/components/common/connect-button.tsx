import React from 'react';
import Link from 'next/link';
import { Menu, Transition } from '@headlessui/react';
import { useAppContext } from 'src/utils/context/AppContext';

export const ConnectButton: React.FC = () => {
  const { user, signOut } = useAppContext();
  const connected = user?.address ? true : false;
  const address = user?.address;

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
          flex flex-col bg-theme-light-50
          shadow-xl rounded-xl
          ring-1 ring-inset ring-slate-400 ring-opacity-10
        `
      },
      item: {
        className: `
          w-full h-full
          pl-4 pr-20 py-2 text-sm rounded-xl
          flex hover:bg-theme-light-200
        `
      },
      button: {
        className: `
          transition w-full h-full
          justify-self-end
          font-mono text-sm
          rounded-full
          flex shrink-0 justify-center place-items-center gap-2
          ${
            connected
              ? 'bg-theme-light-50 font-bold hover:bg-theme-light-200 ring-1 ring-inset ring-theme-light-700'
              : 'bg-theme-light-50 drop-shadow-lg font-bold hover:bg-theme-light-200 hover:cursor-pointer'
          }
        `
      }
    }
  };

  const content = {
    button: connected ? `${address?.substring(0, 8)}` : 'Connect',
    menu: [
      {
        type: 'external',
        label: 'Etherscan',
        props: {
          href: `https://etherscan.io/address/${address}`
        }
      },
      {
        type: 'link',
        label: 'Account',
        props: {
          href: '/'
        }
      },
      {
        type: 'button',
        label: 'Sign Out',
        props: {
          onClick: signOut
        }
      }
    ]
  };

  return (
    <>
      {connected && (
        <Menu as="div" {...styles?.menu?.container}>
          <Menu.Button {...styles?.menu?.button}>{content?.button}</Menu.Button>
          <Transition {...styles?.menu?.transition}>
            <Menu.Items {...styles?.menu?.items}>
              {content?.menu?.map((item, i) => (
                <React.Fragment key={i}>
                  {item.type === 'external' && (
                    <Link passHref href={item?.props?.href ? item.props.href : ''}>
                      <a target="_blank" rel="noopener noreferrer">
                        <Menu.Item as="button" {...styles?.menu?.item}>
                          {item?.label}
                        </Menu.Item>
                      </a>
                    </Link>
                  )}
                  {item.type === 'link' && (
                    <Link passHref href={item?.props?.href ? item.props.href : ''}>
                      <Menu.Item as="button" {...styles?.menu?.item}>
                        {item?.label}
                      </Menu.Item>
                    </Link>
                  )}
                  {item.type === 'button' && (
                    <Menu.Item as="button" {...styles?.menu?.item} {...item?.props}>
                      {item?.label}
                    </Menu.Item>
                  )}
                </React.Fragment>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
      )}
      {!connected && (
        <>
          <Link href="/connect" passHref>
            <div {...styles?.menu?.button}>
              <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.19.367a14.05 14.05 0 00-6.38 0l-.44.102C3.435 1.153 1.121 3.524.397 6.59c-.53 2.24-.53 4.58 0 6.82.724 3.066 3.038 5.437 5.973 6.12l.44.103c2.101.49 4.279.49 6.38 0l.44-.102c2.935-.684 5.249-3.055 5.973-6.121.53-2.24.53-4.58 0-6.82-.724-3.066-3.038-5.437-5.973-6.12l-.44-.103zm3.066 7.197a5.322 5.322 0 011.197-.077c.438.022.783.382.842.84.143 1.11.143 2.236 0 3.347-.059.457-.404.817-.842.838-.398.02-.8-.005-1.197-.076l-.078-.014c-1.033-.185-1.832-.921-2.102-1.849a2.047 2.047 0 010-1.146c.27-.928 1.069-1.664 2.102-1.849l.078-.014zM5.101 6.641c0-.37.286-.671.639-.671H10c.353 0 .64.3.64.671 0 .371-.287.672-.64.672H5.74c-.353 0-.64-.3-.64-.672z"
                  fill="#333"
                />
              </svg>
              {content?.button}
            </div>
          </Link>
        </>
      )}
    </>
  );
};

export default ConnectButton;

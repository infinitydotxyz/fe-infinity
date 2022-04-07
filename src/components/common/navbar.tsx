import React from 'react';
import Link from 'next/link';
import { BiSearchAlt2 } from 'react-icons/bi';
import { SVG } from 'src/components/common/icon';
import { useAppContext } from 'src/utils/context/AppContext';

const Connect = () => {
  const { user, signOut } = useAppContext();
  const connected = user?.address ? true : false;
  const address = user?.address;

  const styles = {
    button: {
      className: `
        transition w-full h-full
        justify-self-end
        font-mono text-xs
        rounded-full
        flex shrink-0 justify-center place-items-center gap-2
        ${
          connected
            ? 'bg-theme-light-50 font-bold hover:bg-theme-light-200 ring-1 ring-inset ring-theme-light-700'
            : 'bg-theme-light-50 drop-shadow-lg font-bold hover:bg-theme-light-200 hover:cursor-pointer'
        }
      `
    }
  };

  const content = {
    button: connected ? `${address?.substring(0, 6)}` : 'Connect'
  };

  return (
    <>
      {connected && (
        <button {...styles?.button} onClick={signOut}>
          {content?.button}
        </button>
      )}
      {!connected && (
        <>
          <Link href="/connect" passHref>
            <div {...styles?.button}>
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

export function Navigation() {
  const styles = {
    container: {
      className: `
          w-5/6 h-full
          sticky top-0
          row-span-2 col-span-24
          bg-white bg-opacity-70 glass
          grid grid-rows-1 grid-cols-[1fr,10fr,1fr,1fr,1fr] gap-2
          py-4
        `
    },
    logo: {
      family: 'SVG',
      name: 'infinity',
      className: `
          w-min h-full col-span-1
          justify-self-start hover:cursor-pointer
        `
    },
    search: {
      container: {
        className: `
            transition w-full h-full
            col-span-1 row-span-1
            grid
            bg-transparent
          `
      },
      button: {
        className: `
            w-contain h-full px-4 rounded-full
            bg-transparent
            justify-self-end
          `
      },
      icon: {
        className: 'w-5 h-5'
      }
    },
    explore: {
      container: {
        className: `
            transition w-full h-full
            col-span-1 row-span-1
            grid items-center
            bg-transparent
          `
      },
      button: {
        className: `
            transition w-full h-full
            justify-self-end
            font-mono text-xs
            text-theme-light-900 hover:underline rounded-full

          `
      }
    },
    list: {
      container: {
        className: `
            transition w-full h-full
            col-span-1 row-span-1
            grid items-center
            font-mono text-xs
            text-theme-light-900 hover:underline rounded-full

          `
      },
      button: {
        className: `
            transition w-full h-full
            justify-self-end
            bg-transparent
          `
      }
    },
    connect: {
      container: {
        className: `
            transition w-full h-full
            col-span-1 row-span-1
            grid items-center
            bg-transparent
          `
      },
      modal: {
        interactive: false,
        className: `
            transition w-full h-full
            justify-self-end
            font-mono text-xs
            bg-theme-light-900 text-theme-light-100 hover:underline rounded-full
          `,
        content: () => (
          <>
            <div className="w-3/4 h-5/6 bg-theme-light-50 ring ring-inset ring-theme-light-700 rounded-xl"></div>
          </>
        )
      }
    }
  };

  /*
    ======================================
      Modify this object if you wish
      to change the data associated
      with the navbar. Later this component
      will be updated so that data can be
      passed as props. But for now this is
      how Navbar works.
    ======================================
  */
  const content = {
    buttons: {
      home: {
        label: 'Home',
        icon: SVG.infinity,
        props: {
          href: '/'
        }
      },
      search: {
        label: 'Search',
        icon: BiSearchAlt2
      },
      explore: {
        label: 'Explore',
        props: {
          href: '/explore'
        }
      },
      list: {
        label: 'List',
        props: {
          href: '/list'
        }
      },
      connect: {
        label: 'Connect'
      }
    }
  };

  return (
    <>
      <div {...styles?.container}>
        <Link {...content?.buttons?.home?.props}>
          <content.buttons.home.icon {...styles?.logo}></content.buttons.home.icon>
        </Link>
        <div {...styles?.search?.container}>
          <button {...styles?.search?.button}>
            <content.buttons.search.icon {...styles?.search?.icon}></content.buttons.search.icon>
          </button>
        </div>
        <div {...styles?.explore?.container}>
          <Link {...content?.buttons?.explore?.props}>
            <button {...styles?.explore?.button}>{content?.buttons?.explore?.label}</button>
          </Link>
        </div>
        <div {...styles?.list?.container}>
          <Link {...content?.buttons?.list?.props}>
            <button {...styles?.list?.button}>{content?.buttons?.list?.label}</button>
          </Link>
        </div>
        <div {...styles?.connect?.container}>
          <Connect />
        </div>
      </div>
    </>
  );
}

export default Navigation;

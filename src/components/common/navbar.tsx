import React from 'react';
import Link from 'next/link';
import { Icon } from 'src/components/common/icon';

export function Navigation() {
  const styles = {
    container: {
      className: `
          w-5/6 h-full overflow-hidden
          sticky top-0
          row-span-2 col-span-24
          bg-transparent glass
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
            transition w-full h-full overflow-hidden
            col-span-1 row-span-1
            grid
            bg-transparent
          `
      },
      button: {
        className: `
            w-contain h-full overflow-hidden px-4 rounded-full
            bg-transparent
            justify-self-end
          `
      },
      icon: {
        name: 'BiSearchAlt2',
        family: 'BI',
        className: 'w-5 h-5'
      }
    },
    explore: {
      container: {
        className: `
            transition w-full h-full overflow-hidden
            col-span-1 row-span-1
            grid items-center
            bg-transparent
          `
      },
      button: {
        className: `
            transition w-full h-full overflow-hidden
            justify-self-end
            font-mono text-xs
            text-theme-light-900 hover:underline rounded-full

          `
      }
    },
    list: {
      container: {
        className: `
            transition w-full h-full overflow-hidden
            col-span-1 row-span-1
            grid items-center
            font-mono text-xs
            text-theme-light-900 hover:underline rounded-full

          `
      },
      button: {
        className: `
            transition w-full h-full overflow-hidden
            justify-self-end
            bg-transparent
          `
      }
    },
    connect: {
      container: {
        className: `
            transition w-full h-full overflow-hidden
            col-span-1 row-span-1
            grid items-center
            bg-transparent
          `
      },
      button: {
        className: `
            transition w-full h-full overflow-hidden
            justify-self-end
            font-mono text-xs
            bg-theme-light-900 text-theme-light-100 hover:underline rounded-full
          `
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
        props: {
          href: '/'
        }
      },
      search: {
        label: 'Search'
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
          <Icon {...styles?.logo}></Icon>
        </Link>
        <div {...styles?.search?.container}>
          <button {...styles?.search?.button}>
            <Icon {...styles?.search?.icon}></Icon>
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
          <button {...styles?.connect?.button}>{content?.buttons?.connect?.label}</button>
        </div>
      </div>
    </>
  );
}

export default Navigation;

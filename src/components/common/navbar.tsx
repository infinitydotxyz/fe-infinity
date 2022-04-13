import React from 'react';
import Link from 'next/link';
import { SVG } from 'src/components/common/svg';
import { Menu, Transition } from '@headlessui/react';
import { ConnectButton } from 'src/components/common/connect-button';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SearchInput } from 'src/components/common/search-input';

export function Navbar() {
  /*
    ======================================
      This object contains all styles
      of elements used in this component.
      It's advisable to look at the markup
      first and then hit 'Goto reference'
      key of your editor to find out which
      object is being spread as props in
      the markup that you're looking for.
    ======================================
  */
  const styles = {
    background: {
      className: `
          w-full h-full z-50
          sticky top-0
          row-span-2 col-span-24
          bg-white bg-opacity-70 glass
          grid place-items-center
        `
    },
    container: {
      className: `
          w-5/6 h-full
          row-span-2 col-span-24
          grid grid-rows-1 grid-cols-[1fr,13fr] gap-8
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
    actions: {
      container: {
        className: `
          w-full h-full col-span-1 row-span-1
          grid grid-rows-1 grid-cols-[1fr,3fr,11fr,2fr] gap-1
        `
      },
      search: {
        container: {
          className: `
            transition w-full h-full
            col-span-1 row-span-1
            grid bg-transparent
          `
        }
      },
      items: {
        container: {
          className: `
            w-full h-full
            row-span-1 col-span-1
            flex flex-row
          `
        }
      },
      item: {
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
            font-mono text-sm
            text-theme-light-900 hover:underline rounded-full
          `
        },
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
              font-mono text-sm
              text-theme-light-900 hover:underline rounded-full
              justify-self-end
              flex gap-2 place-items-center place-content-center
            `
          }
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
        }
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
        icon: SVG.logo,
        props: {
          href: '/'
        }
      },
      items: [
        {
          type: 'link',
          label: 'Analytics',
          props: {
            href: '/analytics'
          }
        },
        {
          type: 'link',
          label: 'My profile',
          props: {
            href: '/profile'
          }
        },
        {
          type: 'link',
          label: 'Marketplace',
          props: {
            href: '/market'
          }
        },
        {
          type: 'link',
          label: 'Rewards',
          props: {
            href: '/rewards'
          }
        },
        {
          type: 'dropdown',
          label: 'Community',
          menu: [
            {
              type: 'link',
              label: 'Docs',
              props: {
                href: '/docs'
              }
            },
            {
              type: 'external',
              label: 'Twitter',
              props: {
                href: 'https://twitter.com/infinitydotxyz'
              }
            },
            {
              type: 'external',
              label: 'Discord',
              props: {
                href: 'http://discord.gg/4VFcGY3W7H'
              }
            },
            {
              type: 'external',
              label: 'Medium',
              props: {
                href: 'https://medium.com/@infinitydotxyz'
              }
            },
            {
              type: 'external',
              label: 'Governance',
              props: {
                href: 'https://commonwealth.im/infinity'
              }
            }
          ]
        }
      ],
      connect: {
        label: 'Connect'
      }
    }
  };

  return (
    <>
      <div {...styles?.background}>
        <div {...styles?.container}>
          <Link {...content?.buttons?.home?.props}>
            {/*
            ====================================
              This is where we render the 'home'
              button - logo that takes you back
              to home page.
            ====================================
          */}
            <content.buttons.home.icon {...styles?.logo}></content.buttons.home.icon>
          </Link>
          <div {...styles?.actions?.container}>
            <div></div>
            <div {...styles?.actions?.search?.container}>
              <SearchInput />
            </div>
            <div {...styles?.actions?.items?.container}>
              {/*
              ====================================
                This is where we render all the
                navigation action buttons (or dropdowns).
              ====================================
            */}
              {content?.buttons?.items?.map((item, i) => (
                <React.Fragment key={i}>
                  {/*
                  ====================================
                    If content type is a link, then
                    it should render a link, otherwise
                    if it's a dropdown then it should
                    render a special dropdown component
                    that's different slightly from the
                    dropdowns used anywhere else.
                  ====================================
                */}
                  {item.type === 'external' && (
                    <div {...styles?.actions?.item?.container}>
                      <Link passHref href={item?.props?.href ? item.props.href : ''}>
                        <a target="_blank" rel="noopener noreferrer">
                          <button {...styles?.actions?.item?.button}>{item?.label}</button>
                        </a>
                      </Link>
                    </div>
                  )}
                  {item.type === 'link' && (
                    <div {...styles?.actions?.item?.container}>
                      <Link passHref href={item?.props?.href ? item.props.href : ''}>
                        <button {...styles?.actions?.item?.button}>{item?.label}</button>
                      </Link>
                    </div>
                  )}
                  {item.type === 'dropdown' && (
                    <div {...styles?.actions?.item?.container}>
                      <Menu as="div" {...styles?.actions?.item?.menu?.container}>
                        <Menu.Button {...styles?.actions?.item?.menu?.button}>
                          {item?.label} <IoMdArrowDropdown />
                        </Menu.Button>
                        <Transition
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Menu.Items {...styles?.actions?.item?.menu?.items}>
                            {item?.menu?.map((x, j) => (
                              <React.Fragment key={j}>
                                {/*
                              ====================================
                                Dropdown content can have a menu
                                array, which renders links or action
                                buttons based on the type described in
                                the content, similar to how we did above
                                 for the tabs.
                              ====================================
                            */}
                                {x.type === 'external' && (
                                  <Link passHref href={x?.props?.href ? x.props.href : ''}>
                                    <a target="_blank" rel="noopener noreferrer">
                                      <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
                                        {x?.label}
                                      </Menu.Item>
                                    </a>
                                  </Link>
                                )}
                                {x.type === 'link' && (
                                  <Link passHref href={x?.props?.href ? x.props.href : ''}>
                                    <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
                                      {x?.label}
                                    </Menu.Item>
                                  </Link>
                                )}
                                {x.type === 'button' && (
                                  <Menu.Item as="button" {...styles?.actions?.item?.menu?.item} {...x?.props}>
                                    {x?.label}
                                  </Menu.Item>
                                )}
                              </React.Fragment>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div {...styles?.actions?.connect?.container}>
              {/*
            ====================================
              This renders the connect button.
              Connect button encapsulates a dropdown
              in itself according to requirements as of
              now (as I'm writing this comment). This can
              change but please don't make any of the containers
              above `overflow-hidden` so that the dropdown
              appears.
            ====================================
          */}
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

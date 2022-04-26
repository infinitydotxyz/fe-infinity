import React from 'react';
import Link from 'next/link';
import { SVG } from 'src/components/common/svg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Menu, Transition } from '@headlessui/react';
import { SearchInput } from 'src/components/common/search-input';
import { ConnectButton } from 'src/components/common/connect-button';

export function Navbar() {
  const styles = {
    background: {
      className: `
          w-full h-full z-50
          sticky top-0
          row-span-1 col-span-24
          bg-white bg-opacity-70 glass
          grid place-items-center
        `
    },
    container: {
      className: `
          h-full
          row-span-2 col-span-24
          grid grid-rows-1
          desktop:w-5/6
          desktop-sm:w-[95%]
          tabloid:w-[95%]
          mobile:w-[98%]
          desktop-8k:grid-cols-[1fr,10fr] desktop-8k:gap-8
          desktop-4k:grid-cols-[1fr,10fr] desktop-4k:gap-8
          desktop-lg:grid-cols-[1fr,10fr] desktop-lg:gap-8
          desktop-md:grid-cols-[1fr,6fr] desktop-md:gap-8
          desktop-sm:grid-cols-[1fr,6fr] desktop-sm:gap-4
          tablet:grid-cols-[40px,6fr] tablet:gap-2
          mobile-xl:grid-cols-[40px,9fr] mobile:gap-2
          mobile-lg:grid-cols-[40px,9fr] mobile:gap-2
          mobile-md:grid-cols-[40px,9fr] mobile:gap-2
          mobile-sm:grid-cols-[40px,9fr] mobile:gap-2
          py-4
        `
    },
    logo: {
      regular: {
        className: `
          col-span-1
          desktop:w-full
          tabloid:hidden
          justify-self-start text-center hover:cursor-pointer
        `
      },
      mobile: {
        className: `
          col-span-1
          desktop:hidden
          tabloid:w-[40px]
          justify-self-start text-center hover:cursor-pointer
        `
      }
    },
    actions: {
      container: {
        className: `
          w-full h-full col-span-1 row-span-1
          grid grid-rows-1 gap-1
          desktop-8k:grid-cols-[8fr,3fr,8fr,2fr]
          desktop-4k:grid-cols-[8fr,3fr,8fr,2fr]
          desktop-lg:grid-cols-[3fr,2fr,6fr,1fr]
          desktop-md:grid-cols-[2fr,3fr,10fr,2fr]
          desktop-sm:grid-cols-[0fr,4fr,13fr,3fr]
          tablet:grid-cols-[0fr,4fr,13fr,3fr]
          mobile:grid-cols-[0fr,3fr,1fr,auto]
        `
      },
      search: {
        container: {
          className: `
            transition w-full h-full max-h-full
            col-span-1 row-span-1
            grid bg-transparent
          `
        },
        desktop: {
          className: `
            w-full h-full desktop:visible tabloid:hidden
          `
        },
        mobile: {
          className: `
            w-full h-full desktop:hidden tabloid:visible
          `
        }
      },
      items: {
        container: {
          className: `
            w-full h-full
            row-span-1 col-span-1
            flex flex-row
            mobile:hidden
          `
        },
        mobile: {
          className: `
            w-full h-full
            row-span-1 col-span-1
            flex flex-row
            desktop:hidden
            tablet:hidden
            mobile:visible
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
            desktop-8k:text-md
            desktop-4k:text-md
            desktop-lg:text-sm
            desktop-md:text-sm
            desktop-sm:text-sm
            tabloid:text-xs
            mobile:text-xs
          `
        },
        button: {
          className: `
            transition w-full h-full
            justify-self-end
            font-mono
            text-theme-light-900 hover:underline rounded-full
            desktop-8k:text-md
            desktop-4k:text-md
            desktop-lg:text-sm
            desktop-md:text-sm
            desktop-sm:text-sm
            tabloid:text-xs
            mobile:text-xs
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
              absolute w-content h-content py-4 px-2
              mobile:left-[-80px]
              flex flex-col bg-theme-light-50
              shadow-xl rounded-xl font-heading
              ring-1 ring-inset ring-slate-400 ring-opacity-10
            `
          },
          item: {
            className: `
              w-full h-full rounded-xl
              flex flex-nowrap whitespace-nowrap hover:bg-theme-light-200 items-center gap-2
              desktop:pl-4 desktop:pr-20 desktop:py-4
              tabloid:pl-2 tabloid:pr-10 tabloid:py-2
              mobile:pl-2 mobile:pr-10 mobile:py-2
              desktop-8k:text-md
              desktop-4k:text-md
              desktop-lg:text-md
              desktop-md:text-md
              desktop-sm:text-md
              tabloid:text-md
              mobile:text-md
            `
          },
          button: {
            className: `
              transition w-full h-full
              justify-self-end
              flex gap-2 place-items-center place-content-center
              font-mono text-theme-light-900 hover:underline rounded-full
              desktop-8k:text-md
              desktop-4k:text-md
              desktop-lg:text-sm
              desktop-md:text-sm
              desktop-sm:text-sm
              tabloid:text-xs
              mobile:text-xs
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

  const content = {
    buttons: {
      home: {
        label: 'Home',
        icon: {
          regular: SVG.logo,
          mobile: SVG.infinity
        },
        props: {
          href: '/',
          className: `w-full h-full flex`
        }
      },
      items: [
        {
          type: 'link',
          label: 'Analytics',
          props: {
            href: '/analytics/trending/weekly'
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
          label: 'Orderbook',
          props: {
            href: '/market'
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
          <Link passHref {...content?.buttons?.home?.props}>
            {/*
            ====================================
              This is where we render the 'home'
              button - logo that takes you back
              to home page.
            ====================================
          */}
            <a {...content?.buttons?.home?.props}>
              <content.buttons.home.icon.regular {...styles?.logo?.regular}></content.buttons.home.icon.regular>
              <content.buttons.home.icon.mobile {...styles?.logo?.mobile}></content.buttons.home.icon.mobile>
            </a>
          </Link>
          <div {...styles?.actions?.container}>
            <div></div>
            <div {...styles?.actions?.search?.container}>
              <div {...styles?.actions?.search?.desktop}>
                <SearchInput />
              </div>
              <div {...styles?.actions?.search?.mobile}>
                <SearchInput opened />
              </div>
            </div>
            <div {...styles?.actions?.items?.mobile}>
              <Menu as="div" {...styles?.actions?.item?.menu?.container}>
                <Menu.Button {...styles?.actions?.item?.menu?.button}>
                  <GiHamburgerMenu />
                </Menu.Button>
                <Transition {...styles?.actions?.item?.menu?.transition}>
                  <Menu.Items {...styles?.actions?.item?.menu?.items}>
                    {content?.buttons?.items?.map((item, i) => (
                      <React.Fragment key={i}>
                        {item.type === 'external' && (
                          <Link passHref href={item?.props?.href ? item.props.href : ''}>
                            <a target="_blank" rel="noopener noreferrer">
                              <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
                                {item?.label}
                              </Menu.Item>
                            </a>
                          </Link>
                        )}
                        {item.type === 'link' && (
                          <Link passHref href={item?.props?.href ? item.props.href : ''}>
                            <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
                              {item?.label}
                            </Menu.Item>
                          </Link>
                        )}
                        {item.type === 'dropdown' && (
                          <>
                            <hr className="my-1" />
                            {item?.menu?.map((x, j) => (
                              <React.Fragment key={j}>
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
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
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
                        <Transition {...styles?.actions?.item?.menu?.transition}>
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

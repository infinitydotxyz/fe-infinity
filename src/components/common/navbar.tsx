import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Menu } from '@headlessui/react';
import {
  SVG,
  SearchInput,
  ConnectButton,
  Spacer,
  CustomMenuItem,
  pageStyles,
  NextLink,
  ShoppingCartButton
} from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';

export const Navbar = () => {
  const router = useRouter();

  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;

  const content = {
    buttons: {
      items: [
        {
          type: 'link',
          label: 'Trending', // Analytics
          props: {
            href: '/trending' // analytics/trending/weekly
          }
        },
        {
          type: 'link',
          label: 'My profile',
          props: {
            href: '/profile/me'
          }
        },
        {
          type: 'link',
          label: 'Orderbook',
          props: {
            href: '/orderbook'
          }
        },
        {
          type: 'dropdown',
          label: 'Community',
          menu: [
            {
              label: 'Docs',
              onClick: () => {
                window.open('https://docs.infinity.xyz');
              }
            },
            {
              label: 'Twitter',
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            },
            {
              label: 'Discord',
              onClick: () => {
                window.open('http://discord.gg/4VFcGY3W7H');
              }
            },
            {
              label: 'Medium',
              onClick: () => {
                window.open('https://medium.com/@infinitydotxyz');
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

  interface MenuItm {
    label: string;
    onClick: () => void;
  }

  const mobileMenuContent = () => {
    const result: MenuItm[] = [];

    result.push({
      label: 'Trending',
      onClick: () => {
        router.push('/trending');
      }
    });

    result.push({
      label: 'My profile',
      onClick: () => {
        router.push('/profile/me');
      }
    });

    result.push({
      label: 'Orderbook',
      onClick: () => {
        router.push('/orderbook');
      }
    });

    if (!connected) {
      result.push({
        label: 'Connect',
        onClick: signIn
      });
    } else {
      result.push({
        label: 'Sign out',
        onClick: () => {
          signOut();
        }
      });
    }

    result.push({
      label: '-',
      onClick: () => {
        // divider
      }
    });

    result.push({
      label: 'Docs',
      onClick: () => {
        window.open('https://docs.infinity.xyz');
      }
    });
    result.push({
      label: 'Twitter',
      onClick: () => {
        window.open('https://twitter.com/infinitydotxyz');
      }
    });
    result.push({
      label: 'Discord',
      onClick: () => {
        window.open('http://discord.gg/4VFcGY3W7H');
      }
    });
    result.push({
      label: 'Medium',
      onClick: () => {
        window.open('https://medium.com/@infinitydotxyz');
      }
    });

    return result;
  };

  const mobileMenu = (
    <div className="relative flex justify-center">
      <Menu>
        <Menu.Button>
          <GiHamburgerMenu size="24px" />
        </Menu.Button>
        <Menu.Items
          className={twMerge(
            `absolute left-0 mt-2 p-4 w-72 origin-top-right rounded-3xl z-50
            border border-gray-200 bg-white shadow-2xl outline-none`
          )}
        >
          {mobileMenuContent().map((item, i) =>
            item.label === '-' ? (
              <hr key={i} className="my-1" />
            ) : (
              <CustomMenuItem key={i} onClick={item.onClick}>
                {item.label}
              </CustomMenuItem>
            )
          )}
        </Menu.Items>
      </Menu>
    </div>
  );

  const mobileNavbar = (
    <div className="w-full p-4 flex items-center gap-6">
      {mobileMenu}
      <NextLink href="/">
        <SVG.miniLogo className="h-8" />
      </NextLink>

      <SearchInput expanded={true} />
      <ShoppingCartButton />
    </div>
  );

  const desktopNavbar = (
    <div className="w-full bg-white bg-opacity-70 glass font-heading">
      <div className={`${pageStyles} flex space-x-6 items-center py-6 w-full`}>
        <NextLink href="/">
          <SVG.logo className="h-8" />
        </NextLink>

        <Spacer />
        <SearchInput />

        {content?.buttons?.items?.map((item, i) => (
          <React.Fragment key={i}>
            {item.type === 'link' && <NextLink href={item?.props?.href ? item.props.href : ''}>{item?.label}</NextLink>}
            {item.type === 'dropdown' && (
              <div>
                <Menu>
                  <Menu.Button>
                    <div className="flex gap-2 items-center">
                      {item?.label} <IoMdArrowDropdown />
                    </div>
                  </Menu.Button>
                  <Menu.Items
                    className={twMerge(
                      `absolute mt-2 p-4 w-72 origin-top-right rounded-3xl z-50`,
                      `border border-gray-200 bg-white shadow-2xl outline-none`
                    )}
                  >
                    {item?.menu?.map((x, j) => (
                      <CustomMenuItem key={j} onClick={x.onClick}>
                        {x?.label}
                      </CustomMenuItem>
                    ))}
                  </Menu.Items>
                </Menu>
              </div>
            )}
          </React.Fragment>
        ))}
        <ShoppingCartButton />
        <ConnectButton />
      </div>
    </div>
  );

  return (
    <>
      {/* sticky had to be set here rather than desktopNavbar to work */}
      <div className="desktop:visible tabloid:hidden z-10 sticky top-0">{desktopNavbar}</div>
      <div className="desktop:hidden tabloid:visible">{mobileNavbar}</div>
    </>
  );
};

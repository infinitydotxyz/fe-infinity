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

export const Navbar = () => {
  const router = useRouter();

  const content = {
    buttons: {
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
              label: 'Docs',
              onClick: () => {
                router.push('/docs');
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

  const mobileMenu = (
    <div className="relative">
      <Menu>
        <Menu.Button>
          <GiHamburgerMenu size="24px" />
        </Menu.Button>
        <Menu.Items
          className={twMerge(
            `absolute mt-2 p-4 w-72 origin-top-right divide-y divide-gray-100 rounded-3xl z-50
            border border-gray-200 bg-white shadow-2xl outline-none`
          )}
        >
          {content?.buttons?.items?.map((item, i) => (
            <React.Fragment key={i}>
              {item.type === 'link' && (
                <CustomMenuItem key={i} onClick={() => router.push(item.props?.href ?? '')}>
                  {item?.label}
                </CustomMenuItem>
              )}
              {item.type === 'dropdown' && (
                <>
                  <hr className="my-1" />
                  {item?.menu?.map((x, j) => (
                    <CustomMenuItem key={j} onClick={x.onClick}>
                      {x?.label}
                    </CustomMenuItem>
                  ))}
                </>
              )}
            </React.Fragment>
          ))}
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
    </div>
  );

  const desktopNavbar = (
    <div className="w-full z-50 sticky top-0 bg-white bg-opacity-70 glass">
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
                      `absolute mt-2 p-4 w-72 origin-top-right divide-y divide-gray-100 rounded-3xl z-50`,
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
        <div className={`flex space-x-2`}>
          <ShoppingCartButton />
          <ConnectButton />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="desktop:visible tabloid:hidden">{desktopNavbar}</div>
      <div className="desktop:hidden tabloid:visible">{mobileNavbar}</div>
    </>
  );
};

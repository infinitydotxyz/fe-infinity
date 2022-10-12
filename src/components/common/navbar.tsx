import React from 'react';
import { FaTicketAlt, FaAward } from 'react-icons/fa';
import { GiHamburgerMenu, GiOpenBook } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SiReadthedocs, SiDiscord } from 'react-icons/si';
import { BsTwitter, BsFillPersonFill, BsCollectionFill } from 'react-icons/bs';
import { RiMediumFill, RiLogoutCircleFill } from 'react-icons/ri';
import { MdFavorite } from 'react-icons/md';

import { Menu } from '@headlessui/react';
import {
  SVG,
  SearchInput,
  ConnectButton,
  Spacer,
  CustomMenuItem,
  pageStyles,
  NextLink,
  ShoppingCartButton,
  DropdownItem,
  CustomMenuItems,
  MenuSeparator,
  CustomMenuButton,
  CustomMenuContents
} from 'src/components/common';
import { useRouter } from 'next/router';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { MdFeed } from 'react-icons/md';
import { HiCollection, HiTrendingUp } from 'react-icons/hi';

export const Navbar = () => {
  const router = useRouter();

  const { signIn, signOut, user } = useOnboardContext();

  const connected = user?.address ? true : false;
  const iconStyle = 'h-5 w-5 text-black';

  const content = {
    buttons: {
      items: [
        {
          type: 'link',
          label: 'Orderbook',
          props: {
            href: '/orderbook'
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
          label: 'Discover',
          menu: [
            {
              label: 'Trending',
              icon: <HiTrendingUp className={iconStyle} />,
              onClick: () => router.push('/trending')
            },
            {
              label: 'Feed',
              icon: <MdFeed className={iconStyle} />,
              onClick: () => router.push('/feed')
            },
            {
              label: 'Curated',
              icon: <HiCollection className={iconStyle} />,
              onClick: () => router.push('/curated')
            },
            {
              label: 'Favorites',
              onClick: () => router.push('/favorites'),
              icon: <MdFavorite className={iconStyle} />
            },
            {
              label: 'Raffles',
              icon: <FaTicketAlt className={iconStyle} />,
              onClick: () => router.push('/raffles')
            }
          ]
        },
        {
          type: 'dropdown',
          label: 'Community',
          menu: [
            {
              label: 'Read docs',
              icon: <SiReadthedocs className={iconStyle} />,
              onClick: () => {
                window.open('https://docs.infinity.xyz');
              }
            } as DropdownItem,
            {
              label: 'Twitter',
              icon: <BsTwitter className={iconStyle} />,
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            } as DropdownItem,
            {
              label: 'Discord',
              icon: <SiDiscord className={iconStyle} />,
              onClick: () => {
                window.open('https://discord.com/invite/infinitydotxyz');
              }
            } as DropdownItem,
            {
              label: 'Medium',
              icon: <RiMediumFill className={iconStyle} />,
              onClick: () => {
                window.open('https://medium.com/@infinitydotxyz');
              }
            } as DropdownItem
          ]
        }
      ],
      connect: {
        label: 'Connect'
      }
    }
  };

  const mobileMenuContent = () => {
    const result: DropdownItem[] = [];

    result.push({
      label: 'Orderbook',
      icon: <GiOpenBook className={iconStyle} />,
      onClick: () => {
        router.push('/orderbook');
      }
    });

    result.push({
      label: 'Rewards',
      icon: <FaAward className={iconStyle} />,
      onClick: () => {
        router.push('/rewards');
      }
    });

    result.push({
      label: 'Curated',
      icon: <BsCollectionFill className={iconStyle} />,
      onClick: () => {
        router.push('/curated');
      }
    });

    result.push({
      label: 'Favorites',
      icon: <MdFavorite className={iconStyle} />,
      onClick: () => {
        router.push('/favorites');
      }
    });

    result.push({
      label: 'Raffles',
      icon: <FaTicketAlt className={iconStyle} />,
      onClick: () => {
        router.push('/raffles');
      }
    });

    result.push({
      label: 'Trending',
      icon: <HiTrendingUp className={iconStyle} />,
      onClick: () => {
        router.push('/trending');
      }
    });

    result.push({
      label: 'Feed',
      icon: <MdFeed className={iconStyle} />,
      onClick: () => {
        router.push('/feed');
      }
    });

    result.push({
      label: '-',
      onClick: () => {
        // divider
      }
    });

    result.push({
      label: 'Read docs',
      icon: <SiReadthedocs className={iconStyle} />,
      onClick: () => {
        window.open('https://docs.infinity.xyz');
      }
    });
    result.push({
      label: 'Twitter',
      icon: <BsTwitter className={iconStyle} />,
      onClick: () => {
        window.open('https://twitter.com/infinitydotxyz');
      }
    });
    result.push({
      label: 'Discord',
      icon: <SiDiscord className={iconStyle} />,
      onClick: () => {
        window.open('https://discord.com/invite/infinitydotxyz');
      }
    });
    result.push({
      label: 'Medium',
      icon: <RiMediumFill className={iconStyle} />,
      onClick: () => {
        window.open('https://medium.com/@infinitydotxyz');
      }
    });

    result.push({
      label: '-',
      onClick: () => {
        // divider
      }
    });

    if (!connected) {
      result.push({
        label: 'Connect',
        onClick: signIn
      });
    } else {
      result.push({
        label: 'My Profile',
        icon: <BsFillPersonFill className=" h-5 w-5 text-black" />,
        onClick: () => {
          router.push('/profile/me');
        }
      });

      result.push({
        label: 'Sign out',
        icon: <RiLogoutCircleFill className=" h-5 w-5 text-black" />,
        onClick: () => {
          signOut();
        }
      });
    }

    return result;
  };

  const mobileMenu = (
    <Menu>
      {({ open }) => (
        <CustomMenuContents>
          <CustomMenuButton>
            <GiHamburgerMenu size="24px" />
          </CustomMenuButton>
          <CustomMenuItems open={open}>
            {mobileMenuContent().map((item, i) =>
              item.label === '-' ? (
                <MenuSeparator key={i} />
              ) : (
                <CustomMenuItem key={i} onClick={item.onClick}>
                  <div className="flex items-center cursor-pointer">
                    {item.icon && <div className="mr-4">{item.icon}</div>}
                    {item.label}
                  </div>
                </CustomMenuItem>
              )
            )}
          </CustomMenuItems>
        </CustomMenuContents>
      )}
    </Menu>
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
    <div className="w-full bg-white bg-opacity-70 glass font-body">
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
              <Menu>
                {({ open }) => (
                  <CustomMenuContents>
                    <CustomMenuButton className="flex gap-1 items-center select-none">
                      <div>{item?.label}</div>
                      <IoMdArrowDropdown className="h-4 w-4" />
                    </CustomMenuButton>
                    <CustomMenuItems open={open}>
                      {item?.menu?.map((x, j) => (
                        <CustomMenuItem key={j} onClick={x.onClick}>
                          <div className="flex items-center cursor-pointer">
                            {x.icon && <div className="mr-4">{x.icon}</div>}
                            {x.label}
                          </div>
                        </CustomMenuItem>
                      ))}
                    </CustomMenuItems>
                  </CustomMenuContents>
                )}
              </Menu>
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

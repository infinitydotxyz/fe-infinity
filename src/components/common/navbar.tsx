import React from 'react';
import { FaTicketAlt, FaAward } from 'react-icons/fa';
import { GiHamburgerMenu, GiOpenBook } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { SiReadthedocs, SiDiscord } from 'react-icons/si';
import { BsTwitter, BsFillPersonFill, BsCollectionFill } from 'react-icons/bs';
import { RiMediumFill, RiLogoutCircleFill } from 'react-icons/ri';
import { MdFavorite, MdFeed } from 'react-icons/md';

import { Menu } from '@headlessui/react';
import { SVG, ConnectButton, Spacer, pageStyles, NextLink, ShoppingCartButton } from 'src/components/common';
import { useRouter } from 'next/router';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { HiCollection, HiTrendingUp } from 'react-icons/hi';
import { CollectionSearchInput } from './search/collection-search-input';
import {
  ACustomMenuButton,
  ACustomMenuContents,
  ACustomMenuItem,
  ACustomMenuItems,
  ADropdownItem,
  AMenuSeparator
} from '../astra/astra-dropdown';

export const Navbar = () => {
  const router = useRouter();
  const { chainId } = useOnboardContext();

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
            } as ADropdownItem,
            {
              label: 'Twitter',
              icon: <BsTwitter className={iconStyle} />,
              onClick: () => {
                window.open('https://twitter.com/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Discord',
              icon: <SiDiscord className={iconStyle} />,
              onClick: () => {
                window.open('https://discord.com/invite/infinitydotxyz');
              }
            } as ADropdownItem,
            {
              label: 'Medium',
              icon: <RiMediumFill className={iconStyle} />,
              onClick: () => {
                window.open('https://medium.com/@infinitydotxyz');
              }
            } as ADropdownItem
          ]
        }
      ],
      connect: {
        label: 'Connect'
      }
    }
  };

  const mobileMenuContent = () => {
    const result: ADropdownItem[] = [];

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
        <ACustomMenuContents>
          <ACustomMenuButton>
            <GiHamburgerMenu size="24px" />
          </ACustomMenuButton>
          <ACustomMenuItems open={open}>
            {mobileMenuContent().map((item, i) =>
              item.label === '-' ? (
                <AMenuSeparator key={i} />
              ) : (
                <ACustomMenuItem key={i} onClick={item.onClick}>
                  <div className="flex items-center cursor-pointer">
                    {item.icon && <div className="mr-4">{item.icon}</div>}
                    {item.label}
                  </div>
                </ACustomMenuItem>
              )
            )}
          </ACustomMenuItems>
        </ACustomMenuContents>
      )}
    </Menu>
  );

  const mobileNavbar = (
    <div className="w-full p-4 flex items-center gap-6">
      {mobileMenu}
      <NextLink href="/">
        <SVG.miniLogo className="h-8" />
      </NextLink>

      <CollectionSearchInput expanded />
      <ShoppingCartButton />
    </div>
  );

  const desktopNavbar = (
    <div className="w-full bg-white bg-opacity-70 glass font-body">
      {chainId !== '1' && (
        <div className="text-center bg-red-600 text-white py-1">You are not on the Ethereum network</div>
      )}

      <div className={`${pageStyles} flex space-x-6 items-center py-6 w-full`}>
        <NextLink href="/">
          <SVG.miniLogo className="h-8 xl:hidden" />
          <SVG.logo className="h-8 hidden xl:inline-flex" />
        </NextLink>

        <Spacer />
        <CollectionSearchInput />

        {content?.buttons?.items?.map((item, i) => (
          <React.Fragment key={i}>
            {item.type === 'link' && <NextLink href={item?.props?.href ? item.props.href : ''}>{item?.label}</NextLink>}
            {item.type === 'dropdown' && (
              <Menu>
                {({ open }) => (
                  <ACustomMenuContents>
                    <ACustomMenuButton className="flex gap-1 items-center select-none">
                      <div>{item?.label}</div>
                      <IoMdArrowDropdown className="h-4 w-4" />
                    </ACustomMenuButton>
                    <ACustomMenuItems open={open}>
                      {item?.menu?.map((x, j) => (
                        <ACustomMenuItem key={j} onClick={x.onClick}>
                          <div className="flex items-center cursor-pointer">
                            {x.icon && <div className="mr-4">{x.icon}</div>}
                            {x.label}
                          </div>
                        </ACustomMenuItem>
                      ))}
                    </ACustomMenuItems>
                  </ACustomMenuContents>
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

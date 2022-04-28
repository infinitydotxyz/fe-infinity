import React from 'react';
import Link from 'next/link';
// import { GiHamburgerMenu } from 'react-icons/gi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { Menu } from '@headlessui/react';
import { SVG, SearchInput, ConnectButton, Spacer, CustomMenuItem, pageStyles } from 'src/components/common';
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

  return (
    <div className="w-full z-50 sticky top-0 bg-white bg-opacity-70 glass">
      <div className={`${pageStyles} flex space-x-6 items-center py-6 w-full`}>
        <div onClick={() => router.push('/')}>
          <SVG.logo className="h-16 justify-self-start text-center hover:cursor-pointer"></SVG.logo>
        </div>
        <Spacer />
        <div>
          <SearchInput />
        </div>

        {content?.buttons?.items?.map((item, i) => (
          <React.Fragment key={i}>
            {item.type === 'external' && (
              <div>
                <Link passHref href={item?.props?.href ? item.props.href : ''}>
                  {item?.label}
                </Link>
              </div>
            )}
            {item.type === 'link' && (
              <div>
                <Link passHref href={item?.props?.href ? item.props.href : ''}>
                  {item?.label}
                </Link>
              </div>
            )}
            {item.type === 'dropdown' && (
              <div>
                <Menu>
                  <Menu.Button>
                    <div className="flex gap-2 items-center">
                      {item?.label} <IoMdArrowDropdown />{' '}
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
        <div>
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

// <div {...styles?.actions?.items?.mobile}>
// <Menu as="div" {...styles?.actions?.item?.menu?.container}>
//   <Menu.Button {...styles?.actions?.item?.menu?.button}>
//     <GiHamburgerMenu />
//   </Menu.Button>
//   <Menu.Items {...styles?.actions?.item?.menu?.items}>
//     {content?.buttons?.items?.map((item, i) => (
//       <React.Fragment key={i}>
//         {item.type === 'external' && (
//           <Link passHref href={item?.props?.href ? item.props.href : ''}>
//             <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
//               {item?.label}
//             </Menu.Item>
//           </Link>
//         )}
//         {item.type === 'link' && (
//           <Link passHref href={item?.props?.href ? item.props.href : ''}>
//             <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
//               {item?.label}
//             </Menu.Item>
//           </Link>
//         )}
//         {item.type === 'dropdown' && (
//           <>
//             <hr className="my-1" />
//             {item?.menu?.map((x, j) => (
//               <React.Fragment key={j}>
//                 {x.type === 'external' && (
//                   <Link passHref href={x?.props?.href ? x.props.href : ''}>
//                     <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
//                       {x?.label}
//                     </Menu.Item>
//                   </Link>
//                 )}
//                 {x.type === 'link' && (
//                   <Link passHref href={x?.props?.href ? x.props.href : ''}>
//                     <Menu.Item as="button" {...styles?.actions?.item?.menu?.item}>
//                       {x?.label}
//                     </Menu.Item>
//                   </Link>
//                 )}
//               </React.Fragment>
//             ))}
//           </>
//         )}
//       </React.Fragment>
//     ))}
//   </Menu.Items>
// </Menu>
// </div>

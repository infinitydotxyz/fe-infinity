import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { Fragment, ReactNode, useEffect, useState } from 'react';
import { AButton, ARoundButton } from 'src/components/astra/astra-button';
import { EZImage, HelpToolTip, NextLink, Spacer } from 'src/components/common';
import { ProfileTabs } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { hoverColorNewBrandText, iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';
import lightLogo from 'src/images/light-logo.png';
import darkLogo from 'src/images/dark-logo.png';
import {
  AnalyticsBoxIcon,
  ArrowSmallIcon,
  ChevronDown,
  ExploreBoxIcon,
  ItemsBoxIcon,
  OrdersBoxIcon,
  SendBoxIcon,
  SocialXIcon,
  ThemeSwitcherIcon
} from 'src/icons';
import { FaDiscord } from 'react-icons/fa';
import { Dialog, Transition } from '@headlessui/react';

export const SidebarNav = ({ sidebarOpen, setSidebarOpen }) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { address: user } = useAccount();
  const { selectedProfileTab, setSelectedProfileTab } = useAppContext();
  const [logoSrc, setLogoSrc] = useState(darkLogo.src);

  useEffect(() => {
    if (theme === 'dark') {
      setLogoSrc(darkLogo.src);
    } else {
      setLogoSrc(lightLogo.src);
    }
  }, [theme]);

  console.log('path : ', router.asPath.startsWith('/trending'));

  return (
    <>
      {/* Sidebar for mobile devices */}
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 sm:hidden" onClose={setSidebarOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className=" relative mr-0 flex w-full  flex-1">
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-dark-bg px-5 pb-2">
                    <div className="flex -ml-2 mt-2 shrink-0 items-center justify-between">
                      <NextLink className="" href="/">
                        <EZImage src={lightLogo.src} className="w-16 h-16" />
                      </NextLink>
                      <button
                        onClick={() => {
                          setSidebarOpen(!sidebarOpen);
                        }}
                        className="transform -rotate-90 h-10 w-10 rounded-full flex items-center justify-center border border-gray-200 dark:border-dark-borderDark"
                      >
                        <ChevronDown className="h-5.5 w-5.5 mt-0.5 text-neutral-700 dark:text-white" />
                      </button>
                    </div>
                    <div className="flex flex-col h-full justify-start items-start mt-10 gap-5">
                      <SidebarNavItem
                        title="Explore"
                        highlighted={router.asPath.startsWith('/trending')}
                        onClick={() => {
                          setSidebarOpen(false);
                          router.push('/trending');
                        }}
                      >
                        <ExploreBoxIcon
                          className={twMerge(
                            'group-hover:text-white h-10 w-10',
                            router.asPath.startsWith('/trending') && 'text-white dark:text-white'
                          )}
                        />
                      </SidebarNavItem>
                      <SidebarNavItem
                        title="Profile"
                        highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items}
                        onClick={() => {
                          setSidebarOpen(false);
                          setSelectedProfileTab(ProfileTabs.Items);
                          router.push(`/profile/${user}`);
                        }}
                      >
                        <ItemsBoxIcon
                          className={twMerge(
                            'group-hover:text-white',
                            router.asPath.startsWith(`/profile`) &&
                              selectedProfileTab === ProfileTabs.Items &&
                              'text-white dark:text-white'
                          )}
                        />
                      </SidebarNavItem>
                      <SidebarNavItem
                        title="Orders"
                        highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders}
                        onClick={() => {
                          setSidebarOpen(false);
                          setSelectedProfileTab(ProfileTabs.Orders);
                          router.push(`/profile/${user}`);
                        }}
                      >
                        <OrdersBoxIcon
                          className={twMerge(
                            'group-hover:text-white',
                            router.asPath.startsWith(`/profile`) &&
                              selectedProfileTab === ProfileTabs.Orders &&
                              'text-white dark:text-white'
                          )}
                        />
                      </SidebarNavItem>
                      <SidebarNavItem
                        title="Send"
                        highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send}
                        onClick={() => {
                          setSidebarOpen(false);
                          setSelectedProfileTab(ProfileTabs.Send);
                          router.push(`/profile/${user}`);
                        }}
                      >
                        <SendBoxIcon
                          className={twMerge(
                            'group-hover:text-white',
                            router.asPath.startsWith(`/profile`) &&
                              selectedProfileTab === ProfileTabs.Send &&
                              'text-white dark:text-white'
                          )}
                        />
                      </SidebarNavItem>
                      <SidebarNavItem
                        title="Analytics"
                        highlighted={router.asPath.startsWith(`/analytics`)}
                        onClick={() => {
                          setSidebarOpen(false);
                          router.push(`/analytics`);
                        }}
                      >
                        <AnalyticsBoxIcon
                          className={twMerge(
                            'group-hover:text-white',
                            router.asPath.startsWith(`/analytics`) && 'text-white dark:text-white'
                          )}
                        />
                      </SidebarNavItem>

                      <AButton
                        className="w-full flex items-center justify-center  h-[177px] border border-light-borderLight dark:border-dark-borderDark"
                        onClick={() => {
                          setTheme(theme === 'dark' ? 'light' : 'dark');
                          setSidebarOpen(false);
                        }}
                      >
                        <ThemeSwitcherIcon className={hoverColorNewBrandText} />
                      </AButton>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
      {/* Sidebar for desktop */}
      <div
        className={twMerge(
          'hidden sm:flex pb-3 h-full w-19.5 flex-col items-center border-r border-gray-300 dark:border-neutral-200 bg-zinc-500 dark:bg-neutral-800'
        )}
      >
        <div className="border-b border-gray-300 dark:border-neutral-200 w-full pb-1 h-19.5 flex justify-center items-center">
          <NextLink href="/">
            <EZImage src={logoSrc} className="w-14 h-14" />
          </NextLink>
        </div>

        <div className="h-8" />

        <div className="flex flex-col h-full justify-center items-center gap-6">
          <SidebarNavItem
            title="Explore"
            highlighted={router.asPath.startsWith('/trending')}
            onClick={() => {
              router.push('/trending');
            }}
          >
            <ExploreBoxIcon
              className={twMerge(
                'group-hover:text-white',
                router.asPath.startsWith('/trending') && 'text-white dark:text-white'
              )}
            />
          </SidebarNavItem>
          <SidebarNavItem
            title="Profile"
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Items);
              router.push(`/profile/${user}`);
            }}
          >
            <ItemsBoxIcon
              className={twMerge(
                'group-hover:text-white',
                router.asPath.startsWith(`/profile`) &&
                  selectedProfileTab === ProfileTabs.Items &&
                  'text-white dark:text-white'
              )}
            />
          </SidebarNavItem>
          <SidebarNavItem
            title="Orders"
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Orders);
              router.push(`/profile/${user}`);
            }}
          >
            <OrdersBoxIcon
              className={twMerge(
                'group-hover:text-white',
                router.asPath.startsWith(`/profile`) &&
                  selectedProfileTab === ProfileTabs.Orders &&
                  'text-white dark:text-white'
              )}
            />
          </SidebarNavItem>
          <SidebarNavItem
            title="Send"
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Send);
              router.push(`/profile/${user}`);
            }}
          >
            <SendBoxIcon
              className={twMerge(
                'group-hover:text-white',
                router.asPath.startsWith(`/profile`) &&
                  selectedProfileTab === ProfileTabs.Send &&
                  'text-white dark:text-white'
              )}
            />
          </SidebarNavItem>
          <SidebarNavItem
            title="Analytics"
            highlighted={router.asPath.startsWith(`/analytics`)}
            onClick={() => {
              router.push(`/analytics`);
            }}
          >
            <AnalyticsBoxIcon
              className={twMerge(
                'group-hover:text-white',
                router.asPath.startsWith(`/analytics`) && 'text-white dark:text-white'
              )}
            />
          </SidebarNavItem>

          <ARoundButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <ThemeSwitcherIcon className={hoverColorNewBrandText} />
          </ARoundButton>

          <Spacer />

          <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Twitter</div>}>
            <AButton className="rounded-lg">
              <a
                aria-label="Twitter"
                href="https://twitter.com/pixlso"
                rel="external nofollow noopener noreferrer"
                target="_blank"
              >
                <SocialXIcon
                  className={twMerge(iconButtonStyle, hoverColorNewBrandText, 'h-5 w-5.5')}
                  aria-hidden="true"
                />
              </a>
            </AButton>
          </HelpToolTip>

          <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Discord</div>}>
            <AButton className="rounded-lg">
              <a
                aria-label="Discord"
                href="https://discord.gg/pixlso"
                rel="external nofollow noopener noreferrer"
                target="_blank"
              >
                <FaDiscord
                  className={twMerge(iconButtonStyle, hoverColorNewBrandText, 'text-neutral-300 h-5 w-6.5')}
                  aria-hidden="true"
                />
              </a>
            </AButton>
          </HelpToolTip>
        </div>
      </div>
    </>
  );
};

export const SidebarNavItem = ({
  title,
  children,
  highlighted,
  onClick
}: {
  title: string;
  children: ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="group flex flex-row gap-2.5 sm:gap-0 sm:flex-col items-center">
      <HelpToolTip placement="right" content={<div className="whitespace-nowrap">{title}</div>}>
        <AButton
          highlighted={highlighted}
          onClick={onClick}
          className={twMerge('rounded-lg group-hover:bg-yellow-700 w-max p-0', highlighted && 'bg-yellow-700')}
        >
          {children}
        </AButton>
      </HelpToolTip>
      <div
        className={twMerge(
          'font-medium text-lg mb-2 sm:mb-0 sm:text-sm cursor-pointer group-hover:text-yellow-700 text-dark-border dark:text-light-border text-center',
          highlighted && 'text-yellow-700 dark:text-yellow-700'
        )}
      >
        {title}
      </div>
    </div>
  );
};
export const FooterNavItem = ({
  title,
  children,
  highlighted,
  onClick
}: {
  title: string;
  children?: ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
}) => {
  return (
    <div className="group flex flex-col items-center">
      {children && (
        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">{title}</div>}>
          <AButton
            highlighted={highlighted}
            onClick={onClick}
            className={twMerge('rounded-lg group-hover:bg-yellow-700 w-max p-0', highlighted && 'bg-yellow-700')}
          >
            {children}
          </AButton>
        </HelpToolTip>
      )}
      {title && (
        <div
          onClick={onClick}
          className={twMerge(
            'font-medium text-base cursor-pointer group-hover:text-yellow-700 text-amber-700 text-center',
            highlighted && 'text-yellow-700 dark:text-yellow-700'
          )}
        >
          {title}
        </div>
      )}
    </div>
  );
};

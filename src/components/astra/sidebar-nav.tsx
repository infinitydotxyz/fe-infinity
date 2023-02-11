import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { ProfileTabs } from 'pages/profile/[address]';
import { BiGlobeAlt, BiWalletAlt } from 'react-icons/bi';
import { HiOutlineTag } from 'react-icons/hi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { AButton, ARoundButton } from 'src/components/astra/astra-button';
import { EZImage, HelpToolTip, NextLink, Spacer } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { borderColor, hoverColorBrandText, iconButtonStyle, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TbSend } from 'react-icons/tb';
import { useAccount } from 'wagmi';
import flowLogo from 'src/images/flow-logo.png';

export const SidebarNav = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { address: user } = useAccount();
  const { selectedProfileTab, setSelectedProfileTab } = useAppContext();

  return (
    <div
      className={twMerge(
        secondaryBgColor,
        'flex px-2 py-3 h-full w-[4rem] flex-col items-center border-r-[1px]',
        borderColor
      )}
    >
      <NextLink href="/trending">
        <EZImage src={flowLogo.src} className="w-9 h-9" />
      </NextLink>

      <div className="h-12" />

      <div className="flex flex-col space-y-4">
        <div className="font-medium text-xs text-dark-border dark:text-light-border tracking-wide text-center">
          Explore
        </div>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Trending</div>}>
          <AButton
            highlighted={router.asPath.startsWith('/trending')}
            onClick={() => {
              router.push('/trending');
            }}
          >
            <BiGlobeAlt
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith('/trending') ? 'text-brand-primary' : 'text-gray-400'
              )}
            />
          </AButton>
        </HelpToolTip>

        <div className="font-medium text-xs text-dark-border dark:text-light-border tracking-wide text-center">
          Wallet
        </div>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Profile</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Items);
              router.push(`/profile/${user}`);
            }}
          >
            <BiWalletAlt
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items
                  ? 'text-brand-primary'
                  : 'text-gray-400'
              )}
            />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Orders</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Orders);
              router.push(`/profile/${user}`);
            }}
          >
            <HiOutlineTag
              style={{ transform: 'rotate(90deg)' }}
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders
                  ? 'text-brand-primary'
                  : 'text-gray-400'
              )}
            />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Send</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send}
            onClick={() => {
              setSelectedProfileTab(ProfileTabs.Send);
              router.push(`/profile/${user}`);
            }}
          >
            <TbSend
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send
                  ? 'text-brand-primary'
                  : 'text-gray-400'
              )}
            />
          </AButton>
        </HelpToolTip>
      </div>

      <Spacer />
      <ARoundButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <MdLightMode className={iconButtonStyle} /> : <MdDarkMode className={iconButtonStyle} />}
      </ARoundButton>
    </div>
  );
};

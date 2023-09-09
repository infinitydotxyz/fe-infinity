import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiGlobeAlt, BiWalletAlt } from 'react-icons/bi';
import { HiOutlineTag } from 'react-icons/hi';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { TbSend } from 'react-icons/tb';
import { AButton, ARoundButton } from 'src/components/astra/astra-button';
import { EZImage, HelpToolTip, NextLink, Spacer } from 'src/components/common';
import { ProfileTabs } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import {
  borderColor,
  brandTextColor,
  hoverColorBrandText,
  iconButtonStyle,
  secondaryBgColor,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';
import lightLogo from 'src/images/light-logo.png';
import darkLogo from 'src/images/dark-logo.png';
import { GiJeweledChalice } from 'react-icons/gi';
import { RxDiscordLogo } from 'react-icons/rx';
import { TfiTwitter } from 'react-icons/tfi';
import { AiOutlineRead } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';

export const SidebarNav = () => {
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

  return (
    <div
      className={twMerge(
        secondaryBgColor,
        'flex px-2 pt-1 pb-3 h-full w-[4rem] flex-col items-center border-r-[1px]',
        borderColor
      )}
    >
      <NextLink href="/">
        <EZImage src={logoSrc} className="w-14 h-14" />
      </NextLink>

      <div className="h-8" />

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
            className="rounded-lg"
          >
            <BiGlobeAlt
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith('/trending') ? brandTextColor : textColor
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
            className="rounded-lg"
          >
            <BiWalletAlt
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items
                  ? brandTextColor
                  : textColor
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
            className="rounded-lg"
          >
            <HiOutlineTag
              style={{ transform: 'rotate(90deg)' }}
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders
                  ? brandTextColor
                  : textColor
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
            className="rounded-lg"
          >
            <TbSend
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send
                  ? brandTextColor
                  : textColor
              )}
            />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Rewards</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/rewards`)}
            onClick={() => {
              router.push(`/rewards`);
            }}
            className="rounded-lg"
          >
            <GiJeweledChalice
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/rewards`) ? brandTextColor : textColor
              )}
            />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Analytics</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/analytics`)}
            onClick={() => {
              router.push(`/analytics`);
            }}
            className="rounded-lg"
          >
            <IoAnalyticsOutline
              className={twMerge(
                iconButtonStyle,
                hoverColorBrandText,
                router.asPath.startsWith(`/analytics`) ? brandTextColor : textColor
              )}
            />
          </AButton>
        </HelpToolTip>

        <div className="font-medium text-xs text-dark-border dark:text-light-border tracking-wide text-center">
          Socials
        </div>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Discord</div>}>
          <AButton className="rounded-lg">
            <a
              aria-label="Discord"
              href="https://discord.gg/pixlso"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              <RxDiscordLogo className={twMerge(iconButtonStyle, hoverColorBrandText)} aria-hidden="true" />
            </a>
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Twitter</div>}>
          <AButton className="rounded-lg">
            <a
              aria-label="Twitter"
              href="https://twitter.com/pixlso"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              <TfiTwitter className={twMerge(iconButtonStyle, hoverColorBrandText)} aria-hidden="true" />
            </a>
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Docs</div>}>
          <AButton className="rounded-lg">
            <a
              aria-label="Docs"
              href="https://docs.pixl.so"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              <AiOutlineRead className={twMerge(iconButtonStyle, hoverColorBrandText)} aria-hidden="true" />
            </a>
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

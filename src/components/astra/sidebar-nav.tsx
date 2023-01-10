import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { IoWalletOutline } from 'react-icons/io5';
import { MdDarkMode, MdLightMode, MdOutlineHomeMax } from 'react-icons/md';
import { AButton, ARoundButton } from 'src/components/astra/astra-button';
import { HelpToolTip, NextLink, Spacer, SVG } from 'src/components/common';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { borderColor, iconButtonStyle, secondaryBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const SidebarNav = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { user } = useOnboardContext();

  return (
    <div
      className={twMerge(
        secondaryBgColor,
        'flex px-2 py-3 h-full w-[4rem] flex-col items-center border-r-[1px]',
        borderColor
      )}
    >
      <NextLink href="/trending">
        {theme === 'dark' ? (
          <SVG.miniLogoDark className="shrink-0 h-9 w-9" />
        ) : (
          <SVG.miniLogo className="shrink-0 h-9 w-9" />
        )}
      </NextLink>

      <div className="h-8" />

      <div className="flex flex-col space-y-4">
        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Trending</div>}>
          <AButton
            highlighted={router.asPath.startsWith('/trending') || router.asPath.startsWith('/?tab')}
            onClick={() => {
              router.push('/trending');
            }}
          >
            <MdOutlineHomeMax className={iconButtonStyle} />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Profile</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/profile`)}
            onClick={() => {
              router.push(`/profile/${user?.address}/items`);
            }}
          >
            <IoWalletOutline className={iconButtonStyle} />
          </AButton>
        </HelpToolTip>

        {/* <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Raffles</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/raffles`)}
            onClick={() => {
              router.push(`/raffles`);
            }}
          >
            <HiOutlineTicket className={iconButtonStyle} />
          </AButton>
        </HelpToolTip>

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Rewards</div>}>
          <AButton
            highlighted={router.asPath.startsWith(`/rewards`)}
            onClick={() => {
              router.push(`/rewards`);
            }}
          >
            <RiCoinsLine className={iconButtonStyle} />
          </AButton>
        </HelpToolTip> */}
      </div>

      <Spacer />
      <ARoundButton onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <MdLightMode className="h-8 w-8" /> : <MdDarkMode className="h-8 w-8" />}
      </ARoundButton>
    </div>
  );
};

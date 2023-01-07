import { useRouter } from 'next/router';
import { HiOutlineTicket } from 'react-icons/hi';
import { IoWalletOutline } from 'react-icons/io5';
import { MdOutlineHomeMax } from 'react-icons/md';
import { RiCoinsLine } from 'react-icons/ri';
import { AButton } from 'src/components/astra/astra-button';
import { HelpToolTip, NextLink, Spacer, SVG } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { iconButtonStyle, infoBoxBgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const SidebarNav = () => {
  const { darkMode } = useAppContext();
  const router = useRouter();
  const { user } = useOnboardContext();

  return (
    <div className={twMerge(infoBoxBgColor, 'flex px-2 py-3 h-full w-[4.5rem] flex-col items-center border-r-2')}>
      <NextLink href="/">
        {darkMode ? <SVG.miniLogoDark className="shrink-0 h-9 w-9" /> : <SVG.miniLogo className="shrink-0 h-9 w-9" />}
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

        <HelpToolTip placement="right" content={<div className="whitespace-nowrap">Raffles</div>}>
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
        </HelpToolTip>
      </div>

      <Spacer />
      {/* <ARoundButton
        onClick={() => {
          setDarkMode(!darkMode);
        }}
      >
        {darkMode ? <MdLightMode className="h-8 w-8" /> : <MdDarkMode className="h-8 w-8" />}
      </ARoundButton> */}
    </div>
  );
};

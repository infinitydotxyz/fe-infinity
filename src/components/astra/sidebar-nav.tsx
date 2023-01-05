import { useRouter } from 'next/router';
import { BsHouse, BsReceipt, BsTrophy, BsWallet2 } from 'react-icons/bs';
import { ARoundButton } from 'src/components/astra/astra-button';
import { HelpTip, NextLink, Spacer, SVG } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { infoBoxBGClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const SidebarNav = () => {
  const { darkMode } = useAppContext();
  const router = useRouter();
  const { user } = useOnboardContext();

  return (
    <div className={twMerge(infoBoxBGClr, 'flex px-2 py-4 h-full flex-col items-center border-r-2')}>
      <NextLink href="/">
        {darkMode ? <SVG.miniLogoDark className="shrink-0 h-8 w-8" /> : <SVG.miniLogo className="shrink-0 h-8 w-8" />}
      </NextLink>

      <div className="h-24" />

      <div className="flex flex-col space-y-4">
        <HelpTip placement="right" content={<div className="whitespace-nowrap">Trending</div>}>
          <ARoundButton
            highlighted={true}
            onClick={() => {
              router.push('/trending');
            }}
          >
            <BsHouse className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Profile</div>}>
          <ARoundButton
            highlighted={router.asPath === `/profile/${user?.address}/items`}
            onClick={() => {
              router.push(`/profile/${user?.address}/items`);
            }}
          >
            <BsWallet2 className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Raffles</div>}>
          <ARoundButton
            highlighted={router.asPath === `/raffles`}
            onClick={() => {
              router.push(`/raffles`);
            }}
          >
            <BsReceipt className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Rewards</div>}>
          <ARoundButton
            highlighted={router.asPath === `/rewards`}
            onClick={() => {
              router.push(`/rewards`);
            }}
          >
            <BsTrophy className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>
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

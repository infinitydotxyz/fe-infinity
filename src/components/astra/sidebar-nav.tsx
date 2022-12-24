import { useRouter } from 'next/router';
import { BsHouse, BsWallet2 } from 'react-icons/bs';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { ARoundButton } from 'src/components/astra';
import { HelpTip, NextLink, Spacer, SVG } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';

export const SidebarNav = () => {
  const { darkMode, setDarkMode } = useAppContext();
  const router = useRouter();

  return (
    <div className="flex px-2 py-4 h-full flex-col items-center ">
      <NextLink href="/">
        {darkMode ? <SVG.miniLogoDark className="shrink-0 h-8 w-8" /> : <SVG.miniLogo className="shrink-0 h-8 w-8" />}
      </NextLink>

      <div className="h-24" />

      <div className="flex flex-col space-y-4">
        <HelpTip placement="right" content={<div className="whitespace-nowrap">Trending</div>}>
          <ARoundButton
            highlighted={true}
            onClick={() => {
              router.push('/v3/trending');
            }}
          >
            <BsHouse className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Profile</div>}>
          <ARoundButton
            highlighted={router.asPath === '/profile/me'}
            onClick={() => {
              router.push('/v3/profile/me');
            }}
          >
            <BsWallet2 className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          setDarkMode(!darkMode);
        }}
      >
        {darkMode ? <MdLightMode className="h-8 w-8" /> : <MdDarkMode className="h-8 w-8" />}
      </ARoundButton>
    </div>
  );
};

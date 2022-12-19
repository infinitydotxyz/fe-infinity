import { HelpTip, NextLink, Spacer, SVG } from 'src/components/common';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { AiOutlineSend, AiOutlineTag } from 'react-icons/ai';
import { BsWallet2, BsHouse, BsCollection } from 'react-icons/bs';
import { useAppContext } from 'src/utils/context/AppContext';
import { ARoundButton } from 'src/components/astra';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useRouter } from 'next/router';

export const SidebarNav = () => {
  const { darkMode, setDarkMode } = useAppContext();
  const { showCollections, setShowCollections } = useDashboardContext();
  const router = useRouter();

  return (
    <div className="flex px-2 py-4 h-full flex-col items-center ">
      <NextLink href="/">
        {darkMode ? <SVG.miniLogoDark className="shrink-0 h-8 w-8" /> : <SVG.miniLogo className="shrink-0 h-8 w-8" />}
      </NextLink>

      <div className="h-24" />

      <div className="flex flex-col space-y-4">
        <HelpTip placement="right" content={<div className="whitespace-nowrap">Tokens</div>}>
          <ARoundButton
            highlighted={showCollections}
            onClick={() => {
              router.push('/new');
            }}
          >
            <BsHouse className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Sell</div>}>
          <ARoundButton
            onClick={() => {
              // setDarkMode(!darkMode);
            }}
          >
            <AiOutlineTag className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Profile</div>}>
          <ARoundButton
            highlighted={router.asPath === '/profile/me'}
            onClick={() => {
              router.push('/profile/me');
            }}
          >
            <BsWallet2 className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>

        <HelpTip placement="right" content={<div className="whitespace-nowrap">Send</div>}>
          <ARoundButton
            onClick={() => {
              // setDarkMode(!darkMode);
            }}
          >
            <AiOutlineSend className="h-8 w-8" />
          </ARoundButton>
        </HelpTip>
      </div>

      <HelpTip placement="right" content={<div className="whitespace-nowrap">Collections</div>}>
        <ARoundButton
          highlighted={showCollections}
          onClick={() => {
            setShowCollections(!showCollections);
          }}
        >
          <BsCollection className="h-8 w-8" />
        </ARoundButton>
      </HelpTip>

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
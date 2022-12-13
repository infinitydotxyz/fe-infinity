import { HelpTip, Spacer, SVG } from 'src/components/common';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { AiOutlineSend, AiOutlineTag } from 'react-icons/ai';
import { BsWallet2, BsCollection } from 'react-icons/bs';
import { useAppContext } from 'src/utils/context/AppContext';
import { ARoundButton } from 'src/components/astra';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

export const SidebarNav = () => {
  const { darkMode, setDarkMode } = useAppContext();
  const { showCollections, setShowCollections } = useDashboardContext();

  return (
    <div className="flex px-2 py-4 h-full flex-col items-center ">
      {darkMode ? <SVG.miniLogoDark className="shrink-0 h-8 w-8" /> : <SVG.miniLogo className="shrink-0 h-8 w-8" />}

      <div className="h-24" />

      <div className="flex flex-col space-y-4">
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
            onClick={() => {
              // setDarkMode(!darkMode);
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

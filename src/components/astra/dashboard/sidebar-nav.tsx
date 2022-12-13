import { Spacer, SVG } from 'src/components/common';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { GrSend, GrTag } from 'react-icons/gr';
import { BsWallet2 } from 'react-icons/bs';

import { useAppContext } from 'src/utils/context/AppContext';
import { ARoundButton } from 'src/components/astra';

export const SidebarNav = () => {
  const { darkMode, setDarkMode } = useAppContext();

  return (
    <div className="flex px-2 py-4 h-full flex-col items-center ">
      {darkMode ? <SVG.miniLogoDark className="shrink-0 h-8 w-8" /> : <SVG.miniLogo className="shrink-0 h-8 w-8" />}

      <div className="h-24" />

      <div className="flex flex-col space-y-4">
        <ARoundButton
          onClick={() => {
            // setDarkMode(!darkMode);
          }}
        >
          <GrTag className="h-8 w-8" />
        </ARoundButton>

        <ARoundButton
          onClick={() => {
            // setDarkMode(!darkMode);
          }}
        >
          <BsWallet2 className="h-8 w-8" />
        </ARoundButton>

        <ARoundButton
          onClick={() => {
            // setDarkMode(!darkMode);
          }}
        >
          <GrSend className="h-8 w-8" />
        </ARoundButton>
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

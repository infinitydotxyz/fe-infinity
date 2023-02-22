import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { BiCarousel, BiGlobeAlt } from 'react-icons/bi';
import { FiTarget } from 'react-icons/fi';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { RxDiscordLogo } from 'react-icons/rx';
import { TfiTwitter } from 'react-icons/tfi';
import { HelpToolTip } from 'src/components/common';
import { SnipeModal } from 'src/components/common/snipe-modal';
import { MouseProvider } from 'src/utils/context/MouseProvider';
import { twMerge } from 'tailwind-merge';
import { borderColor, hoverColorBrandText } from '../ui-constants';
import DockItem from './DockItem';
import { DockContextType } from './types';

/**
 * <DockContext> provider.
 * @param hovered - If is hovering <nav> element.
 * @param width - The width of <nav> element.
 */
const DockContext = createContext<DockContextType | null>(null);

export const useDock = () => {
  return useContext(DockContext);
};

const Dock = () => {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [width, setWidth] = useState<number | undefined>();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  // const { address: user } = useAccount();
  // const { selectedProfileTab, setSelectedProfileTab } = useAppContext();
  const [dockHeight, setDockHeight] = useState('h-10');
  const [dockItemClassname, setDockItemClassname] = useState('bottom-0.5');
  const [snipeModalOpen, setSnipeModalOpen] = useState(false);

  useEffect(() => {
    setWidth(ref?.current?.clientWidth);
  }, []);

  const divider = (
    <li className="self-center" aria-hidden="true">
      <hr className="!mx-2 block h-6 w-px border-none bg-[hsl(0,0%,78%)]" />
    </li>
  );

  const itemClassname = 'relative flex items-center w-full h-full justify-center';
  const iconClassname = 'relative h-3/5 w-3/5';

  return (
    <MouseProvider>
      <footer className="fixed inset-x-0 bottom-1 z-40 flex w-full justify-center">
        <DockContext.Provider value={{ hovered, width }}>
          <nav
            ref={ref}
            className={twMerge(
              'flex justify-center items-center rounded-lg p-4 border bg-opacity-40 backdrop-blur-3xl',
              borderColor
            )}
            onMouseOver={() => {
              setHovered(true);
              setDockHeight('h-10');
              setDockItemClassname('bottom-0');
            }}
            onMouseOut={() => {
              setHovered(false);
              setDockHeight('h-2');
              setDockItemClassname('bottom-0.5');
            }}
          >
            <ul className={twMerge('flex items-center justify-center space-x-3', dockHeight)}>
              <DockItem className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Flow</div>}>
                  <div className={itemClassname}>
                    <FiTarget
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        setSnipeModalOpen(!snipeModalOpen);
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem>

              <DockItem highlighted={router.asPath.startsWith('/trending')} className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Explore</div>}>
                  <div className={itemClassname}>
                    <BiGlobeAlt
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        router.push('/trending');
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem>

              <DockItem highlighted={router.asPath.startsWith('/sets')} className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Sets</div>}>
                  <div className={itemClassname}>
                    <BiCarousel
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        router.push('/sets');
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem>

              {divider}

              {/* <DockItem
                highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Items}
                className={dockItemClassname}
              >
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Wallet</div>}>
                  <div className={itemClassname}>
                    <BiWalletAlt
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        setSelectedProfileTab(ProfileTabs.Items);
                        router.push(`/profile/${user}`);
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem> */}

              {/* <DockItem
                highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Orders}
                className={dockItemClassname}
              >
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Orders</div>}>
                  <div className={itemClassname}>
                    <HiOutlineTag
                      style={{ transform: 'rotate(90deg)' }}
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        setSelectedProfileTab(ProfileTabs.Orders);
                        router.push(`/profile/${user}`);
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem> */}

              {/* <DockItem
                highlighted={router.asPath.startsWith(`/profile`) && selectedProfileTab === ProfileTabs.Send}
                className={dockItemClassname}
              >
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Send</div>}>
                  <div className={itemClassname}>
                    <TbSend
                      className={twMerge(iconClassname, hoverColorBrandText)}
                      onClick={() => {
                        setSelectedProfileTab(ProfileTabs.Send);
                        router.push(`/profile/${user}`);
                      }}
                    />
                  </div>
                </HelpToolTip>
              </DockItem> */}

              {divider}

              <DockItem className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Discord</div>}>
                  <a
                    className={itemClassname}
                    aria-label="Discord"
                    href="https://discord.gg/flowdotso"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    <RxDiscordLogo className={twMerge(iconClassname, hoverColorBrandText)} aria-hidden="true" />
                  </a>
                </HelpToolTip>
              </DockItem>

              <DockItem className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Twitter</div>}>
                  <a
                    className={itemClassname}
                    aria-label="Twitter"
                    href="https://twitter.com/flowdotso"
                    rel="external nofollow noopener noreferrer"
                    target="_blank"
                  >
                    <TfiTwitter className={twMerge(iconClassname, hoverColorBrandText)} aria-hidden="true" />
                  </a>
                </HelpToolTip>
              </DockItem>

              {divider}

              <DockItem className={dockItemClassname}>
                <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Theme</div>}>
                  <div onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={twMerge(itemClassname)}>
                    {theme === 'dark' ? (
                      <MdOutlineLightMode className={twMerge(iconClassname, hoverColorBrandText)} />
                    ) : (
                      <MdOutlineDarkMode className={twMerge(iconClassname, hoverColorBrandText)} />
                    )}
                  </div>
                </HelpToolTip>
              </DockItem>
            </ul>
          </nav>
        </DockContext.Provider>
      </footer>

      {snipeModalOpen && <SnipeModal modalOpen={snipeModalOpen} setModalOpen={setSnipeModalOpen} />}
    </MouseProvider>
  );
};

export default Dock;

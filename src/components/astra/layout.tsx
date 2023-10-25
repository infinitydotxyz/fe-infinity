import { useTheme } from 'next-themes';
import { ReactNode, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AstraCart } from 'src/components/astra/astra-cart';
import { Grid } from 'src/components/astra/grid';
import { useAppContext } from 'src/utils/context/AppContext';
import { EZImage, NextLink, toastError } from '../common';
import { ANavbar } from './astra-navbar';
import NonSsrWrapper from './non-ssr-wrapper';
import { FooterNavItem, SidebarNav } from './sidebar-nav';
import lightLogo from 'src/images/light-logo.png';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';
import { BookIcon, SocialXIcon } from 'src/icons';
import { AButton } from './astra-button';
import { FaDiscord } from 'react-icons/fa';
import Link from 'next/link';
interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const {
    handleTokenSend,
    handleTokenCheckout,
    handleCollCheckout,
    handleOrdersCancel,
    nftSelection,
    clearNFTSelection,
    removeNFTFromSelection,
    collSelection,
    clearCollSelection,
    removeCollFromSelection,
    orderSelection,
    clearOrderSelection,
    removeOrderFromSelection,
    setIsCheckingOut
  } = useAppContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { ref: containerRef } = useResizeDetector();

  const { theme } = useTheme();
  const darkMode = theme === 'dark';
  const router = useRouter();
  const cart = (
    <NonSsrWrapper>
      <AstraCart
        onCheckout={async () => {
          try {
            if (nftSelection.length > 0) {
              const result = await handleTokenCheckout(nftSelection);
              result && clearNFTSelection();
            } else if (collSelection.length > 0) {
              const result = await handleCollCheckout(collSelection);
              result && clearCollSelection();
            } else if (orderSelection.length > 0) {
              const result = await handleOrdersCancel(orderSelection);
              result && clearOrderSelection();
            }

            setIsCheckingOut(false);
          } catch (e) {
            console.error(e);
            toastError(String(e), darkMode);
          }
        }}
        onTokenSend={async (value) => {
          const result = await handleTokenSend(nftSelection, value);
          result && clearNFTSelection();
          setIsCheckingOut(false);
        }}
        onTokenRemove={(value) => {
          removeNFTFromSelection(value);
        }}
        onCollRemove={(value) => {
          removeCollFromSelection(value);
        }}
        onOrderRemove={(value) => {
          removeOrderFromSelection(value);
        }}
        onTokensClear={() => {
          clearNFTSelection();
        }}
        onCollsClear={() => {
          clearCollSelection();
        }}
        onOrdersClear={() => {
          clearOrderSelection();
        }}
      />
    </NonSsrWrapper>
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const footer = (
    <div className="flex flex-col gap-2.5">
      <div className="h-0.25 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-0.5 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-1 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-1.5 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-2.5 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-3.75 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-3.75 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-5.25 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-6.5 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-8.25 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="h-9.25 bg-gray-100 dark:bg-neutral-400 w-full"> </div>
      <div className="flex flex-col items-center jusitfy-center bg-gray-100 dark:bg-neutral-400 w-full pt-6.25 pb-2.5 px-5">
        <NextLink className="mb-5" href="/">
          <EZImage src={lightLogo.src} className="w-25 h-25" />
        </NextLink>
        <div className="flex flex-col sm:flex-row items-center gap-3.75">
          <FooterNavItem
            title="Explore"
            highlighted={router.asPath.startsWith('/trending')}
            onClick={() => {
              router.push('/trending');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Profile"
            highlighted={router.asPath.startsWith('/profile')}
            onClick={() => {
              router.push('/profile');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Rewards"
            highlighted={router.asPath.startsWith('/rewards')}
            onClick={() => {
              router.push('/rewards');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Analytics"
            highlighted={router.asPath.startsWith('/analytics')}
            onClick={() => {
              router.push('/analytics');
            }}
          ></FooterNavItem>
          <FooterNavItem
            title="Docs"
            highlighted={router.asPath.startsWith('/docs')}
            onClick={() => {
              router.push('/docs');
            }}
          ></FooterNavItem>
        </div>
        <div className="flex items-center justify-center gap-2.5 mt-5">
          <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
            <a
              aria-label="Twitter"
              href="https://twitter.com/pixlso"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              <SocialXIcon
                className={twMerge('text-neutral-300 group-hover:text-white h-5 w-5.5')}
                aria-hidden="true"
              />
            </a>
          </AButton>
          <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
            <a
              aria-label="Discord"
              href="https://discord.gg/pixlso"
              rel="external nofollow noopener noreferrer"
              target="_blank"
            >
              <FaDiscord className={twMerge('text-neutral-300 group-hover:text-white h-5 w-6.5')} aria-hidden="true" />
            </a>
          </AButton>
          <AButton className="group rounded-lg p-5 bg-light-borderLight dark:bg-neutral-800 dark:hover:bg-yellow-700 hover:bg-yellow-700 hover:text-white">
            <BookIcon className={twMerge('text-neutral-300 group-hover:text-white h-5 w-6.5')} />
          </AButton>
        </div>
        <div className="mt-3.75 flex items-center gap-5">
          <Link
            href="#"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            ©️ 2023 pixl.so, Inc
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm font-medium text-neutral-300 dark:text-neutral-700 hover:text-neutral-700 dark:hover:text-white"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );

  return Grid(
    <ANavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />,
    <SidebarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />,
    <>{children}</>,
    cart,
    footer,
    gridRef,
    containerRef
  );
};

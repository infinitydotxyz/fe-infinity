import { useTheme } from 'next-themes';
import { ReactNode, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AstraCart } from 'src/components/astra/astra-cart';
import { Grid } from 'src/components/astra/grid';
import { useAppContext } from 'src/utils/context/AppContext';
import { toastError } from '../common';
import { ANavbar } from './astra-navbar';
import NonSsrWrapper from './non-ssr-wrapper';
import { SidebarNav } from './sidebar-nav';

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

  const footer = <></>;

  return Grid(<ANavbar />, <SidebarNav />, <>{children}</>, cart, footer, gridRef, containerRef);
};

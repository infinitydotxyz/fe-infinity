import { ReactNode, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AstraCart } from 'src/components/astra/astra-cart';
import { Grid } from 'src/components/astra/grid';
import { useAppContext } from 'src/utils/context/AppContext';
import { toastError } from '../common';
import { ANavbar } from './astra-navbar';
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
    removeOrderFromSelection
  } = useAppContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { ref: containerRef } = useResizeDetector();

  const cart = (
    <AstraCart
      tokens={nftSelection}
      collections={collSelection}
      orders={orderSelection}
      onCheckout={async () => {
        try {
          if (nftSelection.length > 0) {
            await handleTokenCheckout(nftSelection);
            clearNFTSelection();
          } else if (collSelection.length > 0) {
            await handleCollCheckout(collSelection);
            clearCollSelection();
          } else if (orderSelection.length > 0) {
            await handleOrdersCancel(orderSelection);
            clearOrderSelection();
          }
        } catch (e) {
          console.log(e);
          toastError(e);
        }
      }}
      onTokenSend={async (value) => {
        await handleTokenSend(nftSelection, value);
        clearNFTSelection();
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
    />
  );

  const footer = <></>;

  return Grid(<ANavbar />, <SidebarNav />, <>{children}</>, cart, footer, gridRef, containerRef);
};

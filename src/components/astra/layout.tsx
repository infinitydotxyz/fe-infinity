import { ReactNode, useEffect, useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { AstraCart } from 'src/components/astra/astra-cart';
import { MainDashboardGrid } from 'src/components/astra/dashboard/main-grid-dashboard';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { toastError } from '../common';
import { ANavbar } from './astra-navbar';
import { SidebarNav } from './sidebar-nav';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const {
    collection,
    handleTokenSend,
    handleTokenCheckout,
    handleCollCheckout,
    handleOrdersCancel,
    selection,
    clearSelection,
    removeFromSelection,
    collSelection,
    clearCollSelection,
    removeCollFromSelection,
    orderSelection,
    clearOrderSelection,
    removeOrderFromSelection
  } = useDashboardContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { ref: containerRef } = useResizeDetector();

  useEffect(() => {
    gridRef.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  const cart = (
    <AstraCart
      tokens={selection}
      collections={collSelection}
      orders={orderSelection}
      onCheckout={async () => {
        try {
          if (selection.length > 0) {
            await handleTokenCheckout(selection);
            clearSelection();
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
        await handleTokenSend(selection, value);
        clearSelection();
      }}
      onTokensRemove={(value) => {
        removeFromSelection(value);
      }}
      onCollsRemove={(value) => {
        removeCollFromSelection(value);
      }}
      onOrdersRemove={(value) => {
        removeOrderFromSelection(value);
      }}
    />
  );

  const footer = <></>;

  return MainDashboardGrid(<ANavbar />, <SidebarNav />, <>{children}</>, cart, footer, gridRef, containerRef);
};

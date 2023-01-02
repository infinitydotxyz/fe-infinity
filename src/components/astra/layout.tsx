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
    setGridWidth,
    handleTokenSend,
    handleTokenCheckout,
    handleCollCheckout,
    selection,
    clearSelection,
    removeFromSelection,
    collSelection,
    clearCollSelection,
    removeCollFromSelection
  } = useDashboardContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { width: containerWidth, ref: containerRef } = useResizeDetector();

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      setGridWidth(containerWidth);
    }
  }, [containerWidth]);

  useEffect(() => {
    gridRef.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  const cart = (
    <AstraCart
      tokens={selection}
      collections={collSelection}
      onCheckout={async () => {
        try {
          console.log('checkout');
          if (selection.length > 0) {
            await handleTokenCheckout(selection);
            clearSelection();
          } else if (collSelection.length > 0) {
            await handleCollCheckout(collSelection);
            clearCollSelection();
          }
        } catch (e) {
          console.log(e);
          toastError(e);
        }
      }}
      onTokenSend={async (value) => {
        console.log('send');
        await handleTokenSend(selection, value);
        clearSelection();
      }}
      onTokensRemove={(value) => {
        removeFromSelection(value);
      }}
      onCollsRemove={(value) => {
        removeCollFromSelection(value);
      }}
    />
  );

  const footer = <></>;

  return MainDashboardGrid(<ANavbar />, <SidebarNav />, <>{children}</>, cart, footer, gridRef, containerRef);
};

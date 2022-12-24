import { ReactNode, useEffect, useRef } from 'react';
import { AstraCart } from 'src/components/astra/astra-cart';
import { useResizeDetector } from 'react-resize-detector';
import { MainDashboardGrid } from 'src/components/astra/dashboard/main-grid-dashboard';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { ANavbar } from './astra-navbar';
import { SidebarNav } from './sidebar-nav';

interface Props {
  children: ReactNode;
}
export const Layout = ({ children }: Props) => {
  const { collection, setGridWidth, handleCheckout, selection, clearSelection, removeFromSelection } =
    useDashboardContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { width: containerWidth, ref: containerRef } = useResizeDetector();

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      setGridWidth(containerWidth);
    }
  }, [containerWidth]);

  // useEffect(() => {
  //   if (selection.length > 0) {
  //     setShowCart(true);
  //   } else {
  //     setShowCart(false);
  //   }
  // }, [selection]);

  useEffect(() => {
    gridRef.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  const cart = (
    <AstraCart
      tokens={selection}
      onCheckout={() => {
        clearSelection();
        handleCheckout(selection);
      }}
      onRemove={(value) => {
        removeFromSelection(value);
      }}
    />
  );

  const footer = <></>;

  return MainDashboardGrid(<ANavbar />, <SidebarNav />, <>{children}</>, cart, footer, gridRef, containerRef);
};

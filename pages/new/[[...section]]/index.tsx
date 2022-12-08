import { useEffect, useRef } from 'react';
import { AstraSidebar } from 'src/components/astra/astra-sidebar';
import { AstraCart } from 'src/components/astra/astra-cart';
import { useResizeDetector } from 'react-resize-detector';
import { MainDashboardGrid } from 'src/components/astra/dashboard/main-grid-dashboard';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { DashboardAll } from 'src/components/astra/dashboard/dashboard-all';
import { Navbar } from 'src/components/common';

const DashboardPage = () => {
  const {
    collection,
    setCollection,
    setGridWidth,
    showCart,
    handleCheckout,
    selection,
    clearSelection,
    removeFromSelection,
    setShowCart
  } = useDashboardContext();

  const gridRef = useRef<HTMLDivElement>(null);

  const { width: containerWidth, ref: containerRef } = useResizeDetector();

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      setGridWidth(containerWidth);
    }
  }, [containerWidth]);

  useEffect(() => {
    if (selection.length > 0) {
      setShowCart(true);
    } else {
      setShowCart(false);
    }
  }, [selection]);

  useEffect(() => {
    gridRef.current?.scrollTo({ left: 0, top: 0 });
  }, [collection]);

  const sidebar = (
    <AstraSidebar
      selectedCollection={collection}
      onClick={(value) => {
        // avoid clicking if already selected (avoids a network fetch)
        if (value.address !== collection?.address) {
          setCollection(value);
        }

        // navigate(`all?col=${value.address}`);
      }}
      onLoad={(value) => {
        if (value.address !== collection?.address) {
          setCollection(value);
        }
      }}
    />
  );

  const cart = (
    <AstraCart
      cardData={selection}
      onCheckout={() => {
        clearSelection();
        handleCheckout(selection);
      }}
      onRemove={(value) => {
        removeFromSelection(value);
      }}
    />
  );

  const footer = <div>footer</div>;

  return MainDashboardGrid(<Navbar />, sidebar, <DashboardAll />, cart, footer, gridRef, containerRef, showCart);
};

export default DashboardPage;

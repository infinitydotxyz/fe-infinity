import { useEffect, useRef } from 'react';
import { AstraSidebar } from 'src/components/astra/astra-sidebar';
import { AstraCart } from 'src/components/astra/astra-cart';
import { useResizeDetector } from 'react-resize-detector';
import { gridTemplate } from 'src/components/astra/dashboard/grid-template';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
// import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { XIcon } from '@heroicons/react/solid';
import { MdErrorOutline } from 'react-icons/md';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { DashboardAll } from 'src/components/astra/dashboard/dashboard-all';

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

  const { chainId } = useOnboardContext();

  const gridRef = useRef<HTMLDivElement>(null);
  // const navigate = useNavigate();

  const { width: containerWidth, ref: containerRef } = useResizeDetector();

  useEffect(() => {
    if (containerWidth && containerWidth > 0) {
      setGridWidth(containerWidth);
    }
  }, [containerWidth]);

  // const location = useLocation();
  // useEffect(() => {
  //   switch (TabUtils.routeToTab(location.pathname)) {
  //     case AstraNavTab.Top5:
  //       if (selection.length > 0) {
  //         setShowCart(true);
  //       }
  //       break;
  //     case AstraNavTab.All:
  //     case AstraNavTab.Portfolio:
  //     case AstraNavTab.Pending:
  //     case AstraNavTab.Revealed:
  //       setShowCart(false);
  //       break;
  //   }
  // }, [location]);

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

  const navBar = <></>;

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

  const footer = <></>;

  const contents = gridTemplate(navBar, sidebar, <DashboardAll />, cart, footer, gridRef, containerRef, showCart);
  return (
    <div className="relative">
      <div>{contents}</div>

      {chainId && chainId !== '1' && <WarningBanner message="You are not on Ethereum network" />}
    </div>
  );
};

export default DashboardPage;

// =======================================================

interface Props2 {
  message: string;
}
const WarningBanner = ({ message }: Props2) => {
  return (
    <div className="  absolute bottom-6 left-2 right-2 flex justify-center">
      <div className="rounded-md max-w-lg bg-red-600 p-4  ">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <MdErrorOutline className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <p className="text-md font-medium text-white">{message}</p>
          </div>
          <div className="ml-6 ">
            <button
              type="button"
              className="inline-flex bg-red-600 rounded-md p-2 text-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span className="sr-only">Dismiss</span>
              <XIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

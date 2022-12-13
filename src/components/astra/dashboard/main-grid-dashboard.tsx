import { RefObject } from 'react';
import { twMerge } from 'tailwind-merge';

export const MainDashboardGrid = (
  navBar: JSX.Element,
  sideNavBar: JSX.Element,
  sideBar: JSX.Element,
  grid: JSX.Element,
  cart: JSX.Element,
  footer: JSX.Element,
  gridRef: RefObject<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement>,
  showCart: boolean
) => {
  return (
    <div className="flex">
      <div className="">{sideNavBar}</div>

      <div ref={containerRef} className="h-screen w-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr_auto]">
        <div className="col-span-full">{navBar}</div>

        <div className="row-span-3">{sideBar}</div>

        {/* adding overflow-y-scroll here added space on the right? not needed anyway */}
        <div ref={gridRef} className="overflow-y-hidden overflow-x-hidden">
          {grid}
        </div>

        <div className="row-span-3  selection: overflow-y-auto overflow-x-hidden">
          <div className={twMerge('h-full', showCart ? 'w-72' : 'w-0', 'transition-width duration-300')}>{cart}</div>
        </div>

        <div className="col-start-2  ">{footer}</div>
      </div>
    </div>
  );
};

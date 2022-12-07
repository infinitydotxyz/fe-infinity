import { RefObject } from 'react';
import { PageBox } from 'src/components/common';
import { twMerge } from 'tailwind-merge';

export const gridTemplate = (
  navBar: JSX.Element,
  sideBar: JSX.Element,
  grid: JSX.Element,
  cart: JSX.Element,
  footer: JSX.Element,
  gridRef: RefObject<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement>,
  showCart: boolean
) => {
  return (
    <PageBox title="Stuff" fullWidth={true} showTitle={false}>
      <div ref={containerRef} className="h-screen w-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr_auto]">
        <div className="row-span-3 col-span-1">{sideBar}</div>

        <div ref={gridRef} className="col-span-1 overflow-y-scroll overflow-x-hidden">
          {grid}
        </div>

        <div className="row-span-3 col-span-1 overflow-y-auto overflow-x-hidden">
          <div className={twMerge('h-full', showCart ? 'w-72' : 'w-0', 'transition-width duration-300')}>{cart}</div>
        </div>

        <div className="col-start-2 col-span-1">{footer}</div>
      </div>
    </PageBox>
  );
};

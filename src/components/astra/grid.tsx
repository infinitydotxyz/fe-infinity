import { RefObject } from 'react';
import { bgColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export const Grid = (
  navBar: JSX.Element,
  grid: JSX.Element,
  cart: JSX.Element,
  footer: JSX.Element,
  dock: JSX.Element,
  gridRef: RefObject<HTMLDivElement>,
  containerRef: RefObject<HTMLDivElement>
) => {
  // const { showCart } = useAppContext();

  return (
    <div className={twMerge(bgColor, 'flex')}>
      <div ref={containerRef} className="h-screen w-screen grid grid-rows-[auto_1fr] grid-cols-[auto_1fr_auto]">
        {/* <div className="col-span-full">{navBar}</div> */}
        <div></div> {/* don't know why this is needed */}
        {/* adding overflow-y-scroll here added space on the right? not needed anyway */}
        <div ref={gridRef} className="overflow-y-hidden overflow-x-hidden">
          {grid}
        </div>
        {/* <div className="row-span-3 selection:overflow-y-auto overflow-x-hidden">
          <div className={twMerge('h-full', showCart ? 'w-[22rem]' : 'w-0', 'transition-width duration-100')}>
            {cart}
          </div>
        </div>
        <div className="col-start-2">{footer}</div>
        <div>{dock}</div> */}
      </div>
    </div>
  );
};

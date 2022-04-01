import { Menu } from '@headlessui/react';
import classNames from 'classnames';
import { ReactElement } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';

export const GallerySort = () => {
  const { filterState, setFilterState } = useFilterContext();

  const onClickSort = (sortByPrice: 'ASC' | 'DESC' | '') => {
    const newFilter = { ...filterState };
    newFilter.sortByPrice = sortByPrice;
    setFilterState(newFilter);
  };
  let label = 'Sort';
  label = filterState.sortByPrice === 'ASC' ? 'Low to High' : label;
  label = filterState.sortByPrice === 'DESC' ? 'High to Low' : label;

  return (
    <span className="">
      <div className="relative inline-block text-left">
        <Menu>
          <span className="">
            <Menu.Button
              className="transition ease-in-out duration-300 hover:bg-gray-700 hover:text-white active:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
          px-6 py-2
          border rounded-3xl border-gray-300 text-gray-900
          false flex"
            >
              <span>{label}</span>
              <svg
                className="ml-2 -mr-1 h-5 w-5 transition-transform duration-150 pt-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Menu.Button>
          </span>

          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md border border-gray-200 bg-white shadow-lg outline-none">
            {/* <div className="px-4 py-3">
              <p className="text-sm leading-5">Signed in as</p>
              <p className="truncate text-sm font-medium leading-5 text-gray-900">tom@example.com</p>
            </div> */}

            <div className="py-1">
              <CustomMenuItem href="javascript:;" onClick={() => onClickSort('ASC')}>
                Low to High
              </CustomMenuItem>
              <CustomMenuItem href="javascript:;" onClick={() => onClickSort('DESC')}>
                High to Low
              </CustomMenuItem>
              <CustomMenuItem href="javascript:;" onClick={() => onClickSort('')}>
                Clear
              </CustomMenuItem>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </span>
  );
};

interface CustomMenuItemProps {
  href: string;
  onClick: () => void;
  children: ReactElement | string;
}
function CustomMenuItem(props: CustomMenuItemProps) {
  return (
    <Menu.Item {...props}>
      {({ active, disabled }) => (
        <a
          href={props.href}
          className={classNames(
            'flex w-full justify-between px-4 py-2 text-left text-sm leading-5',
            active ? 'bg-indigo-500 text-white' : 'text-gray-700',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className={classNames(active && 'font-bold')}>{props.children}</span>
          {/* <kbd className={classNames('font-sans', active && 'text-indigo-50')}>⌘K</kbd> */}
        </a>
      )}
    </Menu.Item>
  );
}

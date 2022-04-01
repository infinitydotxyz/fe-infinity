import React, { Fragment } from 'react';

import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import { ACTIVITY_TYPE } from './activity-list';

interface FilterProps {
  activityTypes: Array<ACTIVITY_TYPE>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ActivityFilter: React.FC<FilterProps> = ({ activityTypes, onChange }) => {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                border rounded-3xl border-theme-light-800  group text-black px-5 py-2 inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span>Filter</span>
            <ChevronDownIcon
              className={`${open ? '' : 'text-opacity-70'}
                  ml-2 h-5 w-5 text-black group-hover:text-opacity-80 transition ease-in-out duration-150`}
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10  max-w-sm px-4 mt-3 right-0 transform sm:px-0 ">
              <div className="overflow-hidden rounded-lg  shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-8 bg-theme-light-50 w-80">
                  {[ACTIVITY_TYPE.Sale, ACTIVITY_TYPE.Transfer, ACTIVITY_TYPE.Offer].map((type: ACTIVITY_TYPE) => (
                    <div key={type} className="flex justify-between p-2">
                      <span className="font-body text-theme-light-800 text-lg">
                        {type.charAt(0).toUpperCase() + type.slice(1)}s
                      </span>
                      <input
                        checked={activityTypes.indexOf(type) >= 0}
                        name={type}
                        onChange={onChange}
                        type="checkbox"
                        className="border-gray-300 text-black focus:outline-none rounded h-5 w-5"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
};

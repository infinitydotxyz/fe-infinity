import React, { Fragment } from 'react';

import { Popover, Transition } from '@headlessui/react';
import { FeedEventType } from '@infinityxyz/lib/types/core/feed';

interface FeedFilterDropdownProps {
  selectedTypes: Array<FeedEventType>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FeedFilterDropdown: React.FC<FeedFilterDropdownProps> = ({ selectedTypes, onChange }) => {
  const options = [
    {
      label: 'All',
      value: ''
    },
    {
      label: 'Tweets',
      value: FeedEventType.TwitterTweet
    },
    {
      label: 'Sales',
      value: FeedEventType.NftSale
    }
  ];
  return (
    <Popover className="relative">
      {() => (
        <>
          <Popover.Button
            className={`
            transition ease-in-out duration-300 hover:bg-gray-700  active:bg-gray-900
            focus:outline-none focus-visible:ring focus:ring-black focus:ring-opacity-50
             px-6 py-2
             border rounded-3xl border-gray-300 text-gray-900
             hover:text-white font-heading
             false flex items-center space-x-1`}
          >
            <span>Filter</span>
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
                <div className="p-5 bg-theme-light-50 w-80">
                  {options.map((item, idx) => (
                    <div key={idx} className="flex space-x-6 p-3">
                      <input
                        checked={selectedTypes.indexOf(item.value as FeedEventType) >= 0}
                        name={item.value}
                        onChange={onChange}
                        type="checkbox"
                        className="border-gray-300 text-black focus:outline-none rounded h-5 w-5"
                      />
                      <span className="text-theme-light-800 font-heading">{item.label}</span>
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

import { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import { useFetch } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib/types/core';
import { FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import BlueCheckSvg from 'src/images/blue-check.svg';

type CollectionItem = BaseCollection & {
  name: string;
};

export const SearchBox = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const { result } = useFetch<{ data: CollectionItem[] }>(`/collections/search?query=${query}&limit=15`);
  const data = result?.data ?? [];

  const [selected, setSelected] = useState(data[0]);

  const filteredPeople =
    query === ''
      ? data
      : data.filter((coll) =>
          coll.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        );

  useEffect(() => {
    // after searching and selecting a collection: navigate to it:
    if (selected?.slug) {
      router.push(`/collection/${selected.slug}`);
    }
  }, [selected]);

  return (
    <div className="w-72 mb-8">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="p-2 relative w-full text-left bg-white rounded-lg border cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-teal-300 focus-visible:ring-offset-2 sm:text-sm overflow-hidden">
            <Combobox.Input
              placeholder="Search"
              className="w-full border-none focus:ring-0 py-2 pl-3 pr-10 leading-5 text-gray-900 text-lg"
              displayValue={(item: CollectionItem) => item?.name ?? ''}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {/* <SelectorIcon className="w-5 h-5 text-gray-400" aria-hidden="true" /> */}
              <FaSearch className="w-5 h-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredPeople.length === 0 && query !== '' ? (
                <div className="cursor-default select-none relative py-2 px-4 text-gray-700">Nothing found.</div>
              ) : (
                filteredPeople.map((coll) => (
                  <Combobox.Option
                    key={coll.address}
                    className={({ active }) =>
                      `cursor-default select-none relative py-2 pl-10 pr-4 ${
                        active ? 'text-white bg-teal-600' : 'text-gray-900'
                      }`
                    }
                    value={coll}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`flex items-center truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          <span className="mr-1">{coll.name}</span>
                          {coll?.hasBlueCheck ? (
                            <Image width={18} height={18} src={BlueCheckSvg.src} alt="Verified" />
                          ) : null}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-teal-600'
                            }`}
                          >
                            <CheckIcon className="w-5 h-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

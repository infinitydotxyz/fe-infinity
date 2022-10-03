import React, { useCallback, useEffect, useRef, useState } from 'react';
import { apiGet } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib-frontend/types/core';
import { useRouter } from 'next/router';
import { Combobox } from '@headlessui/react';
import { SVG } from './svg';
import { AiOutlineSearch } from 'react-icons/ai';
import { debounce } from 'lodash';
import { EZImage } from './ez-image';
import { twMerge } from 'tailwind-merge';
import { useIsMounted } from 'src/hooks/useIsMounted';

type CollectionItem = BaseCollection & {
  name: string;
  profileImage: string;
};

interface Props {
  expanded?: boolean;
}

export const SearchInput = ({ expanded }: Props) => {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState<CollectionItem | null>(null);
  const [data, setData] = useState<CollectionItem[]>([]);
  const [text, setText] = useState('');
  const isMounted = useIsMounted();

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    isActive ? inputRef?.current?.focus() : inputRef?.current?.blur();
  }, [isActive]);

  // must use useCallback or it doesn't work
  const doSearch = useCallback(
    debounce(async (text: string) => {
      if (text) {
        const { result, error } = await apiGet(`/collections/search?query=${text}&limit=15`);
        if (error) {
          throw new Error('Error completing request');
        }

        if (isMounted()) {
          const newData: CollectionItem[] = result?.data ?? [];

          // sort list, blue checks and exact matches first
          newData.sort((a, b) => {
            // make sure exact matches are on top
            if (a.name === text) {
              if (b.name === text) {
                return 0;
              }

              return -1;
            }

            const aa = a.name.replaceAll(' ', '');
            const bb = b.name.replaceAll(' ', '');

            return aa.localeCompare(bb);
          });

          setData(newData);
        }
      } else {
        if (isMounted()) {
          setData([]);
        }
      }
    }, 300),
    []
  );

  useEffect(() => {
    doSearch(text);
  }, [text]);

  const activate = () => {
    if (isMounted()) {
      setIsActive(true);
    }
  };
  const deactivate = () => {
    if (isMounted()) {
      text.length === 0 && !expanded ? setIsActive(false) : null;
    }
  };

  useEffect(() => {
    if (selected?.slug) {
      router.push(
        {
          pathname: `/collection/${selected?.slug}`
        },
        undefined,
        { scroll: false }
      );
    }
  }, [selected]);

  useEffect(() => {
    if (expanded) {
      setIsActive(true);
    }
  }, [expanded]);

  const styles = {
    container: {
      className: `
        w-full px-4 py-2 rounded-full max-h-full
        flex place-items-center gap-2
        ${
          isActive
            ? 'flex-row ring-1 ring-inset ring-theme-light-700'
            : 'flex-row-reverse ring-1 ring-inset ring-transparent '
        }
      `
    },
    icon: {
      container: {
        className: `
          w-content h-content
          hover:cursor-pointer
        `,
        onClick: activate
      },
      element: {
        className: `
          flex-[1] w-[18px] h-[18px] max-h-full
          ${isActive ? 'justify-self-start' : 'justify-self-end'}
        `
      }
    },
    input: {
      container: {
        className: `
          w-full h-full max-h-full flex-[10] outline-none
          ${isActive ? 'visible' : 'hidden'}
        `
      },
      element: {
        className: `
          w-full h-full bg-transparent max-h-full p-0
          hover:outline-none hover:ring-transparent hover:border-transparent hover:shadow-none
          focus:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none
          focus-visible:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none
          active:outline-none active:ring-transparent active:border-transparent active:shadow-none
          outline-none ring-transparent border-transparent shadow-none
          text-sm
        `,
        ref: inputRef,
        onBlur: deactivate,
        autoComplete: 'off',
        onChange: (e: React.FormEvent<HTMLInputElement>) => {
          const value = e.currentTarget.value;
          setText(value);
        },
        displayValue: (collection: CollectionItem) => collection?.name
      }
    }
  };

  const content = {
    search: {
      label: 'Search',
      icon: AiOutlineSearch
    }
  };
  return (
    <>
      <div {...styles?.container}>
        <div {...styles?.icon?.container}>
          <content.search.icon {...styles?.icon?.element}></content.search.icon>
        </div>
        <Combobox as="div" {...styles?.input?.container} value={selected} onChange={setSelected}>
          <Combobox.Input {...styles?.input?.element} />
          <Combobox.Options
            className="absolute z-60 -mx-8
            w-content h-content max-h-content
            py-2 ring-1 ring-inset ring-theme-light-200 rounded-2xl
            flex flex-col bg-gray-50 shadow-lg"
          >
            {data.map((collection) => (
              <Combobox.Option key={collection.address} value={collection}>
                {({ active }) => (
                  <div
                    className={twMerge(
                      active ? 'bg-slate-200' : 'bg-transparent',
                      'font-body text-sm py-1 px-4 ml-2 mr-2 hover:bg-slate-200 rounded-md transition-all duration-200',
                      'flex gap-4 place-items-center',
                      'hover:cursor-pointer w-80'
                    )}
                  >
                    <EZImage className="w-8 h-8 rounded-full overflow-hidden" src={collection?.profileImage} />
                    <div className=" flex-1 truncate font-body text-xs leading-6 tracking-wide">{collection?.name}</div>
                    {collection?.hasBlueCheck ? <SVG.blueCheck className="h-5 w-5 opacity-60 shrink-0" /> : <></>}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </>
  );
};

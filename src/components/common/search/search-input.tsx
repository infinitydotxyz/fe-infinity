import { Combobox } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { twMerge } from 'tailwind-merge';
import { getSearchResultKey, getSearchResultLink, SearchResultItem } from './search-results';
import { SearchResult } from './types';

interface Props {
  expanded?: boolean;
  query: string;
  setQuery: (query: string) => void;
  data: SearchResult[];
}

export function SearchInput({ expanded, query, setQuery, data }: Props): JSX.Element {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const isMounted = useIsMounted();

  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  useEffect(() => {
    isActive ? inputRef?.current?.focus() : inputRef?.current?.blur();
  }, [isActive]);

  const activate = () => {
    if (isMounted()) {
      setIsActive(true);
    }
  };
  const deactivate = () => {
    if (isMounted()) {
      query.length === 0 && !expanded ? setIsActive(false) : null;
    }
  };

  useEffect(() => {
    if (selected) {
      const pathname = getSearchResultLink(selected);
      router.push(
        {
          pathname
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
            w-full bg-transparent max-h-full p-0
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
          setQuery(value);
        }
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
    <div {...styles?.container}>
      <div {...styles?.icon?.container}>
        <content.search.icon {...styles?.icon?.element}></content.search.icon>
      </div>
      <Combobox as="div" {...styles?.input?.container} value={selected} onChange={setSelected}>
        <Combobox.Input {...styles?.input?.element} />
        <div className="relative z-20">
          <Combobox.Options
            className="absolute z-20 -mx-8 top-2
        w-content h-content max-h-content
        py-2 ring-1 ring-inset ring-theme-light-200 rounded-2xl
        flex flex-col bg-gray-50 shadow-lg"
          >
            {data.map((item) => {
              const key = getSearchResultKey(item);
              return (
                <Combobox.Option key={key} value={item}>
                  {({ active }) => (
                    <div
                      className={twMerge(
                        active ? 'bg-slate-200' : 'bg-transparent',
                        'font-body text-sm py-1 px-4 hover:bg-slate-200 rounded-md transition-all duration-200',
                        'flex gap-2 place-items-center',
                        'hover:cursor-pointer w-60 z-20'
                      )}
                    >
                      <SearchResultItem item={item} />
                    </div>
                  )}
                </Combobox.Option>
              );
            })}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  );
}
import { Combobox } from '@headlessui/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { cardClr, hoverClr, inputBorderColor, textClr } from 'src/utils/ui-constants';
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
    icon: {
      container: {
        onClick: activate
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
    <div
      className={twMerge(
        textClr,
        inputBorderColor,
        'border w-full px-4 py-1 rounded-full max-h-full  flex place-items-center gap-2'
      )}
    >
      <div className="w-content h-content  hover:cursor-pointer" {...styles?.icon?.container}>
        <content.search.icon
          className={twMerge(textClr, 'flex-[1] w-[18px] h-[18px] max-h-full')}
        ></content.search.icon>
      </div>
      <Combobox as="div" {...styles?.input?.container} value={selected} onChange={setSelected}>
        <Combobox.Input
          className={twMerge(
            'w-full bg-transparent max-h-full p-0',
            'hover:outline-none hover:ring-transparent hover:border-transparent hover:shadow-none',
            'focus:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none',
            'focus-visible:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none',
            'active:outline-none active:ring-transparent active:border-transparent active:shadow-none',
            'outline-none ring-transparent border-transparent shadow-none',
            'text-sm'
          )}
          {...styles?.input?.element}
        />
        <div className="relative z-20">
          <Combobox.Options
            className={twMerge(
              cardClr,
              inputBorderColor,
              'absolute z-20 -mx-8 top-2  w-content h-content max-h-content',
              '  py-2 border rounded-2xl flex flex-col   shadow-lg'
            )}
          >
            {data.map((item) => {
              const key = getSearchResultKey(item);
              return (
                <Combobox.Option key={key} value={item}>
                  {({ active }) => (
                    <div
                      className={twMerge(
                        active ? 'bg-transparent' : 'bg-transparent',
                        hoverClr,
                        textClr,
                        'font-body text-sm py-1.5 px-4   rounded-md transition-all duration-200',
                        'flex gap-3 place-items-center',
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

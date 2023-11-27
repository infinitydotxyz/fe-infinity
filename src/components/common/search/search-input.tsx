import { Combobox } from '@headlessui/react';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { BasicTokenInfo, NftSearchResultData } from 'src/utils/types';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { borderColor, secondaryBgColor, hoverColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { getSearchResultKey, SearchResultItem } from './search-results';
import { SearchResult } from './types';
import { getNetworkName } from 'src/utils';
import { MagnifyingGlassIcon } from 'src/icons';

interface Props {
  expanded?: boolean;
  query: string;
  placeholder: string;
  inputClassName?: string;
  containerClassName?: string;
  setQuery: (query: string) => void;
  data: SearchResult[];
  tokenSearch?: boolean;
  profileSearch?: boolean;
  shortCuts?: boolean;
  orderSearch?: boolean;
  setSelectedCollection?: (collection: CollectionSearchDto) => void;
  setSelectedToken?: (basicTokenInfo: BasicTokenInfo) => void;
  customIcon?: React.ReactNode;
  iconStyle?: string;
}

export function SearchInput({
  expanded,
  query,
  setQuery,
  placeholder,
  inputClassName,
  containerClassName,
  data,
  tokenSearch,
  profileSearch,
  orderSearch,
  setSelectedCollection,
  setSelectedToken,
  customIcon,
  iconStyle = ''
}: Props): JSX.Element {
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
    if (selected && (profileSearch || orderSearch)) {
      setSelectedCollection && setSelectedCollection(selected as CollectionSearchDto);
    } else if (selected && tokenSearch) {
      const basicTokenInfo: BasicTokenInfo = {
        tokenId: (selected as NftSearchResultData).tokenId,
        collectionAddress: (selected as NftSearchResultData).collectionAddress,
        chainId: (selected as NftSearchResultData).chainId,
        collectionSlug: ''
      };
      setSelectedToken?.(basicTokenInfo);
    } else if (selected) {
      const pathname = `/chain/${getNetworkName((selected as CollectionSearchDto).chainId)}/collection/${
        (selected as CollectionSearchDto).slug || (selected as CollectionSearchDto).address
      }`;
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

  return (
    <div
      className={twMerge(
        textColor,
        'w-full md:max-w-300 px-2.5 rounded-lg text-center h-9 flex place-items-center bg-black bg-opacity-3 dark:bg-gray-600 peer-focus-within:ring-1 ring-1 ring-gray-400 dark:ring-neutral-300',
        containerClassName
      )}
    >
      <div className="w-content h-content  hover:cursor-pointer" onClick={activate}>
        {customIcon ?? (
          <MagnifyingGlassIcon className={twMerge('flex-1 w-3.75 h-3.75 max-h-full', iconStyle)}></MagnifyingGlassIcon>
        )}
      </div>
      <Combobox
        as="div"
        className={`w-full h-full max-h-full flex-10 outline-none  ${isActive ? 'visible' : 'hidden'}`}
        value={selected}
        onChange={setSelected}
      >
        <Combobox.Input
          className={twMerge(
            'w-full bg-transparent max-h-full',
            'hover:outline-none hover:ring-transparent hover:border-transparent hover:shadow-none',
            'focus:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none',
            'focus-visible:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none',
            'active:outline-none active:ring-transparent active:border-transparent active:shadow-none',
            'outline-none ring-transparent border-transparent shadow-none',
            'text-sm align-middle p-2.5 text-neutral-700 dark:text-white font-medium dark:placeholder:text-neutral-500 placeholder:text-amber-600 ',
            inputClassName
          )}
          placeholder={placeholder}
          ref={inputRef}
          onBlur={deactivate}
          autoComplete="off"
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const value = e.currentTarget.value;
            setQuery(value);
          }}
        />
        <div className="relative z-40">
          <Combobox.Options
            className={twMerge(
              secondaryBgColor,
              data.length === 0 ? 'opacity-0' : '', // without this, a thin line appears
              borderColor,
              'absolute md:left-auto -left-8 md:right-auto -right-4 z-20 md:-mx-8 md:top-2 top-2  w-content h-content max-h-content',
              'py-2 border rounded-lg flex flex-col shadow-lg'
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
                        hoverColor,
                        textColor,
                        'text-sm py-1 px-3 transition-all duration-200',
                        'flex gap-3 place-items-center',
                        'hover:cursor-pointer md:w-96 z-20'
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

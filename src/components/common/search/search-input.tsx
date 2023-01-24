import { Combobox } from '@headlessui/react';
import { NftDisplayData } from '@infinityxyz/lib-frontend/types/core';
import { CollectionSearchDto } from '@infinityxyz/lib-frontend/types/dto';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BasicTokenInfo } from 'src/utils/types';
import { useIsMounted } from 'src/hooks/useIsMounted';
import { borderColor, cardColor, hoverColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { getSearchResultKey, SearchResultItem } from './search-results';
import { SearchResult } from './types';

interface Props {
  expanded?: boolean;
  query: string;
  placeholder: string;
  setQuery: (query: string) => void;
  data: SearchResult[];
  tokenSearch?: boolean;
  profileSearch?: boolean;
  orderSearch?: boolean;
  setSelectedCollection?: (collection: CollectionSearchDto) => void;
  setSelectedToken?: (basicTokenInfo: BasicTokenInfo) => void;
}

export function SearchInput({
  expanded,
  query,
  setQuery,
  placeholder,
  data,
  tokenSearch,
  profileSearch,
  orderSearch,
  setSelectedCollection,
  setSelectedToken
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
        tokenId: (selected as NftDisplayData).tokenId,
        collectionAddress: (selected as NftDisplayData).collectionDisplayData?.address,
        chainId: (selected as NftDisplayData).collectionDisplayData?.chainId
      };
      setSelectedToken?.(basicTokenInfo);
    } else if (selected) {
      const pathname = `/collection/${(selected as CollectionSearchDto).slug}`;
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
        borderColor,
        'border w-full px-4 rounded-lg text-center h-10 flex place-items-center'
      )}
    >
      <div className="w-content h-content  hover:cursor-pointer" onClick={activate}>
        <AiOutlineSearch className={twMerge(textColor, 'flex-[1] w-[18px] h-[18px] max-h-full')}></AiOutlineSearch>
      </div>
      <Combobox
        as="div"
        className={`w-full h-full max-h-full flex-[10] outline-none  ${isActive ? 'visible' : 'hidden'}`}
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
            'text-sm align-middle'
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
        <div className="relative z-20">
          <Combobox.Options
            className={twMerge(
              cardColor,
              data.length === 0 ? 'opacity-0' : '', // without this, a thin line appears
              borderColor,
              'absolute z-20 -mx-8 top-2  w-content h-content max-h-content',
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
                        'hover:cursor-pointer w-96 z-20'
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

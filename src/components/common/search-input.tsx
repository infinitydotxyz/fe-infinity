import React, { Fragment } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useFetch } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import { Combobox, Transition } from '@headlessui/react';

type CollectionItem = BaseCollection & {
  name: string;
  profileImage: string;
};

export const SearchInput: React.FC = () => {
  const router = useRouter();
  const [isActive, setIsActive] = React.useState(false);
  const [text, setText] = React.useState('');
  const inputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const activate = () => setIsActive(true);
  const deactivate = () => (text.length == 0 ? setIsActive(false) : null);

  React.useEffect(() => {
    isActive ? inputRef?.current?.focus() : inputRef?.current?.blur();
  }, [isActive]);

  const { result } = useFetch<{ data: CollectionItem[] | null }>(`/collections/search?query=${text}&limit=15`);
  const data = result?.data ?? [];
  const [selected, setSelected] = React.useState(undefined);

  React.useEffect(() => {
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

  const filtered =
    text === ''
      ? data
      : data.filter((collection) =>
          collection.name.toLowerCase().replace(/\s+/g, '').includes(text.toLowerCase().replace(/\s+/g, ''))
        );

  const styles = {
    container: {
      className: `
        w-full h-full px-4 rounded-full
        flex place-items-center gap-2
        ${
          isActive ? 'flex-row ring-1 ring-inset ring-theme-light-700' : 'justify-end ring-inset ring-theme-transparent'
        }
      `
    },
    icon: {
      container: {
        className: `
          w-content h-content
        `,
        onClick: activate
      },
      element: {
        className: `
          flex-[1] w-5 h-5
          ${isActive ? 'justify-self-start' : 'justify-self-end'}
        `
      }
    },
    input: {
      container: {
        className: `
          w-full h-full flex-[10] outline-none
          ${isActive ? 'visible' : 'hidden'}
        `
      },
      element: {
        className: `
          w-full h-full bg-transparent
          hover:outline-none hover:ring-transparent hover:border-transparent hover:shadow-none
          focus:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none
          focus-visible:outline-none focus:ring-transparent focus:border-transparent focus:shadow-none
          active:outline-none active:ring-transparent active:border-transparent active:shadow-none
          outline-none ring-transparent border-transparent shadow-none
          text-sm
        `,
        ref: inputRef,
        onBlur: deactivate,
        onChange: (e: React.FormEvent<HTMLInputElement>) => {
          const value = e.currentTarget.value;
          setText(value);
        },
        displayValue: (collection: CollectionItem) => collection?.name
      },
      options: {
        container: {
          className: `
            absolute z-60
            w-content h-content
            px-2 py-2 ring ring-inset ring-theme-light-200 rounded-xl
            flex flex-col bg-theme-light-50
          `
        },
        option: {
          className: `
            font-body text-sm py-1 px-4
            hover:bg-theme-light-200 rounded-xl
            flex gap-4 place-items-center
            hover:cursor-pointer
          `
        }
      }
    },
    collection: {
      name: {
        className: `
          font-body text-xs leading-6 tracking-wide
        `
      },
      image: {
        container: {
          className: `
            w-8 rounded-full overflow-hidden
        `
        },
        element: {
          className: ``
        }
      }
    }
  };

  const content = {
    search: {
      label: 'Search',
      icon: BiSearchAlt2
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
          <Combobox.Options {...styles?.input?.options?.container}>
            {filtered.map((collection, index) => (
              <Combobox.Option key={index} value={collection} {...styles?.input?.options?.option}>
                <div {...styles?.collection?.image?.container}>
                  <img src={collection?.profileImage} alt={collection?.name} {...styles?.collection?.image?.element} />
                </div>
                <div {...styles?.collection?.name}>{collection?.name}</div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </>
  );
};

export default SearchInput;

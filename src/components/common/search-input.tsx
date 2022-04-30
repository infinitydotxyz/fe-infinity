import React from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { useFetch } from 'src/utils';
import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import { Combobox } from '@headlessui/react';
import { SVG } from './svg';

type CollectionItem = BaseCollection & {
  name: string;
  profileImage: string;
};

interface Props {
  expanded?: boolean;
}

export const SearchInput: React.FC<Props> = ({ expanded }) => {
  const router = useRouter();
  const [isActive, setIsActive] = React.useState(false);
  const [text, setText] = React.useState('');
  const inputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const activate = () => setIsActive(true);
  const deactivate = () => (text.length == 0 && !expanded ? setIsActive(false) : null);

  React.useEffect(() => {
    isActive ? inputRef?.current?.focus() : inputRef?.current?.blur();
  }, [isActive]);

  const { result } = useFetch<{ data: CollectionItem[] | null }>(
    text ? `/collections/search?query=${text}&limit=15` : null
  );
  const data = result?.data ?? [];
  const [selected, setSelected] = React.useState<CollectionItem | null>(null);

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

  React.useEffect(() => {
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
          flex-[1] w-5 h-5 max-h-full
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
        onChange: (e: React.FormEvent<HTMLInputElement>) => {
          const value = e.currentTarget.value;
          setText(value);
        },
        displayValue: (collection: CollectionItem) => collection?.name
      },
      options: {
        container: {
          className: `
            absolute z-60 -mx-8
            w-content h-content max-h-content
            py-2 ring-1 ring-inset ring-theme-light-200 rounded-xl
            flex flex-col bg-theme-light-50
          `
        },
        option: {
          className: ({ active }: { active: boolean }) => `
            font-body text-sm py-1 px-4
            hover:bg-theme-light-200 rounded-xl
            flex gap-4 place-items-center
            hover:cursor-pointer
            ${active && 'bg-theme-light-300'}
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
      },
      blueCheck: {
        className: `grid`
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
                <div {...styles?.collection?.blueCheck}>
                  {collection?.hasBlueCheck ? <SVG.blueCheck className="h-5 w-5" /> : <></>}
                </div>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
      </div>
    </>
  );
};

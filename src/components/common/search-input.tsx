import React from 'react';
import { Combobox } from '@headlessui/react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { Transition } from '@headlessui/react';

export const SearchInput: React.FC = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [text, setText] = React.useState('');
  const inputRef: React.RefObject<HTMLInputElement> = React.useRef();
  const activate = (e: React.MouseEvent<HTMLButtonElement>) => setIsActive(true);
  const deactivate = (e: React.MouseEvent<HTMLButtonElement>) => setIsActive(false);

  React.useEffect(() => {
    isActive ? inputRef?.current?.focus() : inputRef?.current?.blur();
  }, [isActive]);

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
          w-full h-full flex-[10]
          ${isActive ? 'visible' : 'hidden'}
        `
      },
      element: {
        className: `
          w-full h-full bg-transparent
          outline-none
          text-sm
        `,
        ref: inputRef
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
        <div {...styles?.input?.container}>
          <input {...styles?.input?.element}></input>
        </div>
      </div>
    </>
  );
};

export default SearchInput;

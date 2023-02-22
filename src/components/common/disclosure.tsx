import { Disclosure } from '@headlessui/react';
import { ReactNode } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { borderColor, hoverColor, secondaryBgColor, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

export interface DisclosureData {
  title: string;
  content: ReactNode;
}

interface Props {
  data: DisclosureData[];
}

export function ADisclosure({ data }: Props) {
  return (
    <div className="w-full">
      {data.map((item) => {
        return (
          <Disclosure defaultOpen key={item.title}>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={twMerge(
                    secondaryBgColor,
                    hoverColor,
                    'flex w-full justify-between p-2 text-xs border-b-[1px]',
                    borderColor
                  )}
                >
                  <span>{item.title}</span>
                  <RxCaretDown
                    className={twMerge(
                      `${open ? 'rotate-180 transform' : ''}`,
                      smallIconButtonStyle,
                      'text-brand-primary'
                    )}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="text-sm px-2">{item.content}</Disclosure.Panel>
              </>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
}

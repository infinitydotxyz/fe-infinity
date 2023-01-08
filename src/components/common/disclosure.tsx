import { Disclosure } from '@headlessui/react';
import { ReactNode } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import { cardColor, hoverColor, smallIconButtonStyle } from 'src/utils/ui-constants';
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
    <div className="w-full space-y-1">
      {data.map((item) => {
        return (
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button
                  className={twMerge(cardColor, hoverColor, 'flex w-full justify-between rounded-lg p-2 text-sm')}
                >
                  <span>{item.title}</span>
                  <RxCaretDown className={twMerge(`${open ? 'rotate-180 transform' : ''}`, smallIconButtonStyle)} />
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

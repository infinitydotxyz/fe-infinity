import { Erc721Attribute } from '@infinityxyz/lib-frontend/types/core';
import type { FC } from 'react';
import { secondaryBgColor, borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  trait: Erc721Attribute;
  description: string;
}

export const Trait: FC<Props> = ({ trait, description }) => {
  return (
    <div className={twMerge(borderColor, 'border rounded-lg px-5 py-5 flex flex-col justify-between')}>
      <div>
        <p className="text-center text-sm mb-1 break-words">{trait.trait_type}</p>
        <p className="text-center text-sm font-body font-bold break-words">{trait.value}</p>
      </div>
      <p
        className={twMerge(
          secondaryBgColor,
          'text-center text-xs font-heading rounded-lg py-1 mt-3 lg:mt-4 tracking-tighter px-2'
        )}
      >
        {description}
      </p>
    </div>
  );
};

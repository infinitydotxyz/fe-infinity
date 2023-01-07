import type { FC } from 'react';
import { Erc721Attribute } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from 'src/utils/ui-constants';

interface Props {
  trait: Erc721Attribute;
  description: string;
}

export const Trait: FC<Props> = ({ trait, description }) => {
  return (
    <div className={twMerge(inputBorderColor, 'border rounded-3xl px-5 py-5 flex flex-col justify-between')}>
      <div>
        <p className="text-center text-sm text-light-800 mb-1 font-body break-words">{trait.trait_type}</p>
        <p className="text-center text-sm font-body font-bold break-words">{trait.value}</p>
      </div>
      <p className="text-center text-xs font-heading text-light-800 bg-light-300 rounded-3xl py-1 mt-3 lg:mt-4 tracking-tighter px-2">
        {description}
      </p>
    </div>
  );
};

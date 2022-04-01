import type { FC } from 'react';
import { Erc721Attribute } from '@infinityxyz/lib/types/core';

interface Props {
  trait: Erc721Attribute;
  description: string;
}

export const Trait: FC<Props> = ({ trait, description }) => {
  return (
    <div className="border border-gray-400 rounded-3xl px-5 py-5 flex flex-col justify-between">
      <div>
        <p className="text-center text-sm text-theme-light-800 mb-1 font-body">{trait.trait_type}</p>
        <p className="text-center text-sm font-body font-bold">{trait.value}</p>
      </div>
      <p className="text-center text-xs text-theme-light-800 bg-theme-light-300 rounded-3xl py-1 mt-3 lg:mt-4 font-body tracking-tighter px-2">
        {description}
      </p>
    </div>
  );
};

export default Trait;

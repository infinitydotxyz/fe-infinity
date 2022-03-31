import type { FC } from 'react';
import { Trait as TraitType } from '@infinityxyz/lib/types/core';

interface Props {
  trait: TraitType;
  description: string;
}

export const Trait: FC<Props> = ({ trait, description }) => {
  return (
    <div className="border border-gray-400 rounded-3xl py-5 px-6">
      <p className="text-center text-sm text-theme-light-800 mb-1 font-body">{trait.traitType}</p>
      <p className="text-center text-sm font-body font-semibold">{trait.traitValue}</p>
      <p className="text-center text-xs text-theme-light-800 bg-theme-light-300 rounded-3xl py-1 mt-3 font-body tracking-tighter">
        {description}
      </p>
    </div>
  );
};

export default Trait;

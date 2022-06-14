import type { FC } from 'react';
import { Erc721Attribute, CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { Trait } from './trait';

interface TraitListProps {
  traits: Erc721Attribute[];
  collectionTraits: CollectionAttributes;
}

export const TraitList: FC<TraitListProps> = ({ traits, collectionTraits }) => {
  return (
    <div className="mt-10">
      <p className="mt-4 sm:mt-6 sm:mb-4 tracking-base text-black font-bold">Traits</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
        {traits?.map((trait: Erc721Attribute, idx) => {
          let description = 'None';
          if (trait?.trait_type && collectionTraits) {
            description = `${
              Math.floor(collectionTraits[trait.trait_type]?.values[trait?.value].percent) || 1
            } % have this`;
          }
          return <Trait key={idx + '_' + trait.trait_type} trait={trait} description={description} />;
        })}
      </div>
    </div>
  );
};

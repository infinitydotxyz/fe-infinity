import type { FC } from 'react';
import { Erc721Attribute, CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { Trait } from './trait';

interface TraitListProps {
  traits: Erc721Attribute[];
  collectionTraits?: CollectionAttributes;
  className?: string;
}

export const TraitList: FC<TraitListProps> = ({ traits, className = 'mt-6', collectionTraits }) => {
  return (
    <>
      {traits?.length > 0 ? (
        <>
          <div className={className}>
            <p className=" text-xl  font-bold">Traits</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-6">
              {traits?.map((trait: Erc721Attribute, idx) => {
                let description = 'None';
                if (trait?.trait_type && collectionTraits) {
                  description = `${
                    Math.floor(collectionTraits[trait.trait_type]?.values[trait?.value]?.percent) || 1
                  } % have this`;
                }
                return <Trait key={idx + '_' + trait.trait_type} trait={trait} description={description} />;
              })}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

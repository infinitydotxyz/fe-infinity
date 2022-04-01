import type { FC } from 'react';
import Trait from './trait';

interface TraitListProps {
  traits: any;
  collectionTraits: any;
}

export const TraitList: FC<TraitListProps> = ({ traits, collectionTraits }) => {
  return (
    <div className="mt-20">
      <p className="mt-4 sm:mt-6 sm:mb-4 tracking-base text-black">Traits</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
        {traits.map((trait: any) => (
          <Trait
            key={trait.trait_type}
            trait={trait}
            description={`${collectionTraits[trait?.trait_type]?.values[trait?.value].percent} % have this`}
          />
        ))}
      </div>
    </div>
  );
};

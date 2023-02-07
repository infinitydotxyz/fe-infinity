import { CollectionAttributes, Erc721Attribute } from '@infinityxyz/lib-frontend/types/core';
import type { FC } from 'react';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface ATraitListProps {
  traits: Erc721Attribute[];
  collectionTraits?: CollectionAttributes;
  className?: string;
}

const getPercentage = (trait: Erc721Attribute, collectionTraits: CollectionAttributes | undefined) => {
  return trait?.trait_type && collectionTraits
    ? Math.floor(collectionTraits[trait.trait_type]?.values[trait?.value]?.percent)
    : 0;
};

const getDescription = (trait: Erc721Attribute, collectionTraits: CollectionAttributes | undefined) => {
  let description = 'None';

  if (trait?.trait_type && collectionTraits) {
    description = `${getPercentage(trait, collectionTraits) || 1} % have this`;
  }

  return description;
};

interface ATraitProps {
  trait: Erc721Attribute;
  description: string;
}

export const ATrait: FC<ATraitProps> = ({ trait, description }) => {
  // TODO: improve style to look more like gem's?
  return (
    <div className={twMerge(borderColor, 'border rounded-lg flex flex-col py-1')}>
      <div className="text-center text-xs break-words">{trait.trait_type}</div>
      <div className="text-center text-sm font-medium break-words mt-0.5">{trait.value}</div>
      <div className={twMerge('text-center text-xs rounded-br-lg rounded-bl-lg tracking-tighter mt-0.5')}>
        {description}
      </div>
    </div>
  );
};

export const ATraitList: FC<ATraitListProps> = ({ traits, className = 'mt-6', collectionTraits }) => {
  traits.sort((a, b) => getPercentage(a, collectionTraits) - getPercentage(b, collectionTraits));
  return (
    <div className={className}>
      <p className="text-lg font-bold font-heading mb-1">Traits</p>
      <div className="space-y-2 max-h-[365px] overflow-auto scrollbar-hide">
        {traits?.map((trait: Erc721Attribute, idx) => (
          <ATrait
            key={idx + '_' + trait.trait_type}
            trait={trait}
            description={getDescription(trait, collectionTraits)}
          />
        ))}
      </div>
    </div>
  );
};

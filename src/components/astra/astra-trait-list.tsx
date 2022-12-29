import type { FC } from 'react';
import { Erc721Attribute, CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { twMerge } from 'tailwind-merge';
import { inputBorderColor } from 'src/utils/ui-constants';

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
    <div className={twMerge(inputBorderColor, 'border rounded-3xl flex flex-col justify-between')}>
      <div>
        <p className="text-center text-sm text-theme-light-800 font-body break-words">{trait.trait_type}</p>
        <p className="text-center text-sm font-body font-bold break-words">{trait.value}</p>
      </div>
      <p className="text-center text-xs font-heading text-theme-light-800 bg-theme-light-300 rounded-3xl tracking-tighter">
        {description}
      </p>
    </div>
  );
};

export const ATraitList: FC<ATraitListProps> = ({ traits, className = 'mt-6', collectionTraits }) => {
  traits.sort((a, b) => getPercentage(a, collectionTraits) - getPercentage(b, collectionTraits));
  return (
    <div className={className}>
      <p className="text-xl font-bold">Traits</p>
      <div className="space-y-2 max-h-80 overflow-y-scroll">
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

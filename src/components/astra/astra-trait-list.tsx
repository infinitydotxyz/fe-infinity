import type { FC } from 'react';
import { nFormatter } from 'src/utils';
import { ReservoirTokenAttributeV6, ReservoirTokenV6 } from 'src/utils/types';
import { borderColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface ATraitListProps {
  traits: ReservoirTokenV6['token']['attributes'];
  totalTokenCount?: number;
  className?: string;
}

const getDescription = (trait: ReservoirTokenAttributeV6, totalTokenCount: number | undefined) => {
  let description = '';

  if (trait?.tokenCount && totalTokenCount) {
    description = `${nFormatter(trait.tokenCount / totalTokenCount)} % have this`;
  }

  return description;
};

interface ATraitProps {
  trait: ReservoirTokenAttributeV6;
  description: string;
}

export const ATrait: FC<ATraitProps> = ({ trait, description }) => {
  return (
    <div className={twMerge(borderColor, 'border rounded-lg flex flex-col py-1')}>
      <div className="text-center text-xs break-words">{trait.key}</div>
      <div className="text-center text-sm font-medium break-words mt-0.5">{trait.value}</div>
      <div className={twMerge('text-center text-xs rounded-br-4 rounded-bl-4 tracking-tighter mt-0.5')}>
        {description}
      </div>
    </div>
  );
};

export const ATraitList: FC<ATraitListProps> = ({ traits, className = 'mt-6', totalTokenCount }) => {
  traits.sort((a, b) => a.tokenCount - b.tokenCount);
  return (
    <div className={className}>
      <p className="text-lg font-bold font-heading mb-1">Traits</p>
      <div className="space-y-2 max-h-[365px] overflow-auto scrollbar-hide">
        {traits?.map((trait: ReservoirTokenAttributeV6, idx) => (
          <ATrait key={idx + '_' + trait.key} trait={trait} description={getDescription(trait, totalTokenCount)} />
        ))}
      </div>
    </div>
  );
};

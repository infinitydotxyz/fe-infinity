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
    <div className={twMerge(borderColor, '  flex py-1 justify-between gap-3')}>
      <div>
        <div className="text-base break-words text-neutral-700 dark:text-white font-semibold">{trait.value}</div>
        <div className="text-sm text-amber-700 font-medium break-words">{description}</div>
      </div>
      <div
        className={twMerge(
          'flex items-center text-sm rounded-br-4 text-neutral-700 dark:text-neutral-300 rounded-bl-4 mt-0.5'
        )}
      >
        {trait.key}
      </div>
    </div>
  );
};

export const ATraitList: FC<ATraitListProps> = ({ traits, className = 'mt-6', totalTokenCount }) => {
  traits.sort((a, b) => a.tokenCount - b.tokenCount);
  return (
    <div className={className}>
      <p className="text-22 font-bold mb-7.5 text-neutral-700 dark:text-white leading-7 mt-3">Traits</p>
      <div className="space-y-5 max-h-91.25 overflow-auto scrollbar-hide">
        {traits?.map((trait: ReservoirTokenAttributeV6, idx) => (
          <ATrait key={idx + '_' + trait.key} trait={trait} description={getDescription(trait, totalTokenCount)} />
        ))}
      </div>
    </div>
  );
};

import type { FC } from 'react';
import Trait from './trait';

const traitsData = [
  {
    id: 1,
    trait: { traitType: 'Style', traitValue: '5' },
    description: '7% have this'
  },
  {
    id: 2,
    trait: { traitType: 'Strength', traitValue: '8' },
    description: '7% have this'
  },
  {
    id: 3,
    trait: { traitType: 'Spirit', traitValue: '1' },
    description: '7% have this'
  },
  {
    id: 4,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  },
  {
    id: 5,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  },
  {
    id: 6,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  },
  {
    id: 7,
    trait: { traitType: 'Style', traitValue: '5' },
    description: '7% have this'
  },
  {
    id: 8,
    trait: { traitType: 'Strength', traitValue: '8' },
    description: '7% have this'
  },
  {
    id: 9,
    trait: { traitType: 'Spirit', traitValue: '1' },
    description: '7% have this'
  },
  {
    id: 10,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  },
  {
    id: 11,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  },
  {
    id: 12,
    trait: { traitType: 'Face', traitValue: 'Nose scar' },
    description: '7% have this'
  }
];

export const TraitList: FC = () => {
  return (
    <div className="mt-20">
      <p className="mt-4 sm:mt-6 sm:mb-4 tracking-base text-black">Traits</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-2 gap-y-4 mt-6">
        {traitsData.map((traitObj) => (
          <Trait key={traitObj.id} trait={traitObj.trait} description={traitObj.description} />
        ))}
      </div>
    </div>
  );
};

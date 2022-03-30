import React from 'react';
import { TraitItem } from './TraitItem';
import clsx from 'classnames';

interface TraitListPropType {
  traits: Array<any> | undefined;
  className?: string;
}

export const TraitList: React.FC<TraitListPropType> = ({ traits, className }: TraitListPropType) => {
  return (
    <div className={clsx('justify-around sm:justify-start flex flex-wrap', className)}>
      {(traits || []).map((item) => {
        return (
          <TraitItem
            key={`${item.traitType}_${item.traitValue}`}
            traitType={item.traitType}
            traitValue={item.traitValue}
            percentage={7}
          />
        );
      })}
    </div>
  );
};

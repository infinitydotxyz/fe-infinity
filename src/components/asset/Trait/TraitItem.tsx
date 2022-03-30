import React from 'react';

interface TraitItemPropType {
  traitType: string;
  percentage: number;
  traitValue: string | number;
}

export const TraitItem: React.FC<TraitItemPropType> = ({ traitType, percentage, traitValue }: TraitItemPropType) => {
  return (
    <div className="w-40 sm:w-44 flex flex-col justify-around bg-white border border-gray-400 rounded-3xl text-center pt-5 pb-3 px-5 m-1.5">
      <h6 className="font-heading text-sm leading-5 tracking-tight text-gray-600 text-center">{traitType}</h6>
      <div className="font-heading text-base leading-6">{traitValue}</div>
      <div className="font-heading text-xs text-gray-600 bg-gray-50 rounded-3xl w-34 h-6 mt-3.5 pt-1">
        {percentage}% have this
      </div>
    </div>
  );
};

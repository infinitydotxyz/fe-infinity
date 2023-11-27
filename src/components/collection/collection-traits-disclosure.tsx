import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { TokensFilter } from 'src/utils/types';
import { borderColor, secondaryTextColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox } from '../common';
import { ADisclosure, DisclosureData } from '../common/disclosure';

export type TypeValueMap = {
  [k: string]: ValueMapItem;
};

type ValueMapItem = {
  [k: string]: boolean;
};

interface Props {
  traits: CollectionAttributes;
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
  typeValueMap: TypeValueMap;
  selectedTraitType: string;
}

export function CollectionTraitsDisclosure({ traits, filter, setFilter, typeValueMap, selectedTraitType }: Props) {
  const [disclosureData, setDisclosureData] = useState<DisclosureData[]>([]);

  const getDisclosureContent = (traitType: string) => {
    return (
      <div className="flex flex-col">
        {Object.entries(traits?.[traitType]?.values)?.map((val) => {
          const traitValue = val[0];
          const traitValueData = val[1];
          const isChecked = typeValueMap[traitType]?.[traitValue];
          return (
            <div className={twMerge('flex border-b py-2', borderColor)} key={`${traitType}.${traitValue}.${isChecked}`}>
              <Checkbox
                checked={isChecked}
                onChange={(checked) => {
                  const map = { ...typeValueMap };
                  if (!map[traitType]) {
                    map[traitType] = {};
                  }
                  map[traitType][traitValue] = checked;

                  const traitTypes = [];
                  const traitValues = [];
                  for (const type in map) {
                    const values = [];
                    for (const val in map[type]) {
                      if (map[type][val]) {
                        values.push(val);
                      }
                    }
                    if (values.length > 0) {
                      traitTypes.push(type);
                      traitValues.push(values.join('|'));
                    }
                  }

                  const newFilter: TokensFilter = {};
                  newFilter.traitTypes = traitTypes;
                  newFilter.traitValues = traitValues;
                  setFilter({ ...filter, ...newFilter });
                }}
              />
              <div>
                <div className="truncate">{traitValue}</div>
                <div className={twMerge('flex space-x-2 text-xs', secondaryTextColor)}>
                  <div className="truncate">{traitValueData.count}</div>
                  <div className="truncate">({traitValueData.percent}%)</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const getDisclosureData = () => {
    const selectedDisclosureData: Map<string, DisclosureData> = new Map();

    if (selectedTraitType === 'All') {
      Object.keys(traits)?.map((traitType) => {
        const content = getDisclosureContent(traitType);
        const discDataItem: DisclosureData = { title: traitType, content };
        selectedDisclosureData.set(traitType, discDataItem);
      });
    } else {
      const content = getDisclosureContent(selectedTraitType);
      const discDataItem: DisclosureData = { title: selectedTraitType, content };
      selectedDisclosureData.set(selectedTraitType, discDataItem);
    }

    return selectedDisclosureData;
  };

  useEffect(() => {
    setDisclosureData(Array.from(getDisclosureData().values()));
  }, [selectedTraitType, typeValueMap]);

  return <ADisclosure data={disclosureData} />;
}

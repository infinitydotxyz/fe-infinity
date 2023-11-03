import { CollectionAttribute, CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TokensFilter } from 'src/utils/types';
import {
  bgColor,
  borderColor,
  brandTextColor,
  hoverColor,
  secondaryBgColor,
  secondaryTextColor,
  smallIconButtonStyle
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TextInputBox } from '../common';
import { CollectionTraitsDisclosure, TypeValueMap } from './collection-traits-disclosure';

interface Props {
  traits: CollectionAttributes;
  collectionAddress?: string;
  filter: TokensFilter;
  setFilter: (filter: TokensFilter) => void;
}

const CollectionTraits = ({ traits, filter, setFilter }: Props) => {
  // TypeValueMap is a map of trait type to trait value to booelan. E.g: { 'Background': { 'Red': true, 'Blue': false } }
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});
  const [selectedTraitType, setSelectedTraitType] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');
  const [filteredTraits, setFilteredTraits] = useState<CollectionAttributes>(traits);
  const [traitTypeAndNumValues, setTraitTypeAndNumValues] = useState<{ name: string; numValues: number }[]>([]);
  // Map of trait type to trait values to lower case string for searching
  const traitTypeValueStrFlattenedMap = new Map<string, string>();

  useEffect(() => {
    const traitTypes = filter.traitTypes || [];
    const traitValues = filter.traitValues || [];
    const map: TypeValueMap = {};
    for (let i = 0; i < traitTypes.length; i++) {
      const traitType = traitTypes[i];
      if (!traitType) {
        continue;
      }
      const values = traitValues[i].split('|');
      map[traitType] = map[traitType] || {};
      for (const val of values) {
        if (!val) {
          continue;
        }
        map[traitType][val] = true;
      }
    }
    setTypeValueMap(map);
  }, [filter]);

  useEffect(() => {
    let totalNumTraitValues = 0;
    const newArr: { name: string; numValues: number }[] = [];
    for (const traitName in filteredTraits) {
      totalNumTraitValues += Object.keys(filteredTraits[traitName].values).length;
      newArr.push({
        name: traitName,
        numValues: Object.keys(filteredTraits[traitName].values).length
      });
    }

    // Add 'All' trait type to the beginning of the array
    newArr.unshift({
      name: 'All',
      numValues: totalNumTraitValues
    });

    setTraitTypeAndNumValues(newArr);
  }, [filteredTraits]);

  // Flatten traitTypeAndValuesMap to a map of traitType:traitValue lower case string to traitType:traitValue original string for searching
  for (const traitType of Object.keys(traits)) {
    const traitValues = Object.keys(traits[traitType].values);
    if (traitValues) {
      for (const traitValue of traitValues) {
        traitTypeValueStrFlattenedMap.set(`${traitType}:${traitValue}`.toLowerCase(), `${traitType}:${traitValue}`);
      }
    }
  }

  const handleSearch = (value: string) => {
    const traitTypeValuesStrArr = Array.from(traitTypeValueStrFlattenedMap.keys());
    const filteredTraitTypeAndValues = traitTypeValuesStrArr.filter((traitTypeAndValue) =>
      traitTypeAndValue.includes(value.toLowerCase())
    );

    const filteredTraitTypesValuesMap = new Map<string, string[]>();
    for (const traitTypeAndValue of filteredTraitTypeAndValues) {
      const originalTraitTypeAndValue = traitTypeValueStrFlattenedMap.get(traitTypeAndValue) ?? '';
      const [traitType, traitValue] = originalTraitTypeAndValue.split(':');
      if (traitType && traitValue) {
        filteredTraitTypesValuesMap.set(traitType, [...(filteredTraitTypesValuesMap.get(traitType) || []), traitValue]);
      }
    }

    const filteredTraits: CollectionAttributes = {};
    for (const traitType of filteredTraitTypesValuesMap.keys()) {
      const filteredValues = Object.entries(traits[traitType].values).filter((value) => {
        return filteredTraitTypesValuesMap.get(traitType)?.includes(value[0]) ?? false;
      });
      const filteredValuesObj = Object.fromEntries(filteredValues);
      const collAttribute: CollectionAttribute = {
        values: filteredValuesObj,
        attributeType: Object.entries(traits[traitType]).find((entry) => entry[0] === 'attributeType')?.[1],
        attributeTypeSlug: Object.entries(traits[traitType]).find((entry) => entry[0] === 'attributeTypeSlug')?.[1],
        count: Object.entries(traits[traitType]).find((entry) => entry[0] === 'count')?.[1],
        percent: Object.entries(traits[traitType]).find((entry) => entry[0] === 'percent')?.[1],
        displayType: Object.entries(traits[traitType]).find((entry) => entry[0] === 'displayType')?.[1]
      };
      filteredTraits[traitType] = collAttribute;
    }

    setFilteredTraits(filteredTraits);
  };

  return (
    <div className="w-full h-full">
      <div className={twMerge('border-b px-2 py-4', borderColor)}>
        <TextInputBox
          type="text"
          value={searchText}
          label=""
          placeholder="Search"
          icon={<AiOutlineSearch className={twMerge(smallIconButtonStyle, 'mr-3')} />}
          className="px-4 py-2 rounded-lg"
          onChange={(value) => {
            setSearchText(value);
            handleSearch(value);
          }}
          stopEnterSpacePropagation
        ></TextInputBox>
      </div>

      <div className={twMerge('h-full flex border-b', borderColor)}>
        <div className={twMerge('w-1/3 border-r overflow-y-scroll text-sm px-2', secondaryBgColor, borderColor)}>
          {traitTypeAndNumValues?.map((item) => {
            return (
              <div
                key={item.name}
                className={twMerge(
                  'flex cursor-pointer rounded-lg justify-between py-2 px-2',
                  hoverColor,
                  secondaryTextColor,
                  selectedTraitType === item.name && twMerge(brandTextColor)
                )}
                onClick={() => {
                  setSelectedTraitType(item.name);
                }}
              >
                <div className="truncate">{item.name}</div>
                <div className="text-xs">{item.numValues}</div>
              </div>
            );
          })}
        </div>

        <div className={twMerge('w-2/3 overflow-y-scroll', bgColor)}>
          <CollectionTraitsDisclosure
            key={JSON.stringify(filteredTraits)}
            typeValueMap={typeValueMap}
            selectedTraitType={selectedTraitType}
            traits={filteredTraits}
            filter={filter}
            setFilter={setFilter}
          />
        </div>
      </div>

      <div
        className={twMerge('float-left px-4 py-3 cursor-pointer text-sm', brandTextColor)}
        onClick={() => {
          setTypeValueMap({});
          const newFilter: TokensFilter = {};
          newFilter.traitTypes = [];
          newFilter.traitValues = [];
          newFilter.cursor = '';
          setFilter({ ...filter, ...newFilter });
        }}
      >
        Clear
      </div>
    </div>
  );
};

export default CollectionTraits;

import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
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
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});
  const [selectedTraitType, setSelectedTraitType] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');

  const traitTypeAndNumValues = [];
  let totalNumTraitValues = 0;
  for (const traitName in traits) {
    totalNumTraitValues += Object.keys(traits[traitName].values).length;
    traitTypeAndNumValues.push({
      name: traitName,
      numValues: Object.keys(traits[traitName].values).length
    });
  }
  traitTypeAndNumValues.unshift({
    name: 'All',
    numValues: totalNumTraitValues
  });

  useEffect(() => {
    const traitTypes = filter.traitTypes || [];
    const traitValues = filter.traitValues || [];
    const map: TypeValueMap = {};
    for (let i = 0; i < traitTypes.length; i++) {
      const type = traitTypes[i];
      if (!type) {
        continue;
      }
      const values = traitValues[i].split('|');
      map[type] = map[type] || {};
      for (const val of values) {
        if (!val) {
          continue;
        }
        map[type][val] = true;
      }
    }
    setTypeValueMap(map);
  }, [filter]);

  return (
    <div className="w-full h-full">
      <div className={twMerge('border-b-[1px] px-2 py-4', borderColor)}>
        <TextInputBox
          type="text"
          value={searchText}
          label=""
          placeholder="Search"
          icon={<AiOutlineSearch className={twMerge(smallIconButtonStyle, 'mr-3')} />}
          className="px-4 py-2 rounded-lg"
          onChange={(value) => {
            setSearchText(value);
          }}
        ></TextInputBox>
      </div>

      <div className={twMerge('h-full flex border-b-[1px]', borderColor)}>
        <div className={twMerge('w-1/3 border-r-[1px] overflow-y-scroll text-sm px-2', secondaryBgColor, borderColor)}>
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
            typeValueMap={typeValueMap}
            setTypeValueMap={setTypeValueMap}
            selectedTraitType={selectedTraitType}
            traits={traits}
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
          newFilter.orderBy = 'tokenIdNumeric';
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

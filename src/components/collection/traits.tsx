import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  borderColor,
  cardColor,
  hoverColor,
  secondaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, TextInputBox } from '../common';
import { ADisclosure, DisclosureData } from '../common/disclosure';
import { useOrderbook } from '../orderbook/OrderbookContext';

type ValueMapItem = {
  [k: string]: boolean;
};

type TypeValueMap = {
  [k: string]: ValueMapItem;
};

interface Props {
  traits: CollectionAttributes;
  collectionAddress?: string;
  onChange: (traitTypes: string[], traitValues: string[]) => void;
  onClearAll: () => void;
}

const CollectionTraits = ({ traits, onChange, onClearAll }: Props) => {
  const { filters } = useOrderbook();
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});
  const [selectedTraitType, setSelectedTraitType] = useState<string>('All');
  const [disclosureData, setDisclosureData] = useState<DisclosureData[]>([]);
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
    // when filterState changed (somewhere else) => parse it and set to TypeValueMap for checkboxes' states
    const traitTypes = filters?.traitTypes || [];
    const traitValues = filters?.traitValues || [];
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
  }, [filters]);

  useEffect(() => {
    if (selectedTraitType === 'All') {
      setDisclosureData(Array.from(allDisclosureData.values()));
    } else {
      setDisclosureData([allDisclosureData.get(selectedTraitType) ?? { title: '', content: <></> }]);
    }
  }, [selectedTraitType]);

  const allDisclosureData: Map<string, DisclosureData> = new Map();
  Object.keys(traits)?.map((traitType) => {
    const title = traitType;
    const content = (
      <div className="flex flex-col">
        {Object.entries(traits[traitType].values)?.map((val) => {
          const key = val[0];
          const value = val[1];
          return (
            <div className={twMerge('flex border-b-[1px] py-2', borderColor)}>
              <Checkbox
                checked={typeValueMap[traitType]?.[key]}
                onChange={(checked) => {
                  const map = { ...typeValueMap };
                  if (!map[traitType]) {
                    map[traitType] = {};
                  }
                  map[traitType][key] = checked;
                  setTypeValueMap(map);
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
                  onChange(traitTypes, traitValues);
                }}
              />
              <div>
                <div className="truncate">{key}</div>
                <div className={twMerge('flex space-x-2 text-xs', secondaryTextColor)}>
                  <div className="truncate">{value.count}</div>
                  <div className="truncate">({value.percent}%)</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
    const discDataItem: DisclosureData = { title, content };
    allDisclosureData.set(traitType, discDataItem);
  });

  return (
    <div className="w-full h-full">
      <div className={twMerge('border-b-[1px] pb-3', borderColor)}>
        <TextInputBox
          type="text"
          value={searchText}
          label=""
          placeholder="Search"
          icon={<AiOutlineSearch className={twMerge(smallIconButtonStyle, 'mr-3')} />}
          className="px-4 py-2 rounded-xl"
          onChange={(value) => {
            setSearchText(value);
          }}
        ></TextInputBox>
      </div>
      <div className={twMerge('h-full flex border-b-[1px]', borderColor)}>
        <div className={twMerge('w-1/3 border-r-[1px] overflow-y-scroll text-sm', cardColor, borderColor)}>
          {traitTypeAndNumValues?.map((item) => {
            return (
              <div
                className={twMerge(
                  'flex cursor-pointer rounded-lg justify-between py-2 px-2',
                  hoverColor,
                  secondaryTextColor,
                  selectedTraitType === item.name && twMerge('font-bold', textColor)
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
        <div className="w-2/3 ml-2 overflow-y-scroll">
          <ADisclosure data={disclosureData} />
        </div>
      </div>
      <div
        className="float-left py-3 px-5 text-blue-500 cursor-pointer"
        onClick={() => {
          onClearAll();
          setTypeValueMap({});
        }}
      >
        Clear
      </div>
    </div>
  );
};

export default CollectionTraits;

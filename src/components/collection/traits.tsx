import { Disclosure } from '@headlessui/react';
import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { RxCaretDown } from 'react-icons/rx';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { cardColor, hoverColor, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, TextInputBox } from '../common';
import { DisclosureData } from '../common/disclosure';

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
  const { filterState } = useFilterContext();
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});
  const [selectedTraitType, setSelectedTraitType] = useState<string>('All');
  const [searchText, setSearchText] = useState<string>('');

  const allDisclosureData: DisclosureData[] = [];
  Object.keys(traits)?.map((item) => {
    const title = item;
    const content = (
      <div className="flex flex-col">
        {Object.entries(traits[item].values)?.map((val) => {
          const key = val[0];
          const value = val[1];
          return (
            <div className="flex border-b-[1px] py-2">
              <Checkbox
                checked={typeValueMap[item]?.[key]}
                onChange={(checked) => {
                  const map = { ...typeValueMap };
                  if (!map[item]) {
                    map[item] = {};
                  }
                  map[item][key] = checked;
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
                <div className="flex space-x-2">
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
    allDisclosureData.push(discDataItem);
  });

  //   const getDisclosureData = (traitType: string) => {
  //     if (traitType === 'All') {
  //       return allDisclosureData;
  //     }

  //     const retData: DisclosureData[] = [];
  //     const item = traits[traitType];
  //     const content = (
  //       <div className="flex flex-col">
  //         {Object.entries(item.values)?.map((val) => {
  //           const key = val[0];
  //           const value = val[1];
  //           return (
  //             <div className="flex border-b-[1px] py-2">
  //               <Checkbox
  //                 checked={typeValueMap[traitType]?.[key]}
  //                 onChange={(checked) => {
  //                   const map = { ...typeValueMap };
  //                   if (!map[traitType]) {
  //                     map[traitType] = {};
  //                   }
  //                   map[traitType][key] = checked;
  //                   setTypeValueMap(map);
  //                   const traitTypes = [];
  //                   const traitValues = [];
  //                   for (const type in map) {
  //                     const values = [];
  //                     for (const val in map[type]) {
  //                       if (map[type][val]) {
  //                         values.push(val);
  //                       }
  //                     }
  //                     if (values.length > 0) {
  //                       traitTypes.push(type);
  //                       traitValues.push(values.join('|'));
  //                     }
  //                   }
  //                   onChange(traitTypes, traitValues);
  //                 }}
  //               />
  //               <div>
  //                 <div className="truncate">{key}</div>
  //                 <div className="flex space-x-2">
  //                   <div className="truncate">{value.count}</div>
  //                   <div className="truncate">({value.percent}%)</div>
  //                 </div>
  //               </div>
  //             </div>
  //           );
  //         })}
  //       </div>
  //     );
  //     const discDataItem: DisclosureData = { title: traitType, content };
  //     retData.push(discDataItem);
  //     return retData;
  //   };

  // const [disclosureData, setDisclosureData] = useState<DisclosureData[]>(getDisclosureData('All'));

  useEffect(() => {
    // when filterState changed (somewhere else) => parse it and set to TypeValueMap for checkboxes' states
    const traitTypes = filterState?.traitTypes || [];
    const traitValues = filterState?.traitValues || [];
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
  }, [filterState]);

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

  return (
    <div className="w-full h-full">
      <div className="border-b-[1px] pb-3">
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
      <div className="h-full flex border-b-[1px]">
        <div className={twMerge('w-1/3 border-r-[1px] overflow-y-scroll text-sm', cardColor)}>
          {traitTypeAndNumValues?.map((item) => {
            return (
              <div
                className={twMerge(
                  'flex cursor-pointer rounded-lg justify-between py-2 px-2',
                  hoverColor,
                  selectedTraitType === item.name && 'font-bold'
                )}
                onClick={() => {
                  setSelectedTraitType(item.name);
                }}
              >
                <div className="truncate">{item.name}</div>
                <div className="">{item.numValues}</div>
              </div>
            );
          })}
        </div>
        <div className="w-2/3 ml-2 overflow-y-scroll">
          <div className="w-full space-y-1">
            {allDisclosureData.map((item) => {
              return (
                <Disclosure defaultOpen>
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className={twMerge(cardColor, hoverColor, 'flex w-full justify-between rounded-lg p-2 text-sm')}
                      >
                        <span>{item.title}</span>
                        <RxCaretDown
                          className={twMerge(`${open ? 'rotate-180 transform' : ''}`, smallIconButtonStyle)}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="text-sm px-2">{item.content}</Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            })}
          </div>
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

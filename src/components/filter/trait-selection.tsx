import { CollectionAttributes } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { useFilterContext } from 'src/utils/context/FilterContext';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { Button, Checkbox, TextInputBox } from '../common';

type ValueMapItem = {
  [k: string]: boolean;
};

type TypeValueMap = {
  [k: string]: ValueMapItem;
};

// open/close state of each TraitType section
type OpenState = {
  [k: string]: boolean;
};

// search text of each TraitType section
type SearchState = {
  [k: string]: string;
};

// // transform typeValueMap into array of traitTypes & traitValues (api filter params).
// // example: { Shirt: { Black: true, White: true } } => ['Shirt'] and ['Black|White']
const getSelections = (typeValueMap: TypeValueMap) => {
  const traitTypes = [];
  const traitValues: string[] = [];
  for (const type of Object.keys(typeValueMap)) {
    if (!type) {
      continue;
    }
    const map = typeValueMap[type];
    const arr = [];
    for (const val of Object.keys(map)) {
      if (map[val] === true) {
        arr.push(val);
      }
    }
    if (arr.length > 0) {
      traitTypes.push(type);
      traitValues.push(arr.join('|'));
    }
  }
  return [traitTypes, traitValues];
};

// type TraitData = {
//   trait_type: string;
//   values: string[];
// };

type Props = {
  traits?: CollectionAttributes;
  collectionAddress?: string;
  // traitData: TraitData[];
  onChange: (traitTypes: string[], traitValues: string[]) => void;
  onClearAll: () => void;
};

export const TraitSelection = ({ traits, onChange, onClearAll }: Props) => {
  const { filterState } = useFilterContext();
  const [openState, setOpenState] = useState<OpenState>({});
  const [searchState, setSearchState] = useState<SearchState>({});
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});

  // const { result } = useFetch<{ traits: TraitData[] }>(`/collections/${collectionAddress}/traits`);
  // const traitData = result?.traits;
  const traitData = [];
  for (const traitName in traits) {
    traitData.push({
      ...traits[traitName],
      name: traitName
    });
  }

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

  if (!traitData || traitData.length === 0) {
    return <></>;
  }

  return (
    <div>
      {traitData?.map((item) => {
        const valuesArr = [];
        for (const valueName in item.values) {
          valuesArr.push({
            ...item.values[valueName],
            name: valueName
          });
        }

        return (
          <React.Fragment key={item.name}>
            <div
              className="py-2 mb-4 flex items-center cursor-pointer font-heading font-thin select-none"
              onClick={() => {
                const newOpenState = { ...openState, [item.name]: !openState[item.name] };
                setOpenState(newOpenState);
              }}
            >
              <div className="flex-1">{item.name}</div>
              {openState[item.name] ? <AiOutlineMinus className="text-lg" /> : <AiOutlinePlus className="text-lg" />}
            </div>

            {openState[item.name] && (
              <div>
                <TextInputBox
                  label=""
                  type="text"
                  className="border rounded-lg py-2 px-4 mt-1 font-heading w-[90%]"
                  value={searchState[item.name]}
                  onChange={(value) => {
                    const text = value;
                    const newSearchState = { ...searchState, [item.name]: text };
                    setSearchState(newSearchState);
                  }}
                  // onClear={() => {
                  //   const newSearchState = { ...searchState, [item.name]: '' };
                  //   setSearchState(newSearchState);
                  // }}
                  placeholder="Filter"
                />

                <div className="max-h-80 overflow-y-auto overflow-x-clip my-8 space-y-8">
                  {valuesArr.map((value) => {
                    const searchText = (searchState[item.name] || '').toLowerCase();
                    if (searchText && value.name.toLowerCase().indexOf(searchText) < 0) {
                      return null;
                    }

                    return (
                      <div key={`${item.name}_${value.name}`} className="mr-4">
                        <Checkbox
                          boxOnLeft={false}
                          checked={(typeValueMap[item.name] || {})[value.name] ?? false}
                          onChange={(checked) => {
                            typeValueMap[item.name] = typeValueMap[item.name] || {};
                            typeValueMap[item.name][value.name] = checked;

                            const [traitTypes, traitValues] = getSelections(typeValueMap);
                            if (onChange) {
                              onChange(traitTypes, traitValues);
                            }
                          }}
                          label={value.name}
                          className=""
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}

      <Button variant="primary" className="font-heading w-full py-3" onClick={onClearAll}>
        Clear All
      </Button>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { useFetch } from 'src/utils/apiUtils';
import { useFilterContext } from 'src/utils/context/FilterContext';

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

type TraitData = {
  trait_type: string;
  values: string[];
};

type Props = {
  collectionAddress?: string;
  // traitData: TraitData[];
  onChange: (traitTypes: string[], traitValues: string[]) => void;
};

export const TraitSelection = ({ collectionAddress, onChange }: Props) => {
  const { filterState } = useFilterContext();
  const [openState, setOpenState] = useState<OpenState>({});
  const [searchState, setSearchState] = useState<SearchState>({});
  const [typeValueMap, setTypeValueMap] = useState<TypeValueMap>({});

  const { result } = useFetch<{ traits: TraitData[] }>(`/collections/${collectionAddress}/traits`);
  const traitData = result?.traits;

  useEffect(() => {
    // when filterState changed (somewhere else) => parse it and set to TypeValueMap for checkboxes' states
    const traitTypes = (filterState?.traitTypes || '').split(',');
    const traitValues = (filterState?.traitValues || '').split(',');
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
        return (
          <React.Fragment key={item.trait_type}>
            <div className="p-2 border-b mt-2 flex items-center cursor-pointer">
              <div
                className="flex-1"
                onClick={() => {
                  const newOpenState = { ...openState, [item.trait_type]: !openState[item.trait_type] };
                  setOpenState(newOpenState);
                }}
              >
                {item.trait_type}
              </div>
              <FaChevronDown className="text-xs" />
            </div>

            {openState[item.trait_type] && (
              <div>
                <input
                  className="border rounded-lg p-2 ml-2 mt-1 text-sm w-full"
                  defaultValue={searchState[item.trait_type]}
                  onChange={(ev) => {
                    const text = ev.target.value;
                    const newSearchState = { ...searchState, [item.trait_type]: text };
                    setSearchState(newSearchState);
                  }}
                  // onClear={() => {
                  //   const newSearchState = { ...searchState, [item.trait_type]: '' };
                  //   setSearchState(newSearchState);
                  // }}
                  placeholder="Filter"
                />

                <div className="pl-2 h-40 overflow-y-scroll">
                  {item.values.map((value) => {
                    const searchText = (searchState[item.trait_type] || '').toLowerCase();
                    if (searchText && value.toLowerCase().indexOf(searchText) < 0) {
                      return null;
                    }
                    return (
                      <div key={`${item.trait_type}_${value}`} className="mt-2">
                        <label>
                          <input
                            type="checkbox"
                            checked={(typeValueMap[item.trait_type] || {})[value] ?? false}
                            onChange={(ev) => {
                              typeValueMap[item.trait_type] = typeValueMap[item.trait_type] || {};
                              typeValueMap[item.trait_type][value] = ev.target.checked;

                              const [traitTypes, traitValues] = getSelections(typeValueMap);
                              if (onChange) {
                                onChange(traitTypes, traitValues);
                              }
                            }}
                            className="mr-2"
                          />
                          {value}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default TraitSelection;

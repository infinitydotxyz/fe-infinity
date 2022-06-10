import { BaseCollection, OBOrderItem } from '@infinityxyz/lib-frontend/types/core';
import { debounce } from 'lodash';
import { useState, useEffect } from 'react';
import { Checkbox, TextInputBox } from 'src/components/common';
import { apiGet } from 'src/utils';
import { UserProfileDto } from '../user/user-profile-dto';

export type UserOrderFilter = {
  orderType?: 'listings' | 'offers';
  minPrice?: string;
  maxPrice?: string;
  numItems?: string;
  collections?: string[];
};

interface Props {
  collection?: BaseCollection;
  collectionAddress?: string;
  showFilterSections?: string[];
  userInfo: UserProfileDto;
  className?: string;
  onChange: (filter: UserOrderFilter) => void;
}

export const UserProfileOrderFilterPanel = ({ className, onChange, userInfo }: Props) => {
  const [minPriceVal, setMinPriceVal] = useState('');
  const [maxPriceVal, setMaxPriceVal] = useState('');
  const [numItems, setNumItems] = useState('');
  const [collections, setCollections] = useState<OBOrderItem[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [collectionSearch, setCollectionSearch] = useState('');
  const [filter, setFilter] = useState<UserOrderFilter>({
    orderType: 'listings'
  });

  const fetchOrderCollections = async () => {
    const { result, error } = await apiGet(`/orders/${userInfo.address}/collections`, {
      requiresAuth: true,
      query: {
        limit: -1,
        name: collectionSearch
      }
    });
    if (!error) {
      setCollections(result?.data as OBOrderItem[]);
    }
  };

  useEffect(() => {
    fetchOrderCollections();
  }, [collectionSearch]);

  const onClickOrderType = (newType: 'listings' | 'offers') => {
    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
    onChange(newFilter);
  };

  const onChangeNameSearch = debounce((value: string) => {
    setCollectionSearch(value);
  }, 300);

  return (
    <div className={`w-80 mr-12 pointer-events-auto ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      <div className="text-lg mt-6 mb-4 font-heading">Order Type</div>
      <ul>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'listings'}
            onChange={() => onClickOrderType('listings')}
            label="Listing"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'offers'}
            onChange={() => onClickOrderType('offers')}
            label="Offers"
          />
        </li>
      </ul>

      <hr className="mt-8" />
      <div className="text-lg mt-6 font-heading">Collection</div>
      <div className="flex flex-col mt-4 mb-6">
        <div className="w-full">
          <TextInputBox
            label=""
            type="text"
            className="border rounded-full py-2 px-4 mt-4 font-heading"
            defaultValue={''}
            onChange={onChangeNameSearch}
            placeholder="Search"
          />
        </div>

        <ul className="mt-8 w-full max-h-80 overflow-y-auto space-y-4">
          {collections.map((coll, i) => {
            return (
              <Checkbox
                key={`${i}-${coll.collectionAddress}`}
                boxOnLeft={false}
                className="pb-4 w-full"
                checked={selectedCollections.includes(`${coll.collectionAddress}`)}
                onChange={(checked) => {
                  let arr: string[] = [];
                  if (checked) {
                    arr = [...selectedCollections, coll.collectionAddress];
                  } else {
                    arr = selectedCollections.filter((address) => address !== coll.collectionAddress);
                  }
                  setSelectedCollections(arr);
                  const newFilter = { ...filter };
                  newFilter.collections = arr;
                  setFilter(newFilter);
                  onChange(newFilter);
                }}
                label={coll.collectionName}
              />
            );
          })}
        </ul>
      </div>

      <hr className="mt-8" />
      <div className="text-lg mt-6 font-heading">Price</div>
      <div className="flex mt-4 mb-6">
        <TextInputBox
          addEthSymbol={true}
          type="number"
          className="border-gray-300 font-heading"
          label="Min"
          placeholder=""
          value={minPriceVal}
          bindValue={true}
          onChange={(value) => {
            setMinPriceVal(value);
            const newFilter = { ...filter };
            newFilter.minPrice = value;
            setFilter(newFilter);
            onChange(newFilter);
          }}
        />
        <TextInputBox
          addEthSymbol={true}
          type="number"
          className="border-gray-300 font-heading ml-2"
          label="Max"
          placeholder=""
          value={maxPriceVal}
          bindValue={true}
          onChange={(value) => {
            setMaxPriceVal(value);
            const newFilter = { ...filter };
            newFilter.maxPrice = value;
            setFilter(newFilter);
            onChange(newFilter);
          }}
        />
      </div>

      <div className="text-lg mt-6 font-heading">Number of NFTs</div>
      <div className="flex mt-4 mb-6">
        <TextInputBox
          addEthSymbol={true}
          type="number"
          className="border-gray-300 font-heading"
          label="Amount of NFTs"
          placeholder=""
          value={numItems}
          bindValue={true}
          onChange={(value) => {
            setNumItems(value);
            const newFilter = { ...filter };
            newFilter.numItems = value;
            setFilter(newFilter);
            onChange(newFilter);
          }}
        />
      </div>

      {/* <div className="flex">
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading" onClick={onClickApply}>
          Apply
        </Button>
        <Button variant="gray" className="py-3 w-1/2 bg-theme-gray-100 font-heading ml-2" onClick={onClickClear}>
          Clear
        </Button>
      </div> */}

      <hr className="mt-8" />
    </div>
  );
};

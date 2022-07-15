import { BaseCollection, OBOrderItem } from '@infinityxyz/lib-frontend/types/core';
import { useState, useEffect } from 'react';
import { Checkbox, TextInputBox, Spinner, DebouncedTextInputBox } from 'src/components/common';
import { apiGet } from 'src/utils';
import { UserProfileDto } from '../user/user-profile-dto';

export type UserOrderFilter = {
  orderType?: 'listings' | 'offers-made' | 'offers-received' | '';
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
  const [selectedCollections, setSelectedCollections] = useState<OBOrderItem[]>([]);
  const [collectionSearch, setCollectionSearch] = useState('');
  const [collectionSearchLoading, setCollectionSearchLoading] = useState(false);
  const [filter, setFilter] = useState<UserOrderFilter>({
    orderType: ''
  });

  // for collection search:
  const fetchOrderCollections = async () => {
    setCollections([]);
    setCollectionSearchLoading(true);
    const { result, error } = await apiGet(`/orders/${userInfo.address}/collections`, {
      requiresAuth: true,
      query: {
        limit: 50,
        collectionName: collectionSearch
      }
    });
    setCollectionSearchLoading(false);
    if (!error) {
      setCollections(result?.data as OBOrderItem[]);
    }
  };

  useEffect(() => {
    fetchOrderCollections();
  }, [collectionSearch]);

  const onClickOrderType = (newType: 'listings' | 'offers-made' | 'offers-received' | '') => {
    const newFilter = {
      ...filter,
      orderType: newType
    };
    setFilter(newFilter);
    onChange(newFilter);
  };

  const CollectionCheckbox = ({ collection, reactKey }: { collection: OBOrderItem; reactKey: string }) => (
    <Checkbox
      key={`${collection.collectionAddress}_${reactKey}`}
      boxOnLeft={false}
      className="pb-4 w-full"
      checked={selectedCollections.map((c) => c.collectionAddress).includes(`${collection.collectionAddress}`)}
      onChange={(checked) => {
        let arr: OBOrderItem[] = [];
        if (checked) {
          arr = [...selectedCollections, collection];
        } else {
          arr = selectedCollections.filter((c) => c.collectionAddress !== collection.collectionAddress);
        }
        setSelectedCollections(arr);
        const newFilter = { ...filter };
        newFilter.collections = arr.map((c) => c.collectionAddress);
        setFilter(newFilter);
        onChange(newFilter);
      }}
      label={collection.collectionName}
    />
  );

  return (
    <div className={`w-80 mr-12 pointer-events-auto ${className ?? ''}`}>
      <div className="text-2xl font-bold">Filter</div>

      <div className="text-lg mt-6 mb-4 font-heading">Order Type</div>
      <ul>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === ''}
            onChange={() => onClickOrderType('')}
            label="All"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'listings'}
            onChange={() => onClickOrderType('listings')}
            label="Listings"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'offers-made'}
            onChange={() => onClickOrderType('offers-made')}
            label="Offers made"
          />
        </li>
        <li className="mt-8">
          <Checkbox
            boxOnLeft={false}
            checked={filter.orderType === 'offers-received'}
            onChange={() => onClickOrderType('offers-received')}
            label="Offers received"
          />
        </li>
      </ul>

      <hr className="mt-8" />
      <div className="text-lg mt-6 font-heading">Collection</div>
      <div className="flex flex-col mt-4 mb-6">
        <div className="w-full">
          <DebouncedTextInputBox
            label=""
            type="text"
            className="border rounded-full py-2 px-4 mt-4 font-heading"
            value={collectionSearch}
            onChange={(value) => setCollectionSearch(value)}
            placeholder="Search"
          />
        </div>

        <ul className="mt-8 w-full min-h-[100px] max-h-80 overflow-y-auto space-y-4">
          {selectedCollections.map((coll, idx) => (
            <CollectionCheckbox reactKey={`${idx}`} collection={coll} />
          ))}

          {collections.map((coll, idx) => {
            if (selectedCollections.map((c) => c.collectionAddress).includes(`${coll.collectionAddress}`)) {
              return null;
            }
            return <CollectionCheckbox reactKey={`${idx}`} collection={coll} />;
          })}

          {collectionSearchLoading && (
            <div className="h-24">
              <Spinner />
            </div>
          )}
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

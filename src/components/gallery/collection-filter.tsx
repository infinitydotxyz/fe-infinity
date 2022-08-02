import { useState } from 'react';
import { apiGet } from 'src/utils';
import { DebouncedTextInputBox, EZImage } from '../common';

export type CollectionInfo = {
  chainId: string;
  address: string;
  name: string;
  slug: string;
  profileImage: string;
  bannerImage?: string;
  hasBlueCheck?: boolean;
};

interface Props {
  onSearch: (filteredAddresses: string[]) => void;
}

const CollectionFilter = ({ onSearch }: Props) => {
  const [collections, setCollections] = useState<CollectionInfo[]>([]);

  const fetchData = async (value: string) => {
    if (value) {
      const { result } = await apiGet(`/collections/search`, {
        query: { query: value, limit: 20 }
      });
      const data = (result?.data ?? []) as CollectionInfo[];
      setCollections(data);
      onSearch(data.map((item) => item.address));
    } else {
      setCollections([]);
      onSearch([]);
    }
  };

  return (
    <div className="">
      <DebouncedTextInputBox
        label=""
        type="text"
        className="border rounded-full py-2 px-4 mb-6 font-heading w-full"
        value=""
        onChange={(value) => fetchData(value)}
        placeholder="Search"
      />

      <div className="max-h-[250px] overflow-y-auto space-y-2">
        {collections.map((item) => {
          if (!item.name || !item.address || !item.profileImage) {
            return null;
          }
          return (
            <div key={item.address} className="flex items-center space-x-4">
              <EZImage className="h-9 w-9 rounded-full overflow-clip" src={item.profileImage} />
              <div>{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CollectionFilter;

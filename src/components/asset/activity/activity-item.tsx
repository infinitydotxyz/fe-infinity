import React from 'react';
import { ITEMS_PER_PAGE } from 'src/utils';

export interface NftActivity {
  address: string;
  tokenId: string;
  chainId: string;
  type: string;
  from: string;
  fromDisplayName?: string;
  to?: string;
  toDisplayName?: string;
  price?: number;
  paymentToken: string;
  internalUrl?: string;
  externalUrl?: string;
  timestamp: number;
}

interface ActivityItemProps {
  item: NftActivity;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 bg-theme-light-300 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl">
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Seller</p>
        <p className="font-body font-bold tracking-tight text-black">{item.fromDisplayName || item.from}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Buyer</p>
        <p className="font-body font-bold tracking-tight text-black">{item.toDisplayName || item.to}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Price</p>
        <p className="font-body font-bold tracking-tight text-black">Ξ {item.price}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Date</p>
        <p className="font-body font-bold tracking-tight text-black">15 mins ago</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800">Link</p>
        <p className="font-body font-bold tracking-tight text-black">{item.internalUrl || item.externalUrl}</p>
      </div>
    </div>
  );
};

import React from 'react';
import moment from 'moment';
import { ellipsisAddress } from 'src/utils';
import { EthSymbol } from 'src/components/common';

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

const shortAddress = (address: string | undefined | null) =>
  address && address.length > 20 ? `${ellipsisAddress(address)}` : address;

const ETHERSCAN_URL = 'https://etherscan.io/tx/';

export const ActivityItem: React.FC<ActivityItemProps> = ({ item }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 bg-theme-light-300 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl">
      <div>
        <p className="font-body tracking-tight text-theme-light-800 leading-normal">Seller</p>
        <p className="font-body font-bold tracking-tight text-black">
          {shortAddress(item.fromDisplayName || item.from)}
        </p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800 leading-normal">Buyer</p>
        <p className="font-body font-bold tracking-tight text-black">{shortAddress(item.toDisplayName || item.to)}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800 leading-normal">Price</p>
        <p className="font-body font-bold tracking-tight text-black">{`${EthSymbol} ${item.price}`}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800 leading-normal">Date</p>
        <p className="font-body font-bold tracking-tight text-black">{moment(item.timestamp).fromNow()}</p>
      </div>
      <div>
        <p className="font-body tracking-tight text-theme-light-800 leading-normal">Link</p>
        <a className="font-body font-bold tracking-tight text-black" rel="noopener noreferrer" href={item.externalUrl}>
          {shortAddress(item.externalUrl ? item.externalUrl.replace(ETHERSCAN_URL, '') : 'No Txn')}
        </a>
      </div>
    </div>
  );
};

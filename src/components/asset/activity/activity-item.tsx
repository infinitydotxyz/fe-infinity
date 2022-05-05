import React from 'react';
import moment from 'moment';
import { ellipsisAddress } from 'src/utils';
import { EthSymbol, ExternalLink } from 'src/components/common';

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

interface Props {
  item: NftActivity;
}

const ETHERSCAN_URL = 'https://etherscan.io/tx/';

export const ActivityItem = ({ item }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-3 bg-theme-light-300 px-6 sm:px-6 md:px-8 lg:px-16 -mx-1 my-2 sm:my-4 py-5 md:py-4 md:pt-12 md:pb-14 rounded-3xl">
      <div>
        <div className="tracking-tight text-theme-light-800 leading-normal">Seller</div>
        <div className="font-bold tracking-tight text-black">{ellipsisAddress(item.fromDisplayName || item.from)}</div>
      </div>
      <div>
        <div className="tracking-tight text-theme-light-800 leading-normal">Buyer</div>
        <div className="font-bold tracking-tight text-black">{ellipsisAddress(item.toDisplayName || item.to)}</div>
      </div>
      <div>
        <div className="tracking-tight text-theme-light-800 leading-normal">Price</div>
        <div className="font-bold tracking-tight text-black">{`${EthSymbol} ${item.price}`}</div>
      </div>
      <div>
        <div className="tracking-tight text-theme-light-800 leading-normal">Date</div>
        <div className="font-bold tracking-tight text-black">{moment(item.timestamp).fromNow()}</div>
      </div>
      <div>
        <div className="tracking-tight text-theme-light-800 leading-normal">Link</div>
        <ExternalLink href={item.externalUrl} className="font-bold tracking-tight text-black">
          {ellipsisAddress(item.externalUrl ? item.externalUrl.replace(ETHERSCAN_URL, '') : 'No Txn')}
        </ExternalLink>
      </div>
    </div>
  );
};

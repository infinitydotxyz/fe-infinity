import { useState } from 'react';
import { getChainScannerBase } from 'src/utils';
import { EthPrice, Button } from 'src/components/common';
import { format } from 'timeago.js';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { UserProfileDto } from '../user/user-profile-dto';
import { OrderbookItem } from '../market/orderbook-list/orderbook-item';
import { getOrderType } from 'src/utils/marketUtils';

interface Props {
  order: SignedOBOrder;
  userInfo: UserProfileDto;
  onClickCancel: (order: SignedOBOrder, checked: boolean) => void;
}

export const UserPageOrderListItem = ({ order, onClickCancel }: Props) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const isListing = getOrderType(order) === 'Listing';
  return (
    <div>
      <div className="bg-gray-100 px-10 py-6 rounded-3xl flex items-center font-heading">
        {/* <NextLink href={`/collection/${order.nfts[0].collectionSlug}}`}>
          {order.nfts[0].collectionImage ? (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={order.nfts[0].collectionImage} />
          ) : (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={BLANK_IMAGE_URL_MINI} />
          )}
        </NextLink> */}
        <div className="flex justify-between w-full mx-8">
          <div className="w-1/4">
            {/* <div className="text-black font-bold font-body">
              <a href={`/collection/${order.nfts[0].collectionSlug}`}>{order.nfts[0].collectionName}</a>
            </div>
            <div></div> */}
            <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
          </div>

          <div className="w-1/8">
            <div className="text-gray-400">Event</div>
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(order.chainId)}/tx/${order.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getOrderType(order)}
              </a>
            </div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400">Min Price</div>
            <div className="font-bold">
              <EthPrice label={`${order.startPriceEth}`} />
            </div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400"># NFTs</div>
            <div className="font-bold">{order.nfts.length}</div>
          </div>
          <div className="w-1/8">
            <div className="text-gray-400">Expiry date</div>
            <div className="font-bold">{format(order.endTimeMs)}</div>
          </div>
          <div className="w-24">
            {isListing && (
              <Button
                onClick={() => {
                  const newState = !isCancelling;
                  setIsCancelling(newState);
                  onClickCancel(order, newState);
                }}
              >
                {isCancelling ? '✓' : ''} Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

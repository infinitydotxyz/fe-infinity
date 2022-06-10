import { BLANK_IMG, getChainScannerBase } from 'src/utils';
import { EthPrice, NextLink, BGImage } from 'src/components/common';
import { format } from 'timeago.js';
import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { UserProfileDto } from '../user/user-profile-dto';

interface Props {
  event: SignedOBOrder;
  userInfo: UserProfileDto;
}

export const UserPageOrderListItem = ({ event, userInfo }: Props) => {
  return (
    <div>
      <div className="bg-gray-100 px-10 py-6 rounded-3xl flex items-center font-heading">
        <NextLink href={`/collection/${event.nfts[0].collectionSlug}}`}>
          {event.nfts[0].collectionImage ? (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={event.nfts[0].collectionImage} />
          ) : (
            <BGImage className="w-16 h-16 max-h-[80px] rounded-full" src={BLANK_IMG} />
          )}
        </NextLink>
        <div className="flex justify-between w-full mx-8">
          <div className="w-1/6">
            <div className="text-black font-bold font-body">
              <a href={`/collection/${event.nfts[0].collectionSlug}`}>{event.nfts[0].collectionName}</a>
            </div>
            <div></div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Event</div>
            <div className="font-bold">
              <a
                href={`${getChainScannerBase(event.chainId)}/tx/${event.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {event.isSellOrder ? 'Sale' : event.makerAddress === userInfo?.address ? 'Listing' : 'Offer'}
              </a>
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Min Price</div>
            <div className="font-bold">
              <EthPrice label={`${event.startPriceEth}`} />
            </div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">NFT amount</div>
            <div className="font-bold">{event.nfts.length}</div>
          </div>
          <div className="w-1/6">
            <div className="text-gray-400">Expiry date</div>
            <div className="font-bold">{format(event.endTimeMs)}</div>
          </div>
          {/* <div className="w-1/6">
            <div className="text-gray-400">Action</div>
            <div className="font-bold">
              Buy
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

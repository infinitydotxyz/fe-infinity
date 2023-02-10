import { CollectionSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { nFormatter, timeAgo } from 'src/utils';
import { borderColor, divideColor, iconButtonStyle, smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, EthSymbol, EZImage, HelpToolTip, Spacer } from '../common';
import { CiShoppingCart } from 'react-icons/ci';
import { HiOutlineTag } from 'react-icons/hi';
import { VscMegaphone } from 'react-icons/vsc';

interface Props {
  data: CollectionSaleAndOrder[];
}

export const CollectionRecentSalesOrders = ({ data }: Props) => {
  const [salesSelected, setSalesSelected] = useState(true);
  const [listingsSelected, setListingsSelected] = useState(true);
  const [offersSelected, setOffersSelected] = useState(true);

  const dataToShow = data.filter((item) => {
    if (item.dataType === 'Sale' && salesSelected) {
      return true;
    } else if (item.dataType === 'Listing' && listingsSelected) {
      return true;
    } else if (item.dataType === 'Offer' && offersSelected) {
      return true;
    }
    return false;
  });

  return (
    <div className={twMerge('w-full flex flex-col mt-2 p-3 border rounded-lg text-sm space-y-3', borderColor)}>
      <div className={twMerge('flex space-x-4 px-3')}>
        <div className="flex items-center space-x-2">
          <span className="flex w-2 h-2 relative">
            <span className="animate-ping absolute w-full h-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="rounded-full w-full bg-brand-primary"></span>
          </span>
          <span>Live</span>
        </div>

        <Spacer />

        <Checkbox
          label="Sales"
          checked={salesSelected}
          onChange={() => {
            setSalesSelected(!salesSelected);
          }}
        />
        <Checkbox
          label="Listings"
          checked={listingsSelected}
          onChange={() => {
            setListingsSelected(!listingsSelected);
          }}
        />
        <Checkbox
          label="Offers"
          checked={offersSelected}
          onChange={() => {
            setOffersSelected(!offersSelected);
          }}
        />
      </div>

      <div className={twMerge('divide-y', divideColor)}>
        {dataToShow.map((item) => {
          return (
            <div
              key={item.id}
              className="grid p-3 justify-between items-center w-full"
              style={{
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 4fr) minmax(0, 1fr)'
              }}
            >
              <div className="flex space-x-1 items-center">
                <div>
                  {item.dataType === 'Sale' ? (
                    <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Sale</div>}>
                      <CiShoppingCart className={iconButtonStyle} />
                    </HelpToolTip>
                  ) : item.dataType === 'Listing' ? (
                    <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Listing</div>}>
                      <HiOutlineTag style={{ transform: 'rotate(90deg)' }} className={twMerge(smallIconButtonStyle)} />
                    </HelpToolTip>
                  ) : (
                    <HelpToolTip placement="top" content={<div className="whitespace-nowrap">Offer</div>}>
                      <VscMegaphone className={smallIconButtonStyle} />
                    </HelpToolTip>
                  )}
                </div>
                <div className="text-xs">{timeAgo(new Date(item.timestamp))}</div>
              </div>
              <div className="flex space-x-3 items-center">
                <EZImage src={item.tokenImage} className="w-6 h-6 rounded" />
                <span className="">{item.tokenId}</span>
              </div>
              <div className={twMerge(borderColor, 'border rounded-lg p-2')}>
                {nFormatter(item.priceEth)} {EthSymbol}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

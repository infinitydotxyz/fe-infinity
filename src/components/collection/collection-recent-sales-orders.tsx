import { CollectionSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FiShoppingCart } from 'react-icons/fi';
import { HiOutlineTag } from 'react-icons/hi';
import { VscMegaphone } from 'react-icons/vsc';
import { ellipsisString, nFormatter, timeAgo } from 'src/utils';
import { BasicTokenInfo } from 'src/utils/types';
import {
  borderColor,
  divideColor,
  secondaryBgColor,
  secondaryTextColor,
  smallIconButtonStyle,
  textColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { Checkbox, EthSymbol, EZImage, HelpToolTip, Spacer } from '../common';

interface Props {
  data: CollectionSaleAndOrder[];
  collectionAddress: string;
}

export const CollectionRecentSalesOrders = ({ data, collectionAddress }: Props) => {
  const [salesSelected, setSalesSelected] = useState(true);
  const [listingsSelected, setListingsSelected] = useState(true);
  const [offersSelected, setOffersSelected] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionSaleAndOrder | null>(null);
  const router = useRouter();

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: selectedItem?.tokenId ?? '',
    collectionAddress: collectionAddress,
    chainId: '1' // future-todo dont hardcode
  };

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

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

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0
  } = useTooltip<CollectionSaleAndOrder>({
    tooltipOpen: false,
    tooltipLeft: 0,
    tooltipTop: 0,
    tooltipData: {
      timestamp: 0,
      tokenId: '',
      tokenImage: '',
      priceEth: 0,
      id: '',
      dataType: 'Sale',
      executionStatus: null
    }
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
                      <FiShoppingCart className={smallIconButtonStyle} />
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
              <div
                className="flex space-x-3 items-center cursor-pointer"
                onMouseMove={(event) => {
                  const coords = event.currentTarget.getBoundingClientRect();
                  showTooltip({
                    tooltipLeft: coords.left,
                    tooltipTop: coords.top,
                    tooltipData: item
                  });
                }}
                onMouseLeave={() => {
                  hideTooltip();
                }}
                onClick={() => {
                  setSelectedItem(item);
                  const { pathname, query } = router;
                  query['tokenId'] = item.tokenId;
                  query['collectionAddress'] = collectionAddress;
                  router.replace({ pathname, query }, undefined, { shallow: true });
                }}
              >
                <EZImage src={item.tokenImage} className="w-6 h-6 rounded" />
                <span className="">{ellipsisString(item.tokenId)}</span>
              </div>
              <div className={twMerge(borderColor, 'border rounded-lg p-2')}>
                {nFormatter(item.priceEth)} {EthSymbol}
              </div>

              <ToolTip isTooltipOpen={tooltipOpen} left={tooltipLeft} top={tooltipTop} data={tooltipData} />
            </div>
          );
        })}
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} />}
    </div>
  );
};

interface Props2 {
  left: number;
  top: number;
  data?: CollectionSaleAndOrder;
  isTooltipOpen: boolean;
}

function ToolTip({ left, top, data, isTooltipOpen }: Props2) {
  return (
    <TooltipWithBounds
      key={isTooltipOpen ? 1 : 0} // needed for bounds to update correctly
      style={{
        ...defaultStyles,
        background: 'none',
        zIndex: 100,
        borderRadius: 9,
        padding: 0,
        opacity: isTooltipOpen ? 1 : 0
      }}
      left={left}
      top={top}
    >
      <div
        className={twMerge(secondaryBgColor, textColor, 'flex flex-col p-2 rounded-lg')}
        style={{ aspectRatio: '3.5 / 5' }}
      >
        <div className="flex-1 rounded-lg overflow-clip">
          <EZImage src={data?.tokenImage} />
        </div>

        <div className="truncate py-2">{ellipsisString(data?.tokenId)}</div>

        <div className={twMerge('flex flex-row space-x-3')}>
          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Price</div>
            <div className="truncate">{data?.priceEth}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className={twMerge('font-medium text-xs', secondaryTextColor)}>Date</div>
            <div className="truncate">{format(new Date(data?.timestamp ?? 0), 'MMM dd yyyy')}</div>
          </div>
        </div>
      </div>
    </TooltipWithBounds>
  );
}

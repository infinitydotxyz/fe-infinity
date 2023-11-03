import { CollectionSaleAndOrder } from '@infinityxyz/lib-frontend/types/core';
import { defaultStyles, TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ellipsisString, nFormatter, timeAgo } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { BasicTokenInfo } from 'src/utils/types';
import { containerBGColor, secondaryBgColor, secondaryTextColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { Checkbox, EthSymbol, EZImage, Spacer } from '../common';
import { StatusIcon } from '../common/status-icon';

interface Props {
  data: CollectionSaleAndOrder[];
  collectionAddress: string;
  collectionSlug: string;
}

export const CollectionRecentSalesOrders = ({ data, collectionAddress, collectionSlug }: Props) => {
  const [salesSelected, setSalesSelected] = useState(true);
  const [listingsSelected, setListingsSelected] = useState(true);
  const [bidsSelected, setBidsSelected] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CollectionSaleAndOrder | null>(null);
  const router = useRouter();
  const { chain } = useNetwork();
  const { selectedChain } = useAppContext();
  const chainId = String(chain?.id ?? selectedChain);

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: selectedItem?.tokenId ?? '',
    collectionAddress: collectionAddress,
    collectionSlug: collectionSlug,
    chainId
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
    } else if (item.dataType === 'Offer' && bidsSelected) {
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
    <div className={twMerge('w-full flex flex-col rounded-lg text-sm space-y-6 pt-6')}>
      <div className={twMerge('flex space-x-4 items-center')}>
        <div className="flex flex-col gap-2.5">
          <div className={twMerge('flex text-22 font-bold text-neutral-700 dark:text-white')}>
            Sales, Listings & Bids
          </div>
          <div className={twMerge('flex space-x-5')}>
            <Checkbox
              label="Sales"
              checked={salesSelected}
              onChange={() => {
                setSalesSelected(!salesSelected);
              }}
              className={twMerge('text-sm font-semibold text-neutral-700', secondaryTextColor)}
              tickMarkClassName="bg-neutral-700 dark:bg-white peer-checked:text-white dark:peer-checked:text-neutral-700"
            />
            <Checkbox
              label="Listings"
              checked={listingsSelected}
              onChange={() => {
                setListingsSelected(!listingsSelected);
              }}
              className={twMerge('text-sm font-semibold', secondaryTextColor)}
              tickMarkClassName="bg-neutral-700 dark:bg-white peer-checked:text-white dark:peer-checked:text-neutral-700"
            />
            <Checkbox
              label="Bids"
              checked={bidsSelected}
              onChange={() => {
                setBidsSelected(!bidsSelected);
              }}
              className={twMerge('text-sm font-semibold', secondaryTextColor)}
              tickMarkClassName="bg-neutral-700 dark:bg-white peer-checked:text-white dark:peer-checked:text-neutral-700"
            />
          </div>
        </div>
        <Spacer />
        <StatusIcon status="pending-indefinite" label="Live" />
      </div>

      {/* <div className={twMerge('divide-y', divideColor)}> */}
      <div className={twMerge('rounded-10 p-2.5', containerBGColor)}>
        {dataToShow.map((item) => {
          const isNonTokenBid = item.tokenId === 'Collection Bid' || item.tokenId === 'Trait Bid';
          return (
            <div
              key={item.id}
              className="grid py-2.5 px-3.5 justify-between items-center w-full"
              style={{
                gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)'
              }}
            >
              <div className="flex gap-2.5 items-center">
                <div
                  className={twMerge('flex space-x-2.5 items-center', !isNonTokenBid ? 'cursor-pointer' : '')}
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
                    if (isNonTokenBid) {
                      return;
                    }
                    setSelectedItem(item);
                    const { pathname, query } = router;
                    query['tokenId'] = item.tokenId;
                    query['collectionAddress'] = collectionAddress;
                    router.replace({ pathname, query }, undefined, { shallow: true });
                  }}
                >
                  <EZImage src={item.tokenImage} className="w-7.5 h-7.5" />
                  <div className="flex-col">
                    <span className={twMerge('text-base font-semibold font-body', secondaryTextColor)}>
                      {ellipsisString(item.tokenId)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 items-center">
                  <p className="text-base font-semibold font-body text-neutral-300">
                    Collection bid {timeAgo(new Date(item.timestamp))} ago
                  </p>
                </div>
              </div>
              <p className={twMerge('text-right text-17 font-normal font-body')}>
                {nFormatter(item.priceEth, 2)} {EthSymbol}
              </p>

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
            <div className="truncate">
              {data?.priceEth} {EthSymbol}
            </div>
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

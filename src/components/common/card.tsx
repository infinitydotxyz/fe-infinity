import { PROTOCOL_FEE_BPS } from '@infinityxyz/lib-frontend/utils';
import { formatEther, parseEther } from 'ethers/lib/utils.js';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiCheckCircle, HiOutlineLightBulb, HiPlusCircle } from 'react-icons/hi';
import { CollectionPageTabs, ellipsisString, nFormatter } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  hoverColorBrandText,
  iconButtonStyle,
  secondaryBgColor,
  secondaryBtnBgColorText,
  secondaryTextColor,
  selectionBorder
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from '../astra/astra-button';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { BlueCheck, EZImage, EthSymbol } from '../common';

interface Props {
  data: ERC721TokenCartItem;
  selected: boolean;
  isSelectable: (data: ERC721TokenCartItem) => boolean;
  onClick: (data: ERC721TokenCartItem) => void;
  collectionFloorPrice?: string | number | null | undefined;
  collectionCreator?: string;
}

export const GridCard = ({
  data,
  onClick,
  selected,
  isSelectable,
  collectionFloorPrice,
  collectionCreator
}: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;
  const { selectedCollectionTab } = useAppContext();

  let price = data?.price
    ? data.price
    : data?.orderSnippet?.listing?.orderItem?.startPriceEth
    ? data?.orderSnippet?.listing?.orderItem?.startPriceEth
    : 0;
  const gasCostEth = data?.orderSnippet?.listing?.orderItem?.gasCostEth ?? 0;
  const feeCostEth = data?.orderSnippet?.listing?.orderItem?.feeCostEth ?? 0;

  const priceWei = parseEther(price.toString());
  const calcFeesWei = priceWei.mul(PROTOCOL_FEE_BPS).div(10_000);
  const calcFeeCostEth = parseFloat(formatEther(calcFeesWei));
  const finalFeeCostEth = Math.min(calcFeeCostEth, feeCostEth);

  const deltaPrice = gasCostEth + finalFeeCostEth;
  const showDeltaPrice = deltaPrice > 0 && selectedCollectionTab === CollectionPageTabs.Intent.toString();
  const hidePrice = selectedCollectionTab === CollectionPageTabs.Bid.toString();
  if (hidePrice) {
    price = 0;
    data.price = 0;
    if (data.orderSnippet?.listing?.orderItem) {
      data.orderSnippet.listing.orderItem.startPriceEth = 0;
      data.orderSnippet.listing.orderItem.gasCostEth = 0;
      data.orderSnippet.listing.orderItem.feeCostEth = 0;
    }
  }

  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    chainId: data?.chainId ?? '',
    collectionFloorPrice,
    lastSalePriceEth: data?.lastSalePriceEth,
    mintPriceEth: data?.mintPriceEth,
    orderPriceEth: data?.price,
    validFrom: data?.validFrom,
    validUntil: data?.validUntil,
    orderSide: data?.orderSide,
    collectionCreator
  };

  const lastSalePrice = nFormatter(Number(data?.lastSalePriceEth ?? 0));

  const router = useRouter();
  const isCollectionPage = router.asPath.includes('/collection');

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const isModalOpen =
      router.query?.tokenId === basicTokenInfo.tokenId &&
      router.query?.collectionAddress === basicTokenInfo.collectionAddress;
    setModalOpen(isModalOpen);
  }, [router.query]);

  return (
    <div
      className={twMerge(
        secondaryBgColor,
        'rounded-lg w-full relative flex flex-col shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] \
             hover:shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] cursor-pointer',
        selected ? selectionBorder : `hover:border-[1px] border-gray-400`,
        notSelectable ? 'animate-wiggle' : ''
      )}
      style={{ aspectRatio: '3.5/5' }}
      onClick={() => {
        if (!isSelectable(data)) {
          setNotSelectable(true);
        } else {
          onClick(data);
        }
      }}
      onMouseEnter={() => setShowPlusIcon(true)}
      onMouseLeave={() => setShowPlusIcon(false)}
      onAnimationEnd={() => setNotSelectable(false)}
    >
      <div className="h-full flex flex-col text-2xl lg:text-sm">
        <div className="relative flex-1">
          {/* we can't overflow clip the whole card or the tooltips get clipped
              so we do this absolute image below the pillbadges */}
          <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-lg overflow-clip">
            <EZImage src={data?.image} className="hover:scale-110 transition-all" />
            {showPlusIcon && !selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full bg-gray-900')}>
                <HiPlusCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
            {selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full bg-gray-900')}>
                <HiCheckCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
          </div>
        </div>

        <div className={twMerge('mt-1 mb-1 px-2')}>
          {!isCollectionPage && (
            <div
              className="flex items-center space-x-1 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/collection/${data?.chainId}:${data?.address}`);
              }}
            >
              <div className={twMerge('truncate text-xs', hoverColorBrandText)}>{title}</div>
              {hasBlueCheck ? <BlueCheck className={'h-3 w-3'} /> : ''}
            </div>
          )}

          <div className="flex items-center text-xs mt-0.5">
            <div
              className="truncate hover:text-blue-500"
              onClick={(e) => {
                e.stopPropagation();
                const { pathname, query } = router;
                query['tokenId'] = basicTokenInfo.tokenId;
                query['collectionAddress'] = basicTokenInfo.collectionAddress;
                router.replace({ pathname, query }, undefined, { shallow: true });
              }}
            >
              {ellipsisString(tokenId)}
            </div>
          </div>

          <div className="flex mt-1 items-center justify-between">
            <div>
              {price ? (
                <div className="flex items-center rounded-sm space-x-1 text-sm">
                  <div className={twMerge('truncate font-medium', borderColor)}>{nFormatter(price, 2)}</div>
                  <div className="text-xs">{EthSymbol}</div>

                  <div className={twMerge('flex items-center space-x-1 rounded-md text-[10px]')}>
                    {showDeltaPrice && (
                      <div className={twMerge('truncate font-medium', borderColor)}> + {nFormatter(deltaPrice, 2)}</div>
                    )}
                  </div>

                  {data?.source?.icon && (
                    <div className={twMerge('flex items-center')}>
                      <EZImage src={data?.source?.icon} className="w-4 h-4 rounded-full" />
                    </div>
                  )}
                </div>
              ) : null}

              {lastSalePrice ? (
                <div className={twMerge('text-[10px] font-medium', secondaryTextColor)}>
                  Last {lastSalePrice} {EthSymbol}
                </div>
              ) : null}
            </div>

            <AButton
              className={twMerge('rounded-md text-xs', secondaryBtnBgColorText)}
              onClick={(e) => {
                e.stopPropagation();
                const { pathname, query } = router;
                query['tokenId'] = basicTokenInfo.tokenId;
                query['collectionAddress'] = basicTokenInfo.collectionAddress;
                router.replace({ pathname, query }, undefined, { shallow: true });
              }}
            >
              <HiOutlineLightBulb className="w-4 h-4" />
            </AButton>
          </div>
        </div>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} isNFTSelected={selected} />}
    </div>
  );
};

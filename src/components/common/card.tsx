import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { HiCheckCircle, HiPlusCircle } from 'react-icons/hi';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  secondaryBgColor,
  hoverColorBrandText,
  iconButtonStyle,
  selectionBorder,
  secondaryBtnBgColorText,
  secondaryTextColor
} from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from '../astra/astra-button';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { BlueCheck, EthSymbol, EZImage, Spacer } from '../common';

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
  const buyNowPrice = data?.orderSnippet?.listing?.orderItem?.startPriceEth
    ? data?.orderSnippet?.listing?.orderItem?.startPriceEth
    : '';
  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    chainId: data?.chainId ?? '',
    collectionFloorPrice,
    lastSalePriceEth: data?.lastSalePriceEth,
    mintPriceEth: data?.mintPriceEth,
    collectionCreator
  };

  const lastSalePrice = data?.lastSalePriceEth;

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
              <div className={twMerge('absolute top-2 right-2 rounded-full bg-gray-100')}>
                <HiPlusCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
            {selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full bg-gray-100')}>
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
                router.push(`/collection/${data?.collectionSlug}`);
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
              {tokenId}
            </div>
          </div>

          <div className="flex mt-1 items-center">
            <div>
              {buyNowPrice ? (
                <div className="flex items-center rounded-sm space-x-1 text-sm">
                  <div className={twMerge('truncate font-medium', borderColor)}>{buyNowPrice}</div>
                  <div className="text-xs">{EthSymbol}</div>
                </div>
              ) : null}

              {lastSalePrice ? (
                <div className={twMerge('text-[10px] font-medium', secondaryTextColor)}>
                  Last {lastSalePrice} {EthSymbol}
                </div>
              ) : null}
            </div>

            <Spacer />

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
              Details
            </AButton>
          </div>
        </div>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} isNFTSelected={selected} />}
    </div>
  );
};

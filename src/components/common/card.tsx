import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiOutlineCheckCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { BasicTokenInfo, ERC721TokenCartItem } from 'src/utils/types';
import {
  borderColor,
  brandTextColor,
  cardColor,
  hoverColorBrandText,
  iconButtonStyle,
  selectionBorder
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
}

export const GridCard = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
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
    chainId: data?.chainId ?? ''
  };
  const router = useRouter();
  const isCollectionPage = router.asPath.includes('/collection');

  return (
    <div
      className={twMerge(
        cardColor,
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
              <div className={twMerge('absolute top-2 right-2 rounded-full')}>
                <AiOutlinePlusCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
            {selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full')}>
                <AiOutlineCheckCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
          </div>
        </div>

        <div className={twMerge('mt-1 mb-3 px-2')}>
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
                setModalOpen(true);
              }}
            >
              {tokenId}
            </div>
          </div>

          <div className="flex items-center">
            {buyNowPrice && (
              <div className="flex items-center border-[1px] rounded-sm px-1.5 py-0.5 space-x-1 mt-1">
                <div className={twMerge('truncate font-medium text-md', borderColor)}>{buyNowPrice}</div>
                <div className="text-xs">{EthSymbol}</div>
              </div>
            )}
            <Spacer />
            <AButton primary className="rounded-md text-xs" onClick={() => setModalOpen(true)}>
              Details
            </AButton>
          </div>
        </div>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
    </div>
  );
};

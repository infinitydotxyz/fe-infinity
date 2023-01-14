import { useState } from 'react';
import { AiOutlineCheckCircle, AiOutlinePlusCircle } from 'react-icons/ai';
import { bgColor, brandTextColor, cardColor, iconButtonStyle, selectionBorder } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { AButton } from '../astra/astra-button';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';
import { BasicTokenInfo, Erc721TokenOffer } from '../astra/types';
import { BlueCheck, EthSymbol, EZImage, Spacer } from '../common';

interface Props {
  data: Erc721TokenOffer;
  selected: boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  onClick: (data: Erc721TokenOffer) => void;
}

export const GridCard = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [showPlusIcon, setShowPlusIcon] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;
  const buyNowPrice = data?.price ? data?.price.toString() + EthSymbol : '';
  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    chainId: data?.chainId ?? ''
  };

  return (
    <div
      className={twMerge(
        cardColor,
        'rounded-lg w-full relative flex flex-col shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] \
             hover:shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] cursor-pointer',
        selected ? selectionBorder : '',
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
            {selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full p-0.5', bgColor)}>
                <AiOutlineCheckCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
            {showPlusIcon && !selected && (
              <div className={twMerge('absolute top-2 right-2 rounded-full p-0.5', bgColor)}>
                <AiOutlinePlusCircle className={twMerge(iconButtonStyle, brandTextColor)} />
              </div>
            )}
          </div>
        </div>

        <div className={twMerge('mt-1 mb-3 px-2')}>
          <div className="flex items-center space-x-1">
            <div className="truncate text-xs">{title}</div>
            {hasBlueCheck ? <BlueCheck className={'h-3 w-3'} /> : ''}
          </div>

          <div className="flex items-center text-sm mt-0.5">
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

          <div className="flex items-center text-xs">
            <div className="truncate">{buyNowPrice}</div>
            <Spacer />
            <AButton primary className="rounded-md" onClick={() => setModalOpen(true)}>
              Details
            </AButton>
          </div>
        </div>
      </div>

      {modalOpen && <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />}
    </div>
  );
};

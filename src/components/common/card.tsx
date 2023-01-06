import { useState } from 'react';
import { cardColor, selectionOutline, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { EZImage, Spacer, SVG } from '../common';
import { AOutlineButton } from '../astra/astra-button';
import { BasicTokenInfo, Erc721TokenOffer } from '../astra/types';
import { TokenCardModal } from '../astra/token-grid/token-card-modal';

interface Props {
  data: Erc721TokenOffer;
  selected: boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  onClick: (data: Erc721TokenOffer) => void;
}

export const GridCard = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;
  const basicTokenInfo: BasicTokenInfo = {
    tokenId: data?.tokenId ?? '',
    collectionAddress: data?.address ?? '',
    chainId: data?.chainId ?? ''
  };

  return (
    <div
      className={twMerge(
        cardColor,
        'rounded-2xl w-full relative flex flex-col shadow-[0px_4px_10px_0px_rgba(0,0,0,0.12)] \
         hover:shadow-[0px_4px_10px_0px_rgba(0,0,0,0.2)] transition-all duration-100',
        selected ? selectionOutline : '',
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
      onAnimationEnd={() => setNotSelectable(false)}
    >
      <div className="h-full flex flex-col text-2xl lg:text-sm">
        <div className="relative flex-1">
          {/* we can't overflow clip the whole card or the tooltips get clipped
          so we do this absolute image below the pillbadges */}
          <div className="absolute top-0 bottom-0 left-0 right-0 rounded-t-2xl overflow-clip">
            <EZImage src={data?.image} className="hover:scale-110 transition-all" />
          </div>
        </div>

        <div className={twMerge(textColor, 'mt-3 mb-4 mx-3  ')}>
          <div className="flex items-center">
            <div className="font-bold truncate flex-1">{title}</div>
            {hasBlueCheck ? <SVG.blueCheck className={'h-5 w-5'} /> : ''}
          </div>

          <div className="flex items-center">
            <div className="truncate">Id: {tokenId}</div>
            <Spacer />
            <AOutlineButton small onClick={() => setModalOpen(true)}>
              Details
            </AOutlineButton>
          </div>
        </div>
      </div>

      <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

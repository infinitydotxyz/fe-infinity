import { cardClr, selectionOutline, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, EZImage, Spacer, SVG } from '../../common';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { TokenCardModal } from './token-card-modal';
import { AOutlineButton } from '../astra-button';

interface Props {
  data: ERC721CardData;
  selected: boolean;
  isSelectable: (data: ERC721CardData) => boolean;
  onClick: (data: ERC721CardData) => void;
}

export const TokenCard = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;

  return (
    <div
      className={twMerge(
        cardClr,
        'rounded-2xl w-full relative flex flex-col  shadow-[0_20px_20px_1px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_20px_1px_rgba(0,0,0,0.15)] transition-all duration-300',
        selected ? selectionOutline : '',
        notSelectable ? 'animate-wiggle' : ''
      )}
      style={{ aspectRatio: '4 / 5' }}
      onClick={() => {
        if (!isSelectable(data)) {
          // toastWarning('NFT rank is already revealed', 'Try another NFT');
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

        <div className={twMerge(textClr, 'mt-3 mb-4 mx-3  ')}>
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

      <TokenCardModal data={data} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

// ========================================================

export const TokenListCard = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  const [notSelectable, setNotSelectable] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const title = data?.title;
  const tokenId = data?.tokenId;
  const hasBlueCheck = data?.hasBlueCheck ?? false;

  return (
    <div
      className={twMerge(
        // cardClr,
        '  w-full relative flex flex-col  px-3 py-2  hover:bg-gray-100 transition-all duration-300',
        notSelectable ? 'animate-wiggle' : ''
      )}
      onClick={() => {
        if (!isSelectable(data)) {
          setNotSelectable(true);
        } else {
          onClick(data);
        }
      }}
      onAnimationEnd={() => setNotSelectable(false)}
    >
      <div className="h-full flex items-center  text-2xl lg:text-sm">
        <Checkbox
          label=""
          checked={selected}
          onChange={() => {
            // setChecked(isChecked);
          }}
        />

        <EZImage src={data?.image} className=" w-12 h-12 mr-4 rounded-lg overflow-clip" />

        <div className={textClr}>
          <div className="flex items-center">
            <div className=" text-sm truncate flex-1 mr-2">{title}</div>
            {hasBlueCheck ? <SVG.blueCheck className={'h-5 w-5'} /> : ''}
          </div>

          <div className="truncate text-lg font-bold">{tokenId}</div>
        </div>

        <Spacer />
        <AOutlineButton small onClick={() => setModalOpen(true)}>
          Details
        </AOutlineButton>
      </div>

      <TokenCardModal data={data} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

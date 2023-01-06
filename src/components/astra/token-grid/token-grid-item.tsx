import { useState } from 'react';
import { GridCard } from 'src/components/common/card';
import { hoverColor, textColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { Checkbox, EZImage, Spacer, SVG } from '../../common';
import { AOutlineButton } from '../astra-button';
import { BasicTokenInfo, Erc721TokenOffer } from '../types';
import { TokenCardModal } from './token-card-modal';

interface Props {
  data: Erc721TokenOffer;
  selected: boolean;
  isSelectable: (data: Erc721TokenOffer) => boolean;
  onClick: (data: Erc721TokenOffer) => void;
}

export const TokenGridItem = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
  return <GridCard data={data} onClick={onClick} selected={selected} isSelectable={isSelectable} />;
};

// ========================================================

export const TokenListItem = ({ data, onClick, selected, isSelectable }: Props): JSX.Element => {
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
        hoverColor,
        '  w-full relative flex flex-col  px-3 py-2 transition-all duration-200',
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

        <div className={textColor}>
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

      <TokenCardModal data={basicTokenInfo} modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </div>
  );
};

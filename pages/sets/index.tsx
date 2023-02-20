import { ChainId, SetsDataItem } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { GiBroom } from 'react-icons/gi';
import { MdOutlineRefresh } from 'react-icons/md';
import { ADropdown } from 'src/components/astra/astra-dropdown';
import { TokenGrid } from 'src/components/astra/token-grid/token-grid';
import { EthSymbol, Spacer, TextInputBox } from 'src/components/common';
import { apiGet } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { CartType, useCartContext } from 'src/utils/context/CartContext';
import { ERC721TokenCartItem } from 'src/utils/types';
import { borderColor, brandTextColor, hoverColor, secondaryBgColor, selectedColor } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { useNetwork } from 'wagmi';

export default function SetsPage() {
  const { chain } = useNetwork();
  const chainId = String(chain?.id ?? ChainId.Mainnet);
  const { isNFTSelected, isNFTSelectable, listMode, toggleNFTSelection, toggleMultipleNFTSelection } = useAppContext();
  const [tokens, setTokens] = useState<ERC721TokenCartItem[]>([]);
  const [tokensToShow, setTokensToShow] = useState<ERC721TokenCartItem[]>([]);
  const [numSweep, setNumSweep] = useState('');
  const [customSweep, setCustomSweep] = useState('');
  const { cartType, setCartType } = useCartContext();
  const priceRanges = ['0 - 0.5', '0.5 - 1', '1 - 2', '2 - 5', '5 - 10', '10 - 20', '20 - 50', '50 - 100', '100+'];
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[3]);
  const MAX_NUM_SWEEP_ITEMS = 15;

  setCartType(CartType.TokenOffer);

  const updateItemsToShow = (items?: ERC721TokenCartItem[]) => {
    // select 50 random items
    const data = items ?? tokens;
    const randomItems = data
      .map((a) => ({ sort: Math.random(), value: a }))
      .sort((a, b) => a.sort - b.sort)
      .map((a) => a.value);
    const itemsToShow = randomItems
      .slice(0, MAX_NUM_SWEEP_ITEMS)
      .sort((a, b) => (a.orderPriceEth ?? 0) - (b.orderPriceEth ?? 0));
    setTokensToShow(itemsToShow);
  };

  const fetchSets = async () => {
    let range = selectedPriceRange;
    if (range === '100+') {
      range = '100 - 10000';
    }
    const { result, error } = await apiGet(`/sets`, {
      query: {
        minPrice: selectedPriceRange.split(' - ')[0],
        maxPrice: selectedPriceRange.split(' - ')[1]
      }
    });

    if (error) {
      console.error(error);
      return;
    }

    const items: ERC721TokenCartItem[] = [];
    const data = result.data as SetsDataItem[];
    for (let i = 0; i < data.length; i++) {
      const collectionAddress = data[i].collectionAddress;
      const tokenId = data[i].tokenId;
      const item: ERC721TokenCartItem = {
        id: chainId + ':' + collectionAddress + ':' + tokenId,
        chainId: chainId,
        collectionName: data[i].collectionName,
        collectionSlug: data[i].collectionSlug,
        address: collectionAddress,
        tokenAddress: collectionAddress,
        tokenId,
        cartType,
        image: data[i].tokenImage,
        orderPriceEth: data[i].priceEth,
        lastSalePriceEth: data[i].lastPriceEth,
        hasBlueCheck: data[i].hasBlueCheck,
        title: data[i].collectionName,
        mintPriceEth: data[i].mintPriceEth
      };
      items.push(item);
    }

    setTokens(items);
    updateItemsToShow(items);
  };

  useEffect(() => {
    fetchSets();
  }, []);

  useEffect(() => {
    fetchSets();
  }, [selectedPriceRange]);

  useEffect(() => {
    const numToSelect = Math.min(tokensToShow.length, parseInt(numSweep), MAX_NUM_SWEEP_ITEMS);
    const cartItems: ERC721TokenCartItem[] = [];
    for (let i = 0; i < numToSelect; i++) {
      cartItems.push(tokensToShow[i]);
    }
    toggleMultipleNFTSelection(cartItems);
  }, [numSweep]);

  const onClickNFT = (token: ERC721TokenCartItem) => {
    toggleNFTSelection(token);
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden scrollbar-hide">
      <div className="text-sm px-3">
        <div className="font-heading font-bold text-3xl mt-4 px-4">Sets</div>

        <div className="flex items-center px-4 space-x-2">
          <div className="flex">
            Sets allow you to place bids on NFTs from multiple collections with a single readable bulk signature.
          </div>

          <Spacer />

          <div
            className={twMerge(secondaryBgColor, 'p-2 rounded-lg cursor-pointer', hoverColor)}
            onClick={() => {
              updateItemsToShow();
            }}
          >
            <MdOutlineRefresh className={'h-6 w-6'} />
          </div>

          <ADropdown
            hasBorder={true}
            alignMenuRight
            innerClassName="w-[150px]"
            menuItemClassName="py-3"
            label={EthSymbol + ' ' + selectedPriceRange}
            items={priceRanges.map((range) => ({
              label: EthSymbol + ' ' + range,
              onClick: () => setSelectedPriceRange(range)
            }))}
          />

          <div className={twMerge('flex flex-row rounded-lg border cursor-pointer items-center', borderColor)}>
            <div className={twMerge('flex items-center border-r-[1px] py-2.5 px-5 cursor-default', borderColor)}>
              <GiBroom className={twMerge('h-5 w-5', brandTextColor)} />
            </div>
            <div
              className={twMerge(
                'py-2.5 px-5 h-full flex items-center border-r-[1px]',
                borderColor,
                hoverColor,
                numSweep === '5' && selectedColor
              )}
              onClick={() => {
                numSweep === '5' ? setNumSweep('') : setNumSweep('5');
              }}
            >
              5
            </div>
            <div
              className={twMerge(
                'py-2.5 px-5 h-full flex items-center border-r-[1px]',
                borderColor,
                hoverColor,
                numSweep === '10' && selectedColor
              )}
              onClick={() => {
                numSweep === '10' ? setNumSweep('') : setNumSweep('10');
              }}
            >
              10
            </div>
            <div
              className={twMerge(
                'py-2.5 px-5 h-full flex items-center border-r-[1px]',
                borderColor,
                hoverColor,
                numSweep === '15' && selectedColor
              )}
              onClick={() => {
                numSweep === '15' ? setNumSweep('') : setNumSweep('15');
              }}
            >
              15
            </div>
            {/* 
            <div
              className={twMerge(
                'py-2.5 px-5 h-full flex items-center border-r-[1px]',
                borderColor,
                hoverColor,
                numSweep === '50' && selectedColor
              )}
              onClick={() => {
                numSweep === '50' ? setNumSweep('') : setNumSweep('50');
              }}
            >
              50
            </div> */}
            <div className="py-2.5 px-5 h-full flex items-center">
              <TextInputBox
                autoFocus={true}
                inputClassName="text-sm"
                className="border-0 w-14 p-0 text-sm"
                type="number"
                placeholder="Custom"
                value={customSweep}
                onChange={(value) => {
                  setNumSweep(value);
                  setCustomSweep(value);
                }}
              />
            </div>
          </div>
        </div>

        <div className={twMerge('flex w-full')}>
          <TokenGrid
            listMode={listMode}
            className={twMerge('px-4 py-4 min-h-[600px]')} // this min-height is to prevent the grid from collapsing when there are no items so filter menus can still render
            onClick={onClickNFT}
            isSelectable={isNFTSelectable}
            isSelected={isNFTSelected}
            data={tokensToShow}
            hasNextPage={false}
          />
        </div>
      </div>
    </div>
  );
}

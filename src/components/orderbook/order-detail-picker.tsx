import { OBOrderItem, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import React from 'react';
import { BlueCheck, EZImage, NextLink, Spacer } from 'src/components/common';
import { ENS_ADDRESS } from 'src/utils';
import { twMerge } from 'tailwind-merge';

export const orderDetailKey = (collectionAddress: string, tokenId: string): string => {
  return `${collectionAddress}:${tokenId}`;
};

interface Props2 {
  order: SignedOBOrder;
  selection?: Set<string>;
  onChange?: (selection: Set<string>) => void;
  scroll?: boolean;
  className?: string;
}

export const OrderDetailPicker = ({ selection, onChange, order, scroll = false, className }: Props2) => {
  const showCheckbox = onChange !== undefined && selection !== undefined;

  const _contents = (nft: OBOrderItem) => {
    // just show collection if no tokens
    if (nft.tokens.length === 0) {
      return (
        <NextLink href={`/collection/${nft.collectionSlug}`} className="pointer-events-auto flex items-center">
          <EZImage src={nft.collectionImage} className="w-14 h-14 shrink-0 overflow-clip rounded-lg" />

          <div className="ml-4 flex-col">
            <div className="flex flex-row">
              <div className="w-44 flex items-center dark:text-dark-body text-light-body font-body">
                <div className="truncate">{nft.collectionName}</div>
                {nft.hasBlueCheck && <BlueCheck className="ml-1.5" />}
              </div>
            </div>
            <div className="select-none">Collection</div>
          </div>
        </NextLink>
      );
    }

    return nft.tokens.map((token) => {
      const key = orderDetailKey(nft.collectionAddress, token.tokenId);

      let tokenId = token.tokenName || token.tokenId ? `#${token.tokenId}` : '';
      // special case for ENS
      const collectionAddress = trimLowerCase(nft.collectionAddress ?? '');
      if (
        collectionAddress === ENS_ADDRESS &&
        token?.tokenName &&
        !trimLowerCase(token.tokenName).includes('unknown ens name')
      ) {
        tokenId = token.tokenName;
      }

      return (
        <div
          key={key}
          className="flex items-center"
          onClick={() => {
            if (showCheckbox) {
              const sel = new Set<string>(selection);

              if (sel.has(key)) {
                sel.delete(key);
              } else {
                sel.add(key);
              }

              // limit selection
              if (sel.size > order.numItems) {
                // remove any but last key
                sel.forEach((element) => {
                  if (sel.size > order.numItems) {
                    if (element !== key) {
                      sel.delete(element);
                    }
                  }
                });
              }

              onChange(sel);
            }
          }}
        >
          <NextLink
            href={`/asset/${nft.chainId}/${nft.collectionAddress}/${token.tokenId}`}
            className="pointer-events-auto flex items-center"
          >
            <EZImage
              src={token.tokenImage || nft.collectionImage}
              className="w-14 h-14 shrink-0 overflow-clip rounded-lg"
            />
            <div className="ml-4 flex flex-col">
              <div className="w-44 flex items-center dark:text-dark-body text-light-body font-body">
                <div className="truncate">{nft.collectionName}</div>
                {nft.hasBlueCheck && <BlueCheck className="ml-1.5" />}
              </div>

              <div className="select-none flex  truncate">{tokenId}</div>
            </div>
          </NextLink>

          {showCheckbox && (
            <>
              <Spacer />
              <input
                type="checkbox"
                disabled={false}
                checked={selection.has(key)}
                onChange={() => false}
                // NOTE: "focus-visible:ring focus:ring-0" shows the focus ring on tab, but not click
                className="focus-visible:ring focus:ring-0 rounded h-6 w-6 cursor-pointer checked:bg-dark-bg checked:hover:bg-dark-bg checked:focus:bg-dark-bg"
              />
            </>
          )}
        </div>
      );
    });
  };

  return (
    <div className={twMerge('flex flex-col min-h-0', className)}>
      <div>
        Any {order.numItems} {order.numItems > 1 ? 'items' : 'item'} can be{' '}
        {order.isSellOrder ? 'bought' : 'sold (if you own enough)'} for the given price.
      </div>

      {showCheckbox && (
        <div className="mt-1">
          Select {order.numItems} {order.numItems > 1 ? 'items' : 'item'} and click Add to Cart.
        </div>
      )}

      <div className={twMerge('mt-4 space-y-3 flex-1', scroll ? 'overflow-y-auto overflow-x-clip' : '')}>
        {(order?.nfts || []).map((nft, idx) => {
          return (
            <div className="space-y-3" key={`${nft.collectionAddress}_${idx}`}>
              {_contents(nft)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

import { SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import React from 'react';
import { EZImage, Spacer } from 'src/components/common';

const selectionKey = (collectionAddress: string, tokenId: string): string => {
  return `${collectionAddress}:${tokenId}`;
};

interface Props2 {
  order: SignedOBOrder;
  selection?: Set<string>;
  onChange?: (selection: Set<string>) => void;
}

export const OrderDetailPicker = ({ selection, onChange, order }: Props2) => {
  const showCheckbox = onChange !== undefined && selection !== undefined;

  return (
    <div>
      <div className="text-gray-500">
        Any {order.numItems} {order.numItems > 1 ? 'items' : 'item'} can be{' '}
        {order.isSellOrder ? 'bought' : 'sold (if you own enough)'} for the given price.
      </div>

      <div className="my-8">
        {(order?.nfts || []).map((nft, idx) => {
          return (
            <div key={`${nft.collectionAddress}_${idx}`} className="space-y-4 mt-4">
              {nft.tokens.map((token) => {
                const key = selectionKey(nft.collectionAddress, token.tokenId);

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
                    <EZImage
                      src={token.tokenImage || nft.collectionImage}
                      className="w-16 h-16 overflow-clip rounded-2xl"
                    />
                    <div className="ml-4">
                      <div className="select-none">{nft.collectionName}</div>
                      <div className="select-none flex text-gray-500">
                        {token.tokenName || token.tokenId ? `#${token.tokenId}` : ''}
                      </div>
                    </div>

                    {showCheckbox && (
                      <>
                        <Spacer />
                        <input
                          type="checkbox"
                          disabled={false}
                          checked={selection.has(key)}
                          onChange={() => false}
                          // NOTE: "focus-visible:ring focus:ring-0" shows the focus ring on tab, but not click
                          className="focus-visible:ring focus:ring-0 rounded h-6 w-6 border-gray-300 cursor-pointer checked:bg-black checked:hover:bg-black checked:focus:bg-black"
                        />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

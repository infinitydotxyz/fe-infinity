import { getAddress } from '@ethersproject/address';
import { ChainNFTs, ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { trimLowerCase } from '@infinityxyz/lib-frontend/utils';
import { useState } from 'react';
import { Button, Divider, EZImage, Spacer, SVG, TextInputBox, toastError, toastWarning } from 'src/components/common';
import { extractErrorMsg } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { sendMultipleNfts } from 'src/utils/exchange/orders';
import { drawerPx, iconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
// import { iconButtonStyle } from 'src/utils/ui-constants';
// import { format } from 'timeago.js';
import { Drawer } from '../../common/drawer';
// import { OrderbookItem } from '../orderbook-list/orderbook-item';

interface Props {
  open: boolean;
  onClose: () => void;
  nftsForTransfer: ERC721CardData[];
  onClickRemove: (item: ERC721CardData) => void;
  onSubmit: (txHash: string) => void;
}

export const SendNFTsDrawer = ({ open, onClose, nftsForTransfer, onClickRemove, onSubmit }: Props) => {
  const [address, setAddress] = useState('');
  const { providerManager, chainId } = useAppContext();

  const getFinalToAddress = async (addr: string) => {
    let finalAddress: string | null = addr;
    if (addr.endsWith('.eth') && providerManager) {
      const provider = providerManager.getEthersProvider();
      finalAddress = await provider.resolveName(addr);
    }
    if (finalAddress) {
      return getAddress(finalAddress);
    }
  };

  const sendNft = async () => {
    const orderItems: ChainNFTs[] = [];
    const collectionToTokenMap: { [collection: string]: { tokenId: string; numTokens: number }[] } = {};

    // group tokens by collections
    for (const nftToTransfer of nftsForTransfer) {
      const collection = trimLowerCase(nftToTransfer.address);
      const tokenId = nftToTransfer.tokenId;
      if (!collection || !tokenId) {
        continue;
      }
      const numTokens = 1;
      const tokens = collectionToTokenMap[collection] ?? [];
      tokens.push({ tokenId, numTokens });
      collectionToTokenMap[collection] = tokens;
    }

    // add to orderItems
    for (const item in collectionToTokenMap) {
      const tokens = collectionToTokenMap[item];
      orderItems.push({
        collection: item,
        tokens
      });
    }

    try {
      const toAddress = await getFinalToAddress(address);
      if (toAddress) {
        const signer = providerManager?.getEthersProvider().getSigner();
        if (signer) {
          const result = await sendMultipleNfts(signer, chainId, orderItems, toAddress);
          if (result.hash) {
            onSubmit(result.hash);
          }
        } else {
          console.error('signer is null');
        }
      } else {
        toastWarning('Destination address is blank');
      }
    } catch (err) {
      toastError(extractErrorMsg(err), () => {
        alert(err);
      });
    }
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        subtitle={'Batch send NFTs'}
        title={<div className="flex items-center">Send</div>}
      >
        <div className="flex flex-col h-full">
          <ul className={twMerge(drawerPx, 'overflow-y-auto content-between')}>
            {nftsForTransfer.map((cardData: ERC721CardData) => {
              return (
                <li key={cardData.id} className="py-3 flex">
                  <div className="w-full flex">
                    <div>
                      <EZImage src={cardData.image} className="w-16 h-16 rounded-2xl overflow-clip" />
                    </div>
                    <div className="flex-1 truncate m-2">
                      <div className="font-bold">{cardData.collectionName}</div>
                      <div>{cardData.tokenId}</div>
                    </div>
                    <button onClick={() => onClickRemove(cardData)}>
                      <SVG.grayDelete className={iconButtonStyle} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="p-8">
            <TextInputBox
              type="text"
              value={address}
              placeholder=""
              label={'Address or ENS Name'}
              onChange={(value) => setAddress(value)}
            />
          </div>
          <Spacer />

          <footer className="w-full text-center py-4">
            <Divider className="mb-10" />

            <Button size="large" className="w-1/2" disabled={nftsForTransfer?.length < 1} onClick={sendNft}>
              Send
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};

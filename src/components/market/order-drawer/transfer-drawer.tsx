import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Button, NftImage, Spacer, SVG, TextInputBox } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { iconButtonStyle } from 'src/utils/ui-constants';
// import { iconButtonStyle } from 'src/utils/ui-constants';
// import { format } from 'timeago.js';
import { Drawer } from '../../common/drawer';
// import { OrderbookItem } from '../orderbook-list/orderbook-item';

interface Props {
  open: boolean;
  onClose: () => void;
  nftsForTransfer: ERC721CardData[];
  onClickRemove: (item: ERC721CardData) => void;
}

export const TransferDrawer = ({ open, onClose, nftsForTransfer, onClickRemove }: Props) => {
  const [address, setAddress] = useState('');
  const { providerManager } = useAppContext();

  const ensToAddress = async (addr: string) => {
    let finalAddress: string | null = '';
    if (addr.endsWith('.eth') && providerManager) {
      const provider = providerManager.getEthersProvider();
      finalAddress = await provider.resolveName(addr);
    }
    return finalAddress;
  };

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        subtitle={'Selected NFTs for transferring:'}
        title={<div className="flex items-center">Transfer</div>}
      >
        <div className="flex flex-col h-full">
          <ul className="overflow-y-auto content-between px-12">
            {nftsForTransfer.map((cardData: ERC721CardData) => {
              return (
                <li key={cardData.id} className="py-3 flex">
                  <div className="w-full flex">
                    <div>
                      <NftImage
                        chainId={cardData.chainId ?? ''}
                        collectionAddress={cardData.address ?? ''}
                        className="w-24 h-24"
                      />
                    </div>
                    <div className="flex-1 truncate">
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
              value={''}
              placeholder=""
              addEthSymbol={true}
              label={'Address or ENSName'}
              onChange={(value) => setAddress(value)}
            />
          </div>
          <Spacer />

          <footer className="w-full text-center py-4">
            <Button
              size="large"
              onClick={async () => {
                // todo: adi: Smart contract Transfer integration.
                console.log('nftsForTransfer', nftsForTransfer);
                const finalAddress = await ensToAddress(address);
                console.log('finalAddress', finalAddress);
              }}
            >
              Transfer
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};

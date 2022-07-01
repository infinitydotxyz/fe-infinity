import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import { Button, Spacer, SVG, TextInputBox } from 'src/components/common';
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
        subtitle={'Selected NFTs for sending:'}
        title={<div className="flex items-center">Send</div>}
      >
        <div className="flex flex-col h-full">
          <ul className="overflow-y-auto content-between px-12">
            {nftsForTransfer.map((cardData: ERC721CardData) => {
              return (
                <li key={cardData.id} className="py-3 flex">
                  <div className="w-full flex">
                    <div>
                      <img src={cardData.image} className="w-16 h-16 rounded-2xl" />
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
            <Button
              size="large"
              className="w-1/2"
              disabled={nftsForTransfer?.length < 1}
              onClick={async () => {
                // todo: adi: Smart contract Transfer integration.
                console.log('nftsForTransfer', nftsForTransfer);
                const finalAddress = await ensToAddress(address);
                console.log('finalAddress', finalAddress);
              }}
            >
              Send
            </Button>
          </footer>
        </div>
      </Drawer>
    </>
  );
};

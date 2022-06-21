import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { Modal, TextInputBox } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const TransferNFTModal = ({ isOpen, onClose, collection, token }: Props) => {
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
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        okButton="Transfer"
        title="Transfer NFT"
        onOKButton={async () => {
          console.log(collection);
          console.log(token);

          const finalAddress = await ensToAddress(address);
          console.log('finalAddress', finalAddress);
          onClose(); // todo: adi: Smart contract Transfer integration.
        }}
      >
        <div>
          <TextInputBox
            autoFocus={true}
            type="text"
            value={address}
            label="Address or ENSName"
            placeholder=""
            onChange={async (value) => {
              setAddress(value);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

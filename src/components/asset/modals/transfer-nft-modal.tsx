import { Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { Modal, TextInputBox } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';

interface Props {
  isOpen: boolean;
  token: Token;
  onClose: () => void;
}

export const SendNFTModal = ({ isOpen, onClose, token }: Props) => {
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
        okButton="Send"
        title="Send NFT"
        onOKButton={async () => {
          console.log(token);

          const finalAddress = await ensToAddress(address);
          console.log('finalAddress', finalAddress);
          onClose(); // todo: adi: Smart contract integration for Sending NFT.
        }}
      >
        <div>
          <TextInputBox
            autoFocus={true}
            type="text"
            value={address}
            label="Address or ENS Name"
            placeholder=""
            onChange={(value) => {
              setAddress(value);
            }}
          />
        </div>
      </Modal>
    </div>
  );
};

import { Collection, Token } from '@infinityxyz/lib/types/core';
import React, { useState } from 'react';
import { Modal, TextInputBox } from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const TransferNFTModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [address, setAddress] = useState('');

  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        okButton="Transfer"
        title="Transfer NFT"
        onOKButton={() => {
          console.log(collection);
          console.log(token);
        }}
      >
        <div>
          <TextInputBox
            autoFocus={true}
            type="text"
            value={address}
            label="Address or ENSName"
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

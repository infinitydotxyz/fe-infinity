import React, { useState } from 'react';
import { Button, SimpleModal, TextInputBox } from '../common';

export const TransferNFTModal: React.FC = () => {
  const [address, setAddress] = useState('');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Transfer NFT</button>
      <SimpleModal isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-12">Transfer NFT</p>
          <TextInputBox
            type="text"
            value={address}
            label="Address or ENSName"
            placeholder=""
            onChange={(value) => {
              setAddress(value as string);
            }}
          />
          <div className="flex mt-12">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              Transfer
            </Button>
            <Button className="flex-1 rounded-full" size="large" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};

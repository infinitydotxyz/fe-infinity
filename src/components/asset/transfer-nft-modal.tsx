import React, { useState } from 'react';
import { Modal } from 'src/components/common/modal';
import { Button } from '../common';
import { TextInput } from 'src/components/common/text-input';

const TransferNFTModal: React.FC = () => {
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
      <Modal isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
        <div className="modal-body p-4 lg:p-12 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-5">Transfer NFT</p>
          <TextInput
            type="address"
            value={address}
            label="Address or ENSName"
            placeholder=""
            onChange={(value) => {
              setAddress(value);
            }}
          />
          <div className="flex mt-8">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              Transfer
            </Button>
            <Button className="flex-1 rounded-full" size="large" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TransferNFTModal;

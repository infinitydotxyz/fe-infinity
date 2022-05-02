import React, { useState } from 'react';
import { Modal, TextInputBox } from 'src/components/common';

export const TransferNFTModal: React.FC = () => {
  const [address, setAddress] = useState('');
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Transfer NFT</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} okButton="Transfer">
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-12">Transfer NFT</p>
          <TextInputBox
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

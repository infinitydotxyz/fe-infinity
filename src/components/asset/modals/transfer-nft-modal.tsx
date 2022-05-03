import React, { useState } from 'react';
import { Modal, TextInputBox } from 'src/components/common';

export const TransferNFTModal = () => {
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
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        okButton="Transfer"
        title="Transfer NFT"
        onOKButton={() => console.log('hello')}
      >
        <div>
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

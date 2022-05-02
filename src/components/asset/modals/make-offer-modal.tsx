import React, { useState } from 'react';
import { Button, Modal, CurrencyInput } from 'src/components/common';

export const MakeOfferModal: React.FC = () => {
  const [price, setPrice] = useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Make offer</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal}>
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-12">Make offer</p>
          <p className="mb-4 text-base">Buy this NFT for the price shown</p>
          <div>
            <CurrencyInput
              value={price}
              label="Enter offer"
              placeholder=""
              onChange={(value) => {
                setPrice(parseFloat(value));
              }}
            />
          </div>
          <div className="mt-4">{/* <DatePickerBox placeholder="Expiry date" label="label" /> */}</div>
          <div className="flex">
            <Button className="flex-1 mr-4 mt-12 rounded-full text-heading" size="large">
              Make an offer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

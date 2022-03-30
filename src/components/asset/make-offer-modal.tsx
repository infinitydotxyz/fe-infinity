import React, { useState } from 'react';
import Modal from 'src/components/common/modal';
import Link from 'next/link';
import { Button, DateInput, CurrencyInput } from '../common';

const MakeOfferModal: React.FC = () => {
  const [price, setPrice] = useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Make offer</button>
      <Modal isOpen={modalIsOpen} closeModal={closeModal}>
        <div className="modal-body p-4 lg:p-12 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-8">Make offer</p>
          <p className="mt-12 mb-4 text-base">Buy this NFT for the price shown</p>
          <div>
            <CurrencyInput
              type="number"
              value={price}
              label="Enter offer"
              placeholder=""
              onChange={(value) => {
                setPrice(value as number);
              }}
            />
          </div>
          <div className="mt-6">
            <DateInput placeholder="Expiry date" />
          </div>
          <div className="flex">
            <Button className="flex-1 mr-4 mt-10 rounded-full text-heading" size="large">
              Make an offer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MakeOfferModal;

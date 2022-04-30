import React, { useState } from 'react';
import { Button, SimpleModal, CurrencyInput, NextLink } from 'src/components/common';

export const PlaceBidModal: React.FC = () => {
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
      <button onClick={openModal}>Place a bid</button>
      <SimpleModal isOpen={modalIsOpen} onClose={closeModal} showActionButtons={false}>
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-12">Place a bid</p>
          <CurrencyInput
            value={price}
            label="Enter offer"
            placeholder=""
            onChange={(value) => {
              setPrice(parseFloat(value));
            }}
          />
          <div className="mt-6 flex">
            <div className="flex items-center">
              <input type="checkbox" className="border-gray-300 text-black focus:outline-none rounded h-5 w-5" />
            </div>
            <div className="ml-3">
              <span className="text-theme-light-800">{"By checking this box, you agree to Infinity's"}</span>
              <div className="underline">
                <NextLink href="/terms-of-service">Terms of Service</NextLink>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-12">
            <Button className="flex-1 mr-4 text-heading rounded-full" size="large">
              Place bid
            </Button>
            <Button className="flex-1 text-heading rounded-full" size="large" variant="outline">
              Convert ETH
            </Button>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
};

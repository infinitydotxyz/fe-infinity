import React, { useState } from 'react';
import Link from 'next/link';
import { Button, CurrencyInput } from 'src/components/common';
import { Modal } from 'src/components/asset/modal';

export const PlaceBidModal: React.FC = () => {
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
      <button onClick={openModal}>Place a bid</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
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
                <Link href="/terms-of-service">Terms of Service</Link>
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
      </Modal>
    </div>
  );
};

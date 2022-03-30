import React, { useState } from 'react';
import { Modal } from 'src/components/common/modal';
import Link from 'next/link';
import { Button, CurrencyInput } from '../common';

const PlaceBidModal: React.FC = () => {
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
        <div className="modal-body p-4 lg:p-12 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-8">Place a bid</p>
          <CurrencyInput
            type="number"
            value={price}
            label="Enter offer"
            placeholder=""
            onChange={(value) => {
              setPrice(value as number);
            }}
          />
          <div className="my-8 flex">
            <div className="flex items-center">
              <input type="checkbox" className="border-gray-300 text-black focus:outline-none rounded h-5 w-5" />
            </div>
            <div className="ml-3">
              <span className="text-gray-600">{"By checking this box, you agree to Infinity's"}</span>
              <div className="underline">
                <Link href="/terms-of-service">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 my-4 lg:my-8">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              Place bid
            </Button>
            <Button className="flex-1 rounded-full" size="large" variant="outline">
              Convert ETH
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PlaceBidModal;

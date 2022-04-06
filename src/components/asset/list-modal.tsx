import React, { useState } from 'react';
import { Button, Toggle, TextInputBox, SimpleModal } from 'src/components/common';

export const ListModal: React.FC = () => {
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
      <button onClick={openModal}>List</button>
      <SimpleModal isOpen={modalIsOpen} onClose={closeModal} hideActionButtons={false}>
        <div className="modal-body p-4 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight mb-5">List NFT</p>
          {/* <ToggleTab className="mt-5" /> */}
          <p className="mt-12 mb-4 text-base">Sell at a fixed or declining price.</p>
          <TextInputBox
            type="number"
            value={price.toString()}
            label="Price"
            placeholder=""
            onChange={(value) => {
              setPrice(Number(value));
            }}
          />
          <div className="flex mt-12">
            <p className="flex-1 text-body">Fee</p>
            <p className="text-heading font-black">2%</p>
          </div>
          <div className="flex mt-2 mb-12">
            <p className="flex-1 text-body">Royalty</p>
            <p className="text-heading font-black">5%</p>
          </div>
          <Toggle title="Include ending price" className="mb-12" />
          <div className="flex">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              List
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

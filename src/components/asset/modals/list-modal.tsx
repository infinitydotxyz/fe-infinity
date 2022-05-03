import React, { useState } from 'react';
import { Switch, TextInputBox, Modal } from 'src/components/common';

export const ListModal = () => {
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
      <button onClick={openModal}>List</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} okButton="List" onOKButton={() => console.log('hello')}>
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
        <Switch title="Include ending price" className="mb-12" />
      </Modal>
    </div>
  );
};

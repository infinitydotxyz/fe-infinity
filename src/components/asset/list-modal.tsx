import React, { useState } from 'react';
import Modal from 'src/components/common/modal';
import { Button } from '../common';
import { ToggleSwitchButton } from 'src/components/asset/toggle-switch-button';
import { TextInput } from 'src/components/common/text-input';
import Toggle from '../common/toggle';

const ListModal: React.FC = () => {
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
      <Modal isOpen={modalIsOpen} closeModal={closeModal}>
        <div className="modal-body p-4 lg:p-12 rounded-3xl">
          <p className="font-bold text-2xl tracking-tight">List NFT</p>
          <ToggleSwitchButton className="mt-5" />
          <p className="mt-12 mb-4 text-base">Sell at a fixed or declining price.</p>
          <TextInput
            type="number"
            value={price}
            label="Price"
            placeholder=""
            onChange={(value) => {
              setPrice(value as number);
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
          <Toggle title="Include ending price" />
          <div className="flex">
            <Button className="flex-1 mr-4 rounded-full" size="large">
              List
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

export default ListModal;

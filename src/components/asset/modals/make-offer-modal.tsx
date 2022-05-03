import React, { useState } from 'react';
import { Modal, CurrencyInput, DatePickerBox } from 'src/components/common';

export const MakeOfferModal = () => {
  const [price, setPrice] = useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [expirationDate, setExpirationDate] = useState(Date.now() + 1000);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Make offer</button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} okButton="Make offer" onOKButton={() => console.log('hello')}>
        <div className="modal-body p-4 rounded-3xl">
          <div className="font-bold text-2xl tracking-tight mb-12">Make offer</div>
          <div className="mb-4 text-base">Buy this NFT for the price shown</div>
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
          <div className="mt-4">
            <DatePickerBox
              placeholder="Expiry date"
              label="Expiry date"
              value={new Date(parseInt(expirationDate.toString()))}
              onChange={(date) => {
                setExpirationDate(date.getTime() / 1000);
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

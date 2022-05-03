import { Collection, Token } from '@infinityxyz/lib/types/core';
import React, { useState } from 'react';
import { Modal, CurrencyInput, DatePickerBox } from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const MakeOfferModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [price, setPrice] = useState(0);
  const [expirationDate, setExpirationDate] = useState(Date.now() + 1000);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="Make offer"
      title="Make offer"
      onOKButton={() => {
        console.log(collection);
        console.log(token);
      }}
    >
      <div>
        <div className="mb-4">Buy this NFT for the price shown</div>
        <div>
          <CurrencyInput
            autoFocus={true}
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
  );
};

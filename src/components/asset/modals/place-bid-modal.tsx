import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { Modal, CurrencyInput, NextLink, Checkbox } from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const PlaceBidModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [price, setPrice] = useState(0);
  const [termsChecked, setTermsChecked] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="Place bid"
      disableOK={!termsChecked}
      disableCancel={!termsChecked}
      cancelButton="Convert ETH"
      onOKButton={() => {
        console.log('Place bid');

        console.log(collection);
        console.log(token);
      }}
      onCancelButton={() => console.log('Convert ETH')}
      title="Place a bid"
    >
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
        <div className="mt-6 flex">
          <Checkbox
            checked={termsChecked}
            onChange={setTermsChecked}
            label={
              <>
                <span className="text-theme-light-800">{"By checking this box, you agree to Infinity's"}</span>
                <NextLink href="/terms" className="ml-2 underline">
                  Terms of Service
                </NextLink>
              </>
            }
          />
        </div>
      </div>
    </Modal>
  );
};

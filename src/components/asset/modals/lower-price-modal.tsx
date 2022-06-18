import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import { TextInputBox, Modal, SimpleTable, SimpleTableItem } from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const LowerPriceModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [price, setPrice] = useState(0);
  // TODO: do something with this ending price?

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({ title: 'Fee', value: <div className="font-bold">2.5%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-bold">0%</div> });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="Lower Price"
      title="Lower Price"
      onOKButton={() => {
        console.log(collection);
        console.log(token);
        alert('todo: Relist modal');
        onClose();
      }}
    >
      <p className="mb-4">Price</p>
      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price.toString()}
        label="Price"
        placeholder=""
        onChange={(value) => {
          setPrice(Number(value));
        }}
      />
      <SimpleTable className="my-6" items={tableItems} />
    </Modal>
  );
};

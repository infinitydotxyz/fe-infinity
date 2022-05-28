import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useState } from 'react';
import {
  Switch,
  TextInputBox,
  Modal,
  useToggleTab,
  ToggleTab,
  SimpleTable,
  SimpleTableItem
} from 'src/components/common';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  onClose: () => void;
}

export const ListNFTModal = ({ isOpen, onClose, collection, token }: Props) => {
  const [price, setPrice] = useState(0);
  // TODO: do something with this ending price?
  const [includeEndingPrice, setIncludeEndingPrice] = useState<boolean>(false);
  const { options, onChange, selected } = useToggleTab(['Set Price', 'Highest bid'], 'Set Price');

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({ title: 'Fee', value: <div className="font-bold">2%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-bold">5%</div> });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="List"
      title="List NFT"
      onOKButton={() => {
        console.log(collection);
        console.log(token);
      }}
    >
      <ToggleTab options={options} selected={selected} onChange={onChange} className="mb-6" />

      {selected === 'Set Price' && (
        <>
          <p className="mb-4">Sell at a fixed or declining price.</p>
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

          <Switch
            title="Include ending price"
            checked={includeEndingPrice}
            onChange={() => setIncludeEndingPrice(!includeEndingPrice)}
          />
        </>
      )}
    </Modal>
  );
};

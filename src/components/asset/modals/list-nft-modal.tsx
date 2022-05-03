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

export const ListNFTModal = () => {
  const [price, setPrice] = useState(0);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const { options, onChange, selected } = useToggleTab(['Set Price', 'Highest bid'], 'Set Price');

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({ title: 'Fee', value: <div className="font-bold">2%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-bold">5%</div> });

  return (
    <div>
      <button onClick={openModal}>List</button>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        okButton="List"
        title="List NFT"
        onOKButton={() => console.log('hello')}
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

            <Switch title="Include ending price" />
          </>
        )}
      </Modal>
    </div>
  );
};

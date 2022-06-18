import { Collection, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { TextInputBox, Modal, SimpleTable, SimpleTableItem, EthPrice } from 'src/components/common';
import { INFINITY_FEE_PCT, INFINITY_ROYALTY_PCT } from 'src/utils';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  buyPriceEth?: string;
  onClose: () => void;
}

export const LowerPriceModal = ({ isOpen, onClose, collection, token, buyPriceEth }: Props) => {
  // const { user } = useAppContext();
  const [price, setPrice] = useState(0);
  // const [lastPrice, setLastPrice] = useState(0);
  // TODO: do something with this ending price?

  // const orderItem = token.ordersSnippet?.listing?.orderItem;
  // const fetchSignedOBOrder = async () => {
  //   const { result, error } = await apiGet(`/orders/${user?.address}`, {
  //     requiresAuth: true,
  //     query: {
  //       id: orderItem?.id,
  //       limit: 1
  //     }
  //   });
  //   if (!error && result?.data && result?.data[0]) {
  //     const signedOrder = result?.data[0].signedOrder as SignedOBOrder;
  //     const lastPrice = await getCurrentChainOBOrderPrice(signedOrder);
  //     console.log('signedOrder', signedOrder);
  //   }
  // };

  useEffect(() => {
    // fetchSignedOBOrder();
  }, []);

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({
    title: 'Current price',
    value: (
      <div className="font-bold">
        <EthPrice label={buyPriceEth ?? ''} />
      </div>
    )
  });
  tableItems.push({ title: 'Fee', value: <div className="font-bold">{INFINITY_FEE_PCT}%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-bold">{INFINITY_ROYALTY_PCT}%</div> });

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
      <SimpleTable className="my-3" items={tableItems} />
      <p className="mb-4">New Price</p>
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
    </Modal>
  );
};

import { Collection, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { TextInputBox, Modal, SimpleTable, SimpleTableItem, EthPrice, toastError } from 'src/components/common';
import { apiGet, BLANK_IMAGE_URL, INFINITY_FEE_PCT, INFINITY_ROYALTY_PCT } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { postOrders } from 'src/utils/marketUtils';

interface Props {
  isOpen: boolean;
  collection: Collection;
  token: Token;
  buyPriceEth?: string;
  onClose: () => void;
}

export const LowerPriceModal = ({ isOpen, onClose, collection, token, buyPriceEth }: Props) => {
  const { user } = useAppContext();
  const [orderDetails, setOrderDetails] = useState<SignedOBOrder | null>(null);
  const [price, setPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  // const [lastPrice, setLastPrice] = useState(0);
  // TODO: do something with this ending price?

  const orderItem = token.ordersSnippet?.listing?.orderItem;
  const fetchSignedOBOrder = async () => {
    const { result, error } = await apiGet(`/orders/${user?.address}`, {
      requiresAuth: true,
      query: {
        id: orderItem?.id,
        limit: 1
      }
    });
    if (!error && result?.data && result?.data[0]) {
      const order = result?.data[0] as SignedOBOrder;
      setOrderDetails(order);
      // const lastPrice = await getCurrentChainOBOrderPrice(signedOrder);
      // console.log('signedOrder', signedOrder);
    }
  };

  useEffect(() => {
    fetchSignedOBOrder();
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
      onOKButton={async () => {
        if (!orderDetails || !user) {
          return;
        }
        const buyPriceEthVal = parseFloat(buyPriceEth ?? '0');
        if (price >= buyPriceEthVal) {
          setErrorMsg('The new price must be lower than the current price.');
          return;
        } else {
          setErrorMsg('');
        }
        console.log(collection);
        console.log(token);

        // todo: remove this once BE fix validation of tokens' images (not needed):
        for (const nft of orderDetails.nfts) {
          for (const token of nft.tokens) {
            token.tokenImage = token.tokenImage || BLANK_IMAGE_URL;
          }
        }

        const signedOrders: SignedOBOrder[] = [];
        // keep the last Order & set the New Price:
        const order: SignedOBOrder = {
          id: '',
          chainId: orderDetails.chainId,
          isSellOrder: orderDetails.isSellOrder,
          makerAddress: orderDetails.makerAddress,
          numItems: orderDetails.numItems,
          startTimeMs: orderDetails.startTimeMs,
          endTimeMs: orderDetails.endTimeMs,
          startPriceEth: price, // set the New Price.
          endPriceEth: price, // set the New Price.
          nfts: orderDetails.nfts,
          makerUsername: orderDetails.makerUsername,
          nonce: orderDetails.nonce,
          execParams: orderDetails.execParams,
          extraParams: orderDetails.extraParams,
          signedOrder: orderDetails.signedOrder
        };
        signedOrders.push(order);
        try {
          await postOrders(user.address, signedOrders);
        } catch (ex) {
          toastError(ex as string);
          return false;
        }
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
      <div className="text-red-700 mt-4">{errorMsg}</div>
    </Modal>
  );
};

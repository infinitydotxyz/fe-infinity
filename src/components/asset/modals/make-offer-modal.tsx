import { SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { Modal, CurrencyInput, DatePickerBox, toastSuccess, toastError } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { fetchOrderNonce, fetchUserSignedOBOrder, postOrders } from 'src/utils/marketUtils';
import { secondsPerDay } from 'src/utils/ui-constants';

interface Props {
  buyPriceEth: string;
  isOpen: boolean;
  token: Token;
  onClose: () => void;
}

export const MakeOfferModal = ({ isOpen, onClose, token, buyPriceEth }: Props) => {
  const { user } = useAppContext();
  const [orderDetails, setOrderDetails] = useState<SignedOBOrder | null>(null);
  const [price, setPrice] = useState<string>(buyPriceEth || '1');
  const [expirationDate, setExpirationDate] = useState(Date.now() + secondsPerDay * 30 * 1000);

  const fetchOrder = async () => {
    const order = await fetchUserSignedOBOrder(user?.address, token?.ordersSnippet?.listing?.orderItem?.id);
    console.log('order', order);
    setOrderDetails(order);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="Make offer"
      title="Make offer"
      onOKButton={async () => {
        if (!orderDetails || !user) {
          return;
        }
        const priceVal = parseFloat(price);

        const orderNonce = await fetchOrderNonce(user.address);

        const signedOrders: SignedOBOrder[] = [];
        // keep the last Order & set the New Price:
        orderDetails.signedOrder.isSellOrder = false;

        const order: SignedOBOrder = {
          id: '',
          chainId: orderDetails.chainId,
          isSellOrder: false,
          makerAddress: user.address,
          makerUsername: user.username ?? '',
          numItems: orderDetails.numItems,
          startTimeMs: Date.now(),
          endTimeMs: expirationDate,
          startPriceEth: priceVal, // set the Offer Price.
          endPriceEth: priceVal, // set the Offer Price.
          nfts: orderDetails.nfts,
          nonce: orderNonce,
          execParams: orderDetails.execParams,
          extraParams: orderDetails.extraParams,
          signedOrder: orderDetails.signedOrder,
          maxGasPriceWei: orderDetails.maxGasPriceWei
        };
        console.log('order', order);
        signedOrders.push(order);
        try {
          await postOrders(user.address, signedOrders);
          toastSuccess('Offer sent successfully.');
        } catch (ex) {
          toastError(`${ex}`);
          return false;
        }
        onClose();
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
              setPrice(value);
            }}
          />
        </div>
        <div className="mt-4">
          <DatePickerBox
            placeholder="Expiry date"
            label="Expiry date"
            value={new Date(parseInt(expirationDate.toString()))}
            onChange={(date) => {
              setExpirationDate(date.getTime());
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

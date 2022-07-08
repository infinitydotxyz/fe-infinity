import { Token } from '@infinityxyz/lib-frontend/types/core';
import React, { useEffect, useState } from 'react';
import { Modal, CurrencyInput, DatePickerBox } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { fetchUserSignedOBOrder } from 'src/utils/marketUtils';
import { secondsPerDay } from 'src/utils/ui-constants';

interface Props {
  buyPriceEth: string;
  isOpen: boolean;
  token: Token;
  onClose: () => void;
}

export const MakeOfferModal = ({ isOpen, onClose, token, buyPriceEth }: Props) => {
  const { user } = useAppContext();
  const [price, setPrice] = useState<string>(buyPriceEth || '1');
  const [expirationDate, setExpirationDate] = useState(Date.now() + secondsPerDay * 30 * 1000);

  const fetchOrder = async () => {
    const order = await fetchUserSignedOBOrder(user?.address, token?.ordersSnippet?.listing?.orderItem?.id);
    console.log('order', order);
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
      onOKButton={() => {
        // todo: adi: Mkae Offer
        console.log(token);
        const priceVal = parseFloat(price);
        console.log('priceVal', priceVal);

        // const signedOrders: SignedOBOrder[] = [];
        // // keep the last Order & set the New Price:
        // const order: SignedOBOrder = {
        //   id: '',
        //   chainId: token.chainId ?? ChainId.Mainnet,
        //   isSellOrder: false,
        //   makerAddress: user?.address ?? '',
        //   makerUsername: user?.username ?? '',
        //   numItems: 1,
        //   startTimeMs: token.startTimeMs,
        //   endTimeMs: token.endTimeMs,
        //   startPriceEth: priceVal, // set the New priceVal.
        //   endPriceEth: priceVal, // set the New Price.
        //   nfts: [],
        //   nonce: token.nonce,
        //   execParams: token.execParams,
        //   extraParams: token.extraParams,
        //   signedOrder: token.signedOrder,
        //   maxGasPriceWei: token.maxGasPriceWei
        // };
        // signedOrders.push(order);
        // try {
        //   await postOrders(user.address, signedOrders);
        //   toastSuccess('Lower price successfully.');
        // } catch (ex) {
        //   toastError(`${ex}`);
        //   return false;
        // }
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

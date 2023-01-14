import { ChainId, OBOrder, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import { useState } from 'react';
import {
  EthPrice,
  Modal,
  SimpleTable,
  SimpleTableItem,
  TextInputBox,
  toastError,
  toastSuccess
} from 'src/components/common';
import {
  DEFAULT_MAX_GAS_PRICE_WEI,
  extractErrorMsg,
  getEstimatedGasPrice,
  INFINITY_FEE_PCT,
  INFINITY_ROYALTY_PCT,
  MISSING_IMAGE_URL
} from 'src/utils';
import { getSignedOBOrder } from 'src/utils/exchange/orders';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { postOrdersV2 } from 'src/utils/orderbookUtils';

interface Props {
  isOpen: boolean;
  order: SignedOBOrder;
  onClose: () => void;
  onDone: (newPrice: number) => void;
}

export const ALowerPriceModal = ({ isOpen, onClose, order, onDone }: Props) => {
  const { user, chainId, getEthersProvider, getSigner } = useOnboardContext();
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({
    title: 'Current price',
    value: (
      <div className="font-medium">
        <EthPrice label={order.startPriceEth.toString() ?? ''} />
      </div>
    )
  });
  tableItems.push({ title: 'Fee', value: <div className="font-medium">{INFINITY_FEE_PCT}%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-medium">{INFINITY_ROYALTY_PCT}%</div> });

  const lowerPrice = async () => {
    const newPriceEth = parseFloat(price);
    if (!order || !user || !price || newPriceEth <= 0) {
      return;
    }
    const oldPriceEth = parseFloat(order.startPriceEth.toString() ?? '0');
    if (newPriceEth >= oldPriceEth) {
      setErrorMsg('New price must be lower than the current price');
      return;
    } else {
      setErrorMsg('');
    }

    // todo: remove this once BE fix validation of tokens' images (not needed):
    for (const nft of order.nfts) {
      for (const token of nft.tokens) {
        token.tokenImage = token.tokenImage || MISSING_IMAGE_URL;
      }
    }

    try {
      const signedOrders: SignedOBOrder[] = [];
      const signer = getSigner();
      setIsSubmitting(true);
      const gasPrice = await getEstimatedGasPrice(getEthersProvider());
      if (signer) {
        // keep the last Order & set the New Price:
        const obOrder: OBOrder = {
          id: '',
          chainId,
          isSellOrder: order.isSellOrder,
          makerAddress: order.makerAddress,
          makerUsername: order.makerUsername,
          numItems: order.numItems,
          startTimeMs: order.startTimeMs,
          endTimeMs: order.endTimeMs,
          startPriceEth: newPriceEth, // set the New Price.
          endPriceEth: newPriceEth, // set the New Price.
          nfts: order.nfts,
          nonce: order.nonce,
          execParams: order.execParams,
          extraParams: order.extraParams,
          maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI
        };

        const signedOrder = await getSignedOBOrder(user, chainId, signer, obOrder);
        if (signedOrder) {
          signedOrders.push(signedOrder);
          try {
            await postOrdersV2(chainId as ChainId, signedOrders);
            setIsSubmitting(false);
            toastSuccess('Lowered price successfully');
            onDone(newPriceEth);
          } catch (ex) {
            toastError(`${ex}`);
            return false;
          }
        }
      }
    } catch (err) {
      toastError(extractErrorMsg(err));
    }
    onClose();
  };

  return (
    <Modal
      wide={false}
      isOpen={isOpen}
      onClose={onClose}
      okButton="Lower Price"
      title="Lower Price"
      disableOK={isSubmitting}
      onOKButton={lowerPrice}
    >
      <SimpleTable className="mb-5 space-y-1" items={tableItems} />

      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price}
        label="New Price"
        placeholder=""
        onChange={(value) => {
          setPrice(value);
        }}
      />
      <div className="text-red-700 mt-4">{errorMsg}</div>
    </Modal>
  );
};

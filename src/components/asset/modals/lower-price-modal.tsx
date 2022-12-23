import { ChainId, OBOrder, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
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
import { fetchUserSignedOBOrder, postOrdersV2 } from 'src/utils/orderbookUtils';

interface Props {
  isOpen: boolean;
  token: Token;
  buyPriceEth?: string;
  onClose: () => void;
  onDone: () => void;
}

export const LowerPriceModal = ({ isOpen, onClose, token, buyPriceEth, onDone }: Props) => {
  const { user, chainId, getEthersProvider, getSigner } = useOnboardContext();
  const [orderDetails, setOrderDetails] = useState<SignedOBOrder | null>(null);
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // const [lastPrice, setLastPrice] = useState(0);
  // TODO: do something with this ending price?

  const orderItem = token.ordersSnippet?.listing?.orderItem;
  const fetchSignedOBOrder = async () => {
    try {
      const order = await fetchUserSignedOBOrder(orderItem?.id);
      setOrderDetails(order);
    } catch (err) {
      toastError(`Failed to fetch order`);
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

  const lowerPrice = async () => {
    const priceVal = parseFloat(price);
    if (!orderDetails || !user || !price || priceVal <= 0) {
      return;
    }
    const buyPriceEthVal = parseFloat(buyPriceEth ?? '0');
    if (priceVal >= buyPriceEthVal) {
      setErrorMsg('New price must be lower than the current price');
      return;
    } else {
      setErrorMsg('');
    }

    // todo: remove this once BE fix validation of tokens' images (not needed):
    for (const nft of orderDetails.nfts) {
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
        const order: OBOrder = {
          id: '',
          chainId,
          isSellOrder: orderDetails.isSellOrder,
          makerAddress: orderDetails.makerAddress,
          makerUsername: orderDetails.makerUsername,
          numItems: orderDetails.numItems,
          startTimeMs: orderDetails.startTimeMs,
          endTimeMs: orderDetails.endTimeMs,
          startPriceEth: priceVal, // set the New Price.
          endPriceEth: priceVal, // set the New Price.
          nfts: orderDetails.nfts,
          nonce: orderDetails.nonce,
          execParams: orderDetails.execParams,
          extraParams: orderDetails.extraParams,
          maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI
        };

        const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
        if (signedOrder) {
          signedOrders.push(signedOrder);
          try {
            await postOrdersV2(chainId as ChainId, signedOrders);
            setIsSubmitting(false);
            toastSuccess('Lowered price successfully');
            onDone();
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
      <SimpleTable className="mb-5" items={tableItems} />

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

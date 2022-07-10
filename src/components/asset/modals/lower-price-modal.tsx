import { OBOrder, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
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
import { DEFAULT_MAX_GAS_PRICE_WEI, INFINITY_FEE_PCT, INFINITY_ROYALTY_PCT, MISSING_IMAGE_URL } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { getSignedOBOrder } from 'src/utils/exchange/orders';
import { fetchUserSignedOBOrder, postOrders } from 'src/utils/marketUtils';

interface Props {
  isOpen: boolean;
  token: Token;
  buyPriceEth?: string;
  onClose: () => void;
}

export const LowerPriceModal = ({ isOpen, onClose, token, buyPriceEth }: Props) => {
  const { user, chainId, providerManager } = useAppContext();
  const [orderDetails, setOrderDetails] = useState<SignedOBOrder | null>(null);
  const [price, setPrice] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  // const [lastPrice, setLastPrice] = useState(0);
  // TODO: do something with this ending price?

  const orderItem = token.ordersSnippet?.listing?.orderItem;
  const fetchSignedOBOrder = async () => {
    const order = await fetchUserSignedOBOrder(user?.address, orderItem?.id);
    console.log('existing order', order);
    setOrderDetails(order);
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
        if (!orderDetails || !user || price <= 0) {
          return;
        }
        const buyPriceEthVal = parseFloat(buyPriceEth ?? '0');
        if (price >= buyPriceEthVal) {
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

        const signedOrders: SignedOBOrder[] = [];
        const signer = providerManager?.getEthersProvider().getSigner();
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
            startPriceEth: price, // set the New Price.
            endPriceEth: price, // set the New Price.
            nfts: orderDetails.nfts,
            nonce: orderDetails.nonce,
            execParams: orderDetails.execParams,
            extraParams: orderDetails.extraParams,
            maxGasPriceWei: DEFAULT_MAX_GAS_PRICE_WEI
          };

          const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
          if (signedOrder) {
            signedOrders.push(signedOrder);
            try {
              await postOrders(user.address, signedOrders);
              toastSuccess('Lowered price successfully');
            } catch (ex) {
              toastError(`${ex}`);
              return false;
            }
          }
        }
        onClose();
      }}
    >
      <SimpleTable className="my-3" items={tableItems} />

      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price.toString()}
        label="New Price"
        placeholder=""
        onChange={(value) => {
          setPrice(Number(value));
        }}
      />
      <div className="text-red-700 mt-4">{errorMsg}</div>
    </Modal>
  );
};

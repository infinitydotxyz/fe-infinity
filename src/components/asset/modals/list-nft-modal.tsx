import { ChainId, Erc721Token, OBOrder, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { getOBComplicationAddress, NULL_ADDRESS } from '@infinityxyz/lib-frontend/utils';
import { useState } from 'react';
import {
  DatePickerBox,
  Modal,
  SimpleTable,
  SimpleTableItem,
  TextInputBox,
  toastError,
  toastSuccess
} from 'src/components/common';
import { DEFAULT_MAX_GAS_PRICE_WEI, extractErrorMsg, getEstimatedGasPrice, INFINITY_FEE_PCT } from 'src/utils';
import { getSignedOBOrder } from 'src/utils/orders';
import { useOnboardContext } from 'src/utils/context/OnboardContext/OnboardContext';
import { fetchOrderNonce, postOrdersV2 } from 'src/utils/orderbookUtils';
import { secondsPerDay } from 'src/utils/ui-constants';

interface Props {
  isOpen: boolean;
  token: Token;
  onClose: () => void;
  onDone: () => void;
}

export const ListNFTModal = ({ isOpen, onClose, onDone, token }: Props) => {
  const { getSigner, user, chainId, getEthersProvider } = useOnboardContext();

  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expirationDate, setExpirationDate] = useState(Date.now() + secondsPerDay * 30 * 1000);
  // TODO: do something with this ending price?
  // const [includeEndingPrice, setIncludeEndingPrice] = useState<boolean>(false);
  // const { options, onChange, selected } = useToggleTab(['Set Price', 'Highest Bid'], 'Set Price');
  // const { options, onChange, selected } = useToggleTab(['Set Price'], 'Set Price');

  const tableItems: SimpleTableItem[] = [];
  tableItems.push({ title: 'Fee', value: <div className="font-bold">{INFINITY_FEE_PCT}%</div> });
  tableItems.push({ title: 'Royalty', value: <div className="font-bold">0%</div> });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      okButton="List"
      title="List NFT"
      disableOK={isSubmitting}
      onOKButton={async () => {
        const priceVal = parseFloat(price);
        if (!user || !price || priceVal <= 0) {
          return;
        }

        try {
          setIsSubmitting(true);
          const priceVal = parseFloat(price);
          const orderNonce = await fetchOrderNonce(user.address, chainId as ChainId);
          const signedOrders: SignedOBOrder[] = [];

          const signer = getSigner();
          if (signer) {
            const tokenInfo = {
              tokenId: token.tokenId,
              tokenAddress: token.collectionAddress ?? '',
              tokenName: token.slug ?? '',
              tokenImage: token.image?.url || token?.alchemyCachedImage || token.image?.originalUrl || '',
              attributes: (token as Erc721Token).metadata?.attributes ?? [],
              numTokens: 1,
              takerAddress: '',
              takerUsername: ''
            };
            const orderItem = {
              chainId: chainId as ChainId,
              collectionAddress: token.collectionAddress ?? '',
              collectionName: token.collectionName ?? '',
              collectionSlug: token.collectionSlug ?? '',
              collectionImage: 'BLANK', // todo: not necessary but BE throws error on ''
              hasBlueCheck: token.hasBlueCheck ?? false,
              tokens: [tokenInfo]
            };

            const gasPrice = await getEstimatedGasPrice(getEthersProvider());
            const order: OBOrder = {
              id: '',
              chainId,
              isSellOrder: true,
              makerAddress: user.address,
              makerUsername: user.username ?? '',
              numItems: 1,
              startTimeMs: Date.now(),
              endTimeMs: expirationDate,
              startPriceEth: priceVal, // set the Offer Price.
              endPriceEth: priceVal, // set the Offer Price.
              nfts: [orderItem],
              nonce: orderNonce + signedOrders.length,
              execParams: {
                complicationAddress: getOBComplicationAddress(chainId),
                currencyAddress: NULL_ADDRESS
              },
              extraParams: {
                buyer: NULL_ADDRESS
              },
              maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI
            };

            const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
            if (signedOrder) {
              signedOrders.push(signedOrder);
              try {
                // await postOrders(user.address, signedOrders);
                await postOrdersV2(chainId as ChainId, signedOrders);
                toastSuccess('Listed successfully');
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
      }}
    >
      {/* <ToggleTab small={true} options={options} selected={selected} onChange={onChange} className="mb-6" /> */}

      <p className="mb-4">Sell at a fixed price.</p>
      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price}
        label="Price"
        placeholder=""
        onChange={(value) => {
          setPrice(value);
        }}
      />

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

      <SimpleTable className="my-6" items={tableItems} />

      {/* <Switch
            title="Include ending price"
            checked={includeEndingPrice}
            onChange={() => setIncludeEndingPrice(!includeEndingPrice)}
          /> */}
    </Modal>
  );
};

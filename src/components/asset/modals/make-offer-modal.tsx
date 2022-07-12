import { ChainId, OBOrder, SignedOBOrder, Token } from '@infinityxyz/lib-frontend/types/core';
import { ETHEREUM_WETH_ADDRESS, getOBComplicationAddress, NULL_ADDRESS } from '@infinityxyz/lib-frontend/utils';
import { useState } from 'react';
import { CurrencyInput, DatePickerBox, Modal, toastError, toastSuccess } from 'src/components/common';
import { DEFAULT_MAX_GAS_PRICE_WEI, getEstimatedGasPrice, getOwnerAddress } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { getSignedOBOrder } from 'src/utils/exchange/orders';
import { fetchOrderNonce, postOrders } from 'src/utils/marketUtils';
import { secondsPerDay } from 'src/utils/ui-constants';

interface Props {
  buyPriceEth: string;
  isOpen: boolean;
  token: Token;
  onClose: () => void;
}

export const MakeOfferModal = ({ isOpen, onClose, buyPriceEth, token }: Props) => {
  const { user, chainId, providerManager } = useAppContext();
  const [price, setPrice] = useState<string>(buyPriceEth || '1');
  const [expirationDate, setExpirationDate] = useState(Date.now() + secondsPerDay * 30 * 1000);

  const onOKButton = async () => {
    if (!user) {
      return;
    }
    try {
      const priceVal = parseFloat(price);
      const orderNonce = await fetchOrderNonce(user.address);
      const signedOrders: SignedOBOrder[] = [];

      const signer = providerManager?.getEthersProvider().getSigner();
      if (signer) {
        const takerAddress = getOwnerAddress(token);
        if (!takerAddress) {
          toastError('There is no owner address');
          return false;
        }
        const tokenInfo = {
          tokenId: token.tokenId,
          tokenAddress: token.collectionAddress ?? '',
          tokenName: token.slug ?? '',
          tokenImage: token.image?.url ?? token.image?.originalUrl ?? '',
          takerAddress,
          takerUsername: '',
          attributes: [],
          numTokens: 1
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

        const gasPrice = await getEstimatedGasPrice(providerManager?.getEthersProvider());
        const order: OBOrder = {
          id: '',
          chainId,
          isSellOrder: false,
          makerAddress: user.address,
          makerUsername: user.username ?? '',
          numItems: 1,
          startTimeMs: Date.now(),
          endTimeMs: expirationDate,
          startPriceEth: priceVal, // set the Offer Price.
          endPriceEth: priceVal, // set the Offer Price.
          nfts: [orderItem],
          nonce: orderNonce,
          execParams: {
            complicationAddress: getOBComplicationAddress(chainId),
            currencyAddress: ETHEREUM_WETH_ADDRESS
          },
          extraParams: {
            buyer: NULL_ADDRESS
          },
          maxGasPriceWei: gasPrice ?? DEFAULT_MAX_GAS_PRICE_WEI
        };

        const signedOrder = await getSignedOBOrder(user, chainId, signer, order);
        console.log('signedOrder', signedOrder);
        if (signedOrder) {
          signedOrders.push(signedOrder);
          try {
            await postOrders(user.address, signedOrders);
            toastSuccess('Offer sent successfully');
          } catch (ex) {
            toastError(`${ex}`);
            return false;
          }
        }
      }
    } catch (err) {
      toastError(`${err}`);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} okButton="Make offer" title="Make offer" onOKButton={onOKButton}>
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

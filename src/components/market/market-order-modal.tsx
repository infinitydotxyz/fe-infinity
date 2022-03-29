/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { BigNumberish } from 'ethers';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { DateInput, TextInput } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { CollectionAddr, CollectionManager } from './marketUtils';
import { Modal } from 'src/components/common/modal';

const isServer = typeof window === 'undefined';

interface Props {
  isOpen: boolean;
  inOrder?: OBOrder;
  onClose: (order?: OBOrder) => void;
}

const ORDER_NONCE = 1;

export const MarketOrderModal: React.FC<Props> = ({ isOpen, inOrder, onClose }: Props) => {
  const { user, chainId, showAppError } = useAppContext();

  // form data
  const [isSellOrder, setIsSellOrder] = useState<boolean>(false);
  const [numItems, setNumItems] = useState<BigNumberish>(1);
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
  const [collections, setCollections] = useState<CollectionAddr[]>([CollectionManager.collections()[0]]);
  const [tokenId, setTokenId] = useState<string>('1');
  const [complicationAddress, setComplicationAddress] = useState<string>('');
  const [currencyAddress, setCurrencyAddress] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');

  useEffect(() => {
    if (inOrder) {
      setIsSellOrder(inOrder.isSellOrder);
      setNumItems(inOrder.numItems);
      setStartTime(inOrder.startTime);
      setEndTime(inOrder.endTime);
      setStartPrice(inOrder.startPrice);
      setEndPrice(inOrder.endTime);
    }
  }, [inOrder]);

  const onSubmit = async () => {
    let dataOK = false;
    if (user?.address && chainId) {
      dataOK = true;

      const orderId = solidityKeccak256(['address', 'uint256', 'uint256'], [user.address, ORDER_NONCE, chainId]);

      const order: OBOrder = {
        id: orderId,
        chainId: chainId,
        isSellOrder: isSellOrder,
        signerAddress: user.address,
        numItems,
        startTime: startTime,
        endTime: endTime,
        startPrice: startPrice,
        endPrice: endPrice,
        minBpsToSeller: 9000,
        nonce: ORDER_NONCE,
        nfts: getItems(),
        execParams: getExecParams(),
        extraParams: getExtraParams()
      };

      onClose(order);
    }

    if (!dataOK) {
      showAppError('Data is invalid');
    }
  };

  const getItems = (): Item[] => {
    const items: Item[] = [];
    for (let i = 0; i < numItems; i++) {
      items.push({
        tokenIds: [tokenId],
        collection: collections[i].address
      });
    }
    return items;
  };

  const getExecParams = (): ExecParams => {
    return { complicationAddress, currencyAddress };
  };

  const getExtraParams = (): ExtraParams => {
    return { buyer };
  };

  const collectionAddressesField = (
    <div>todo</div>
    // <div>
    //   <div className={styles.formLabel}>Collection Address</div>

    //   <Typeahead
    //     id="basic-typeahead-multiple"
    //     multiple
    //     labelKey={'name'}
    //     onChange={setCollections}
    //     options={CollectionManager.collections()}
    //     placeholder="Items"
    //     selected={collections}
    //   />
    // </div>
  );

  const tokenIdField = (
    <div>
      <TextInput type="text" label="Token Ids" placeholder="1234" value={tokenId} onChange={(e) => setTokenId(e)} />
    </div>
  );

  const numItemsField = (
    <div>
      <TextInput
        label="Min NFTs"
        type="number"
        placeholder="4"
        value={numItems.toString()}
        onChange={(e) => setNumItems(parseInt(e))}
      />
    </div>
  );

  const startPriceField = (
    <div>
      <TextInput
        label="Start Price"
        type="number"
        placeholder="2.33"
        value={startPrice.toString()}
        onChange={(e) => setStartPrice(parseFloat(e))}
      />
    </div>
  );

  const endPriceField = (
    <div>
      <TextInput
        label="End Price"
        type="number"
        placeholder="2.33"
        value={endPrice.toString()}
        onChange={(e) => setEndPrice(parseFloat(e))}
      />
    </div>
  );

  const startTimeField = (
    <div>
      <DateInput
        label="Start Time"
        value={new Date(parseInt(startTime.toString()) * 1000)}
        onChange={(date) => {
          setStartTime(date.getTime() / 1000);
        }}
      />
    </div>
  );

  const endTimeField = (
    <div>
      <DateInput
        label="End Time"
        value={new Date(parseInt(endTime.toString()) * 1000)}
        onChange={(date) => {
          setEndTime(date.getTime() / 1000);
        }}
      />
    </div>
  );

  let content = null;
  if (user?.address) {
    content = (
      <>
        {collectionAddressesField}
        {tokenIdField}
        {numItemsField}
        {startPriceField}
        {endPriceField}
        {startTimeField}
        {endTimeField}
      </>
    );
  }

  return (
    <>
      {!isServer && (
        <Modal
          isOpen={isOpen}
          onClose={() => onClose()}
          title={!isSellOrder ? 'Buy Order' : 'Sell Order'}
          okButton={!isSellOrder ? 'Buy' : 'Sell'}
          onSubmit={() => {
            onSubmit();
          }}
        >
          <div>
            <div className="flex flex-col ">{content}</div>
          </div>
        </Modal>
      )}
    </>
  );
};

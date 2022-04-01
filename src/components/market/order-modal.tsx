/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { BigNumberish } from 'ethers';
import { formatEther, parseEther, solidityKeccak256 } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { DateInput, TextInput, SimpleModal, ComboInput } from 'src/components/common';
import { useAppContext } from 'src/utils/context/AppContext';
import { bigNumToDate, CollectionAddr, CollectionManager } from 'src/utils/marketUtils';

const isServer = typeof window === 'undefined';

interface Props {
  isOpen: boolean;
  inOrder?: OBOrder;
  buyMode?: boolean; // use this if inOrder is null
  onClose: (order?: OBOrder) => void;
}

const ORDER_NONCE = 1;

export const OrderModal: React.FC<Props> = ({ isOpen, buyMode = true, inOrder, onClose }: Props) => {
  const { user, chainId, showAppError } = useAppContext();

  // form data
  const [isSellOrder, setIsSellOrder] = useState<boolean>(false);
  const [numItems, setNumItems] = useState<BigNumberish>(1);
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
  const [collections, setCollections] = useState<CollectionAddr[]>([CollectionManager.collections()[0]]);
  const [tokenId, setTokenId] = useState<string>('12345');
  const [complicationAddress, setComplicationAddress] = useState<string>('');
  const [currencyAddress, setCurrencyAddress] = useState<string>('');
  const [buyer, setBuyer] = useState<string>('');

  useEffect(() => {
    if (inOrder) {
      setIsSellOrder(inOrder.isSellOrder);
      setNumItems(inOrder.numItems);
      setStartTime(inOrder.startTime);
      setEndTime(inOrder.endTime);
      setStartPrice(formatEther(inOrder.startPrice));
      setEndPrice(formatEther(inOrder.endPrice));
    } else {
      setIsSellOrder(!buyMode);
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
        startPrice: parseEther(startPrice.toString()),
        endPrice: parseEther(endPrice.toString()),
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

    for (let i = 0; i < collections.length; i++) {
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
    <div>
      <ComboInput
        label="Collection Address"
        value={collections[0]}
        options={CollectionManager.collections()}
        onChange={(item) => {
          setCollections([item]);
        }}
      />
    </div>
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
    <TextInput type="text" label="Token Ids" placeholder="1234" value={tokenId} onChange={(e) => setTokenId(e)} />
  );

  const numItemsField = (
    <TextInput
      label="Num Items"
      type="number"
      placeholder="4"
      value={numItems.toString()}
      onChange={(e) => setNumItems(parseInt(e))}
    />
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
    <TextInput
      label="End Price"
      type="number"
      placeholder="2.33"
      value={endPrice.toString()}
      onChange={(e) => setEndPrice(parseFloat(e))}
    />
  );

  const startTimeField = (
    <DateInput
      label="Start Time"
      value={bigNumToDate(startTime)}
      onChange={(date) => {
        setStartTime(date.getTime() / 1000);
      }}
    />
  );

  const endTimeField = (
    <DateInput
      label="End Time"
      value={bigNumToDate(endTime)}
      onChange={(date) => {
        setEndTime(date.getTime() / 1000);
      }}
    />
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
        <SimpleModal
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
        </SimpleModal>
      )}
    </>
  );
};

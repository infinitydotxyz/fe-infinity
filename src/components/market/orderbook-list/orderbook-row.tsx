import { useState } from 'react';
import { ChainId, SignedOBOrder } from '@infinityxyz/lib-frontend/types/core';
import moment from 'moment';
import { Button, EthPrice, toastError, toastSuccess } from 'src/components/common';
import { ellipsisAddress, extractErrorMsg, numStr, shortDate } from 'src/utils';
import { useAppContext } from 'src/utils/context/AppContext';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { checkOffersToUser, getOrderType } from 'src/utils/marketUtils';
import { DataColumn, defaultDataColumns } from './data-columns';
import { OrderbookItem } from './orderbook-item';
import { OrderDetailModal } from '../OrderDetailModal';
import { takeMultipleOneOrders } from 'src/utils/exchange/orders';

type OrderbookRowProps = {
  order: SignedOBOrder;
  isFilterOpen: boolean;
};

export const OrderbookRow = ({ order, isFilterOpen }: OrderbookRowProps): JSX.Element => {
  const { user, providerManager, checkSignedIn, chainId } = useAppContext();
  const { addCartItem, setOrderDrawerOpen } = useOrderContext();
  const [selectedOrder, setSelectedOrder] = useState<SignedOBOrder | null>(null);

  const valueDiv = (dataColumn: DataColumn) => {
    let value = order.id;

    switch (dataColumn.field) {
      case 'name':
      case 'buyOrSell':
        break;
      case 'type':
        value = getOrderType(order);
        break;
      case 'makerUsername':
        value = order.makerUsername || ellipsisAddress(order.makerAddress);
        break;
      case 'minSalePrice':
        value = numStr(order.startPriceEth.toString());
        break;
      case 'maxBuyPrice':
        value = numStr(order.endPriceEth.toString());
        break;
      case 'numNFTs':
        value = numStr(order.numItems.toString());
        break;
      case 'expirationDate':
        value = shortDate(new Date(order.endTimeMs));
        break;
      case 'datePlaced':
        value = moment(order.startTimeMs).fromNow();
        break;
    }

    switch (dataColumn.type) {
      case 'Text':
        return (
          <div className="flex truncate flex-row items-center" title={value}>
            {value ? <div className="truncate font-bold">{value}</div> : <div>---</div>}
          </div>
        );
      case 'Currency':
        return (
          <div className="flex flex-row items-center">
            <EthPrice label={value} labelClassName="font-bold" />
          </div>
        );
      case 'Name':
      case 'Button':
    }
  };

  let gridTemplate = '';

  defaultDataColumns(order).forEach((data) => {
    if (isFilterOpen === true && (data.name === 'From' || data.name === 'Date')) {
      // isFilterOpen => don't show those columns.
    } else {
      gridTemplate += ` ${data.width}`;
    }
  });

  const onClickBidHigher = (order: SignedOBOrder) => {
    // add to Cart as a New Buy Order:
    addCartItem({
      chainId: order?.chainId as ChainId,
      collectionName: order?.nfts[0].collectionName ?? '',
      collectionAddress: order?.nfts[0].collectionAddress ?? '',
      collectionImage: order?.nfts[0].collectionImage ?? '',
      collectionSlug: order?.nfts[0].collectionSlug ?? '',
      tokenImage: order?.nfts[0].tokens[0].tokenImage ?? '',
      tokenName: order?.nfts[0].tokens[0].tokenName ?? '',
      tokenId: order?.nfts[0].tokens[0].tokenId ?? '-1',
      isSellOrder: false,
      attributes: []
    });
    setOrderDrawerOpen(true);
  };

  const onClickBuySell = async (order: SignedOBOrder) => {
    if (!checkSignedIn()) {
      return;
    }
    // - direct Buy/Sell:
    try {
      const signer = providerManager?.getEthersProvider().getSigner();
      if (signer) {
        await takeMultipleOneOrders(signer, chainId, [order.signedOrder]);
        toastSuccess('Order sent for execution');
      } else {
        throw 'Signer is null';
      }
    } catch (err) {
      const errMsg = extractErrorMsg(err);
      toastError(errMsg);
    }
    // setPrice(`${order.startPriceEth}`);
    // addCartItem({
    //   chainId: order?.chainId as ChainId,
    //   collectionName: order?.nfts[0].collectionName ?? '',
    //   collectionAddress: order?.nfts[0].collectionAddress ?? '',
    //   collectionImage: order?.nfts[0].collectionImage ?? '',
    //   collectionSlug: order?.nfts[0].collectionSlug ?? '',
    //   tokenImage: order?.nfts[0].tokens[0].tokenImage ?? '',
    //   tokenName: order?.nfts[0].tokens[0].tokenName ?? '',
    //   tokenId: order?.nfts[0].tokens[0].tokenId ?? '-1',
    //   isSellOrder,
    //   attributes: []
    // });
  };

  const isOwner = order.makerAddress === user?.address;

  return (
    <div className="rounded-3xl mb-3 p-8 w-full bg-gray-100">
      <div className="items-center w-full hidden lg:grid" style={{ gridTemplateColumns: gridTemplate }}>
        {defaultDataColumns(order).map((data) => {
          const content = valueDiv(data);

          const title = data.name;

          if (data.field === 'buyOrSell') {
            if (isOwner) {
              return null;
            }
            const isOfferToUser = checkOffersToUser(order, user);
            if (order.isSellOrder) {
              // Sell Order (Listing)
              return (
                <Button className="w-32" key={`${order.id} ${data.field}`} onClick={() => onClickBuySell(order)}>
                  Buy
                </Button>
              );
            } else if (isOfferToUser === true) {
              // Buy Order (Offer) => show Sell button (if offer made to current user)
              return (
                <Button className="w-32" key={`${order.id} ${data.field}`} onClick={() => onClickBuySell(order)}>
                  Sell
                </Button>
              );
            } else if (isOfferToUser === false) {
              return (
                <Button className="w-32" key={`${order.id} ${data.field}`} onClick={() => onClickBidHigher(order)}>
                  Bid higher
                </Button>
              );
            } else {
              return null;
            }
          }
          if (isFilterOpen === true && (data.name === 'From' || data.name === 'Date')) {
            return null;
          }
          return (
            <OrderbookItem
              nameItem={data.type === 'Name'}
              key={`${order.id} ${data.field}`}
              title={title}
              order={order}
              content={
                <span className={data.onClick ? 'cursor-pointer' : ''} onClick={data.onClick}>
                  {content}
                </span>
              }
              onClick={() => setSelectedOrder(order)}
            />
          );
        })}
      </div>

      {/* for smaller screen - show row summary: */}
      <div className="flex items-center w-full lg:hidden">
        <div className="flex flex-col w-full">
          <div className="mr-4">
            <OrderbookItem nameItem={true} key={`${order.id} ${order.chainId}`} order={order} />
          </div>
          <div className="flex flex-col">
            <div>{order.isSellOrder ? 'Listing' : 'Offer'}</div>
            <div className="flex flex-row items-center">
              <EthPrice
                label={
                  order.isSellOrder ? numStr(order.startPriceEth.toString()) : numStr(order.endPriceEth.toString())
                }
                labelClassName="font-bold"
              />
            </div>
            <div># NFTs: {numStr(order.numItems.toString())}</div>
          </div>
        </div>
        <div className="text-right">
          <Button>{order.isSellOrder ? 'Buy' : 'Sell'}</Button>

          <div>{moment(order.startTimeMs).fromNow()}</div>
          <div>Expiry: {shortDate(new Date(order.endTimeMs))}</div>
        </div>
      </div>

      {selectedOrder !== null ? (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={true}
          onClose={() => {
            setSelectedOrder(null);
          }}
        />
      ) : null}
    </div>
  );
};

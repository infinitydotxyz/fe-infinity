import { useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { BigNumberish } from 'ethers';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { TextInputBox, Spacer, Divider, Button, Drawer, DatePickerBox } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { parseEther } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { useAppContext } from 'src/utils/context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrderDrawer({ open, onClose }: Props) {
  const [startPrice, setStartPrice] = useState<BigNumberish>(1);
  const [endPrice, setEndPrice] = useState<BigNumberish>(1);
  const [startTime, setStartTime] = useState<BigNumberish>(nowSeconds());
  const [endTime, setEndTime] = useState<BigNumberish>(nowSeconds().add(1000));
  const [numItems, setNumItems] = useState<BigNumberish>(1);
  const { buyCartItems, sellCartItems, clearCartItems, addBuyOrder, isCartEmpty, isOrderEmpty, isOrderBuilderEmpty } =
    useOrderContext();
  const { user, chainId } = useAppContext();

  const list = (
    <ul role="list" className="  divide-y divide-gray-200 overflow-y-auto">
      {buyCartItems.map((item) => (
        <ListItem key={item.tokenName} cartItem={item} />
      ))}

      {sellCartItems.map((item) => (
        <ListItem key={item.tokenName} cartItem={item} />
      ))}
    </ul>
  );

  const numItemsField = (
    <TextInputBox
      type="number"
      placeholder="4"
      label="Num Items"
      value={numItems.toString()}
      // onSubmit={() => {
      //   onSubmit();
      // }}
      onChange={(value) => setNumItems(parseInt(value))}
    />
  );

  const startPriceField = (
    <TextInputBox
      type="number"
      value={startPrice.toString()}
      placeholder="2.33"
      label="Start Price"
      // onSubmit={() => {
      //   onSubmit();
      // }}
      onChange={(value) => setStartPrice(parseFloat(value))}
    />
  );

  const endPriceField = (
    <TextInputBox
      type="number"
      value={endPrice.toString()}
      placeholder="2.33"
      label="End Price"
      // onSubmit={() => {
      //   onSubmit();
      // }}
      onChange={(value) => setEndPrice(parseFloat(value))}
    />
  );

  const startTimeField = (
    <DatePickerBox
      label="Start Time"
      value={new Date(parseInt(startTime.toString()) * 1000)}
      onChange={(date) => {
        setStartTime(date.getTime() / 1000);
      }}
    />
  );

  const endTimeField = (
    <DatePickerBox
      label="End Time"
      value={new Date(parseInt(endTime.toString()) * 1000)}
      onChange={(date) => {
        setEndTime(date.getTime() / 1000);
      }}
    />
  );

  const emptyCart = (
    <div className={'flex   h-full   justify-center content-center items-center text-sm'}>
      <div className={'text-center'}>
        <span className="text-lg font-semibold">Cart is empty</span>
        <br />
        Add an item to the order.
      </div>
    </div>
  );

  const buildFooter = (buttonClick: () => void, buttonTitle: string) => {
    return (
      <div className="flex flex-col items-center mb-4">
        <Divider />

        <Button onClick={buttonClick}>{buttonTitle}</Button>
      </div>
    );
  };

  const getItems = (): Item[] => {
    const items: Item[] = [];

    // for (let i = 0; i < collections.length; i++) {
    //   items.push({
    //     tokenIds: [tokenId],
    //     collection: collections[i].address
    //   });
    // }
    return items;
  };

  const getExecParams = (): ExecParams => {
    return { complicationAddress: '????', currencyAddress: '????' };
  };

  const getExtraParams = (): ExtraParams => {
    return { buyer: '????' };
  };

  const cartSummary = () => {
    return (
      <div>
        <div>Max spending</div>
        <div>Min NFTs to buy</div>
        <div>Expiration Date</div>
      </div>
    );
  };

  let contents;
  let title = 'Create order';
  let footer;

  if (isOrderEmpty()) {
    contents = emptyCart;
  } else if (!isOrderBuilderEmpty()) {
    // an order is being built, so let them finish it
    title = 'Buy order';
    footer = buildFooter(() => {
      const order: OBOrder = {
        id: '????',
        chainId: chainId,
        isSellOrder: false,
        signerAddress: user?.address ?? '????',
        numItems,
        startTime: startTime,
        endTime: endTime,
        startPrice: parseEther(startPrice.toString()),
        endPrice: parseEther(endPrice.toString()),
        minBpsToSeller: 9000,
        nonce: 1,
        nfts: getItems(),
        execParams: getExecParams(),
        extraParams: getExtraParams()
      };

      addBuyOrder(order);

      // clear out items
      clearCartItems();
    }, 'Add order to cart');

    contents = (
      <>
        {list}
        <div className="flex flex-col px-6 space-y-2">
          {numItemsField}
          {startPriceField}
          {endPriceField}
          {startTimeField}
          {endTimeField}
        </div>

        <Spacer />

        {footer}
      </>
    );
  } else if (!isCartEmpty()) {
    // ready to checkout, we have an order
    title = 'Cart';
    footer = buildFooter(() => {
      // sdf
    }, 'Checkout');

    contents = (
      <>
        {list}
        <div className="flex flex-col px-6 space-y-2">{cartSummary()}</div>

        <Spacer />

        {footer}
      </>
    );
  }

  return (
    <Drawer open={open} onClose={onClose} title={title}>
      {contents}
    </Drawer>
  );
}

// ==================================================================
// ==================================================================

interface Props2 {
  cartItem: OrderCartItem;
}

function ListItem({ cartItem }: Props2) {
  const { removeBuyCartItem } = useOrderContext();

  const menu = (
    <Button
      variant="ghost"
      size="small"
      onClick={() => {
        removeBuyCartItem(cartItem);
      }}
    >
      <MinusCircleIcon className="h-5 w-5" />
    </Button>
  );

  return (
    <li key={cartItem.tokenName}>
      <div className="group  relative">
        <div className="flex items-center py-6 px-5 group-hover:bg-theme-light-300">
          <div className="relative flex min-w-0 flex-1 items-center">
            <span className="relative inline-block flex-shrink-0">
              <img className="h-10 w-10 rounded-2xl" src={cartItem.imageUrl} alt="" />
            </span>
            <div className="ml-4 truncate">
              <p className="truncate text-sm font-medium text-gray-900">{cartItem.tokenName}</p>
              <p className="truncate text-sm text-gray-500">{'@' + cartItem.collectionName}</p>
            </div>
          </div>
          {menu}
        </div>
      </div>
    </li>
  );
}

import { useState } from 'react';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { BigNumberish } from 'ethers';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { TextInput, Spacer, Button, DateInput } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { Drawer } from '../common/drawer';

export interface OrderCartItem {
  tokenName: string;
  collectionName: string;
  imageUrl: string;
}

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
  const { buyCartItems, sellCartItems } = useOrderContext();

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

  const title = 'Create Order';

  const footer = (
    <div className="flex flex-col items-center mb-4">
      {/* divider line */}
      <div className="h-px w-full bg-slate-200 mb-4" />

      <Button onClick={onClose}>Add Order</Button>
    </div>
  );

  const numItemsField = (
    <TextInput
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
    <TextInput
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
    <TextInput
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
    <DateInput
      label="Start Time"
      value={new Date(parseInt(startTime.toString()) * 1000)}
      onChange={(date) => {
        setStartTime(date.getTime() / 1000);
      }}
    />
  );

  const endTimeField = (
    <DateInput
      label="End Time"
      value={new Date(parseInt(endTime.toString()) * 1000)}
      onChange={(date) => {
        setEndTime(date.getTime() / 1000);
      }}
    />
  );

  return (
    <Drawer open={open} onClose={onClose} title={title}>
      {list}
      <div className="flex flex-col space-y-2 px-6">
        {numItemsField}
        {startPriceField}
        {endPriceField}
        {startTimeField}
        {endTimeField}
      </div>

      <Spacer />

      {footer}
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
    <button
      type="button"
      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
      onClick={() => {
        removeBuyCartItem(cartItem);
      }}
    >
      <span className="flex h-full w-full items-center justify-center rounded-full">
        <MinusCircleIcon className="h-5 w-5 focus:ring-0" aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <li key={cartItem.tokenName}>
      <div className="group  relative">
        <div className="flex items-center py-6 px-5 group-hover:bg-gray-50">
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

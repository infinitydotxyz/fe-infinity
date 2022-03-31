import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import { MinusCircleIcon } from '@heroicons/react/solid';
import { BigNumberish } from 'ethers';
import { nowSeconds } from '@infinityxyz/lib/utils';
import { TextInput, Spacer, Button, DateInput } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';

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

  const header = (
    <div className="p-6">
      <div className="flex items-start justify-between">
        <Dialog.Title className="text-lg font-medium text-gray-900">{title}</Dialog.Title>
        <div className="ml-3 flex h-7 items-center">
          <Button variant="outline" onClick={onClose}>
            <span className="sr-only">Close panel</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );

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
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="z-50 fixed inset-0 overflow-hidden" onClose={onClose}>
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0" />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="pointer-events-auto w-screen max-w-md">
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  {header}
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
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
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
      className="rounded-md bg-white text-gray-400 hover:text-theme-light-3000 focus:ring-2 focus:ring-indigo-500"
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

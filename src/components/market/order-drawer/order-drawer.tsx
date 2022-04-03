import { Spacer, Divider, Button, Drawer } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { parseEther } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { useAppContext } from 'src/utils/context/AppContext';
import { OrderBuilder } from './order-builder';
import { OrderSummary } from './order-summary';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrderDrawer({ open, onClose }: Props) {
  const {
    clearCartItems,
    setOrder,
    isCartEmpty,
    isOrderEmpty,
    isOrderBuilderEmpty,
    startPrice,
    endPrice,
    startTime,
    endTime,
    numItems
  } = useOrderContext();
  const { user, chainId } = useAppContext();

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

      setOrder(order);

      // clear out items
      clearCartItems();
    }, 'Add order to cart');

    contents = (
      <>
        <div className="flex flex-col px-6 space-y-2">
          <OrderBuilder />
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
        <div className="flex flex-col px-6 space-y-2">
          <OrderSummary />
        </div>

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

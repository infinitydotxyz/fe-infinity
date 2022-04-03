import { Spacer, Divider, Button, Drawer } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { useAppContext } from 'src/utils/context/AppContext';
import { OrderBuilder } from './order-builder';
import { OrderSummary } from './order-summary';
import { SimpleTable } from './simple-table';
import { EthPrice } from 'src/components/common/eth-price';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrderDrawer({ open, onClose }: Props) {
  const { user, chainId } = useAppContext();

  const {
    setOrder,
    isCartEmpty,
    isOrderStateEmpty,
    isOrderBuilderEmpty,
    executeOrder,
    order,
    startPrice,
    endPrice,
    startTime,
    endTime,
    numItems
  } = useOrderContext();

  const emptyCart = (
    <div className={'flex   h-full   justify-center content-center items-center text-sm'}>
      <div className={'text-center'}>
        <span className="text-lg font-semibold">Cart is empty</span>
        <br />
        Add an item to the order.
      </div>
    </div>
  );

  const buildFooter = (buttonClick: () => void) => {
    let buttonTitle = 'Add order to cart';
    let topWidget;

    if (!isCartEmpty()) {
      buttonTitle = 'Checkout';

      const items = [];

      items.push({
        title: 'Max budget',
        value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
      });
      items.push({ title: 'Number of NFTs', value: <div>{order?.numItems}</div> });

      topWidget = (
        <div className="mb-6 w-full px-6">
          <SimpleTable items={items} />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center mb-4">
        <Divider />

        {topWidget}
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

  if (isOrderStateEmpty()) {
    contents = emptyCart;
  } else if (!isCartEmpty()) {
    // ready to checkout, we have an order
    title = 'Cart';
    footer = buildFooter(() => {
      executeOrder();
    });

    contents = (
      <>
        <div className="flex flex-col px-6 space-y-2">
          <OrderSummary />
        </div>

        <div className="flex  justify-center items-center mt-4">
          <Button variant="ghost" size="small" onClick={() => setOrder(undefined)}>
            Remove from Cart
          </Button>
        </div>
        <Spacer />

        {footer}
      </>
    );
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
    });

    contents = (
      <>
        <div className="flex flex-col px-6 space-y-2">
          <OrderBuilder />
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

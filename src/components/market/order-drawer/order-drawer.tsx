import { Spacer, Divider, Button, Drawer, SimpleTable, SimpleModal } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ExecParams, ExtraParams, Item, OBOrder } from '@infinityxyz/lib/types/core';
import { useAppContext } from 'src/utils/context/AppContext';
import { OrderBuilder } from './order-builder';
import { OrderSummary } from './order-summary';
import { EthPrice } from 'src/components/common/eth-price';
import { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { TooltipSpec } from 'src/components/common/tool-tip';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function OrderDrawer({ open, onClose }: Props) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { user, chainId } = useAppContext();

  const {
    isSellOrderCart,
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
    numItems,
    cartItems
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

      if (isSellOrderCart()) {
        items.push({
          title: 'Min total sale price',
          value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
        });
        items.push({ title: 'Max NFTs to sell', value: <div>{order?.numItems}</div> });
      } else {
        items.push({
          title: 'Max spending',
          value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
        });
        items.push({ title: 'Min NFTs to buy', value: <div>{order?.numItems}</div> });
      }

      topWidget = (
        <div className="mb-6 w-full px-8">
          <SimpleTable items={items} />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center mb-8">
        <Divider className="mb-8" />

        {topWidget}
        <Button onClick={buttonClick}>{buttonTitle}</Button>
      </div>
    );
  };

  const getItems = (): Item[] => {
    const items: Item[] = [];

    for (const cartItem of cartItems) {
      items.push({
        tokenIds: [cartItem.tokenId ?? '????'],
        collection: cartItem.collectionAddress
      });
    }

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
  let tooltip: TooltipSpec | undefined;

  if (isOrderStateEmpty()) {
    contents = emptyCart;
  } else if (!isCartEmpty()) {
    // ready to checkout, we have an order
    title = 'Cart';
    tooltip = { title: '(tooltip goes here)', content: '(tooltip goes here)' };
    footer = buildFooter(() => {
      if (executeOrder()) {
        setShowSuccessModal(true);
      }
    });

    contents = (
      <>
        <div className="flex flex-col px-8 space-y-2">
          <OrderSummary />
        </div>

        <Spacer />

        {footer}
      </>
    );
  } else if (!isOrderBuilderEmpty()) {
    // an order is being built, so let them finish it
    title = isSellOrderCart() ? 'Sell Order' : 'Buy order';
    tooltip = isSellOrderCart()
      ? { title: 'Sell order', content: 'Selected NFT(s) will be automatically sold when there’s a matching buy order' }
      : {
          title: 'Buy order',
          content:
            'Any NFT(s) from selected collections will be automatically bought when there’s a matching sell order'
        };
    footer = buildFooter(() => {
      const order: OBOrder = {
        id: '????',
        chainId: chainId,
        isSellOrder: isSellOrderCart(),
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
        <div className="flex flex-col px-8 space-y-2">
          <OrderBuilder />
        </div>

        <Spacer />

        {footer}
      </>
    );
  }

  return (
    <>
      <SimpleModal
        dialogWidth="max-w-sm"
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        showActionButtons={false}
        titleChildren={
          <div>
            <AiOutlineCheckCircle className="h-12 w-12" />
          </div>
        }
      >
        <div className="flex flex-col modal-body p-4 rounded-3xl">
          <div className="font-bold text-xlg">Thank you,</div>
          <div className="font-bold mb-6 text-xlg">Order Submitted</div>
          <div>Confirmation: 234234</div>
          <Button className="mt-6" onClick={() => setShowSuccessModal(false)}>
            Done
          </Button>
        </div>
      </SimpleModal>

      <Drawer open={open} onClose={onClose} title={title} tooltip={tooltip}>
        {contents}
      </Drawer>
    </>
  );
}

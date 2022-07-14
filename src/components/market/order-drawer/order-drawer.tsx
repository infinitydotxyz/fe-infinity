import {
  Spacer,
  Divider,
  TooltipSpec,
  EthPrice,
  Button,
  Drawer,
  SimpleTable,
  Modal,
  Dropdown
} from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderBuilder } from './order-builder';
import { OrderSummary } from './order-summary';
import { useState } from 'react';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { numStr } from 'src/utils';
import { useRouter } from 'next/router';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const OrderDrawer = ({ open, onClose }: Props) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [showConfirmClear, setShowConfirmClear] = useState(false);
  const router = useRouter();

  const {
    isSellOrderCart,
    addOrderToCart,
    cancelOrder,
    readyToCheckout,
    isOrderStateEmpty,
    isOrderBuilderEmpty,
    executeOrder,
    ordersInCart,
    removeAllOrders,
    isEditingOrder,
    isCollectionsCart,
    cartItems,
    setOrderDrawerOpen
  } = useOrderContext();

  const emptyCart = (
    <div className="flex h-full justify-center content-center items-center text-sm">
      <div className="text-center">
        <span className="text-lg font-semibold">Cart is empty</span>
        <br />
        Add an item to the order.
        <div className="flex flex-row gap-2 py-2 w-full h-full mt-5">
          <Button
            size="large"
            onClick={() => {
              setOrderDrawerOpen(false);
              router.push('/marketplace?tab=Orders');
            }}
            className="font-heading w-full h-full"
          >
            Buy
          </Button>
          <Button
            size="large"
            variant="outline"
            onClick={() => {
              setOrderDrawerOpen(false);
              router.push('/marketplace?tab=List%20NFTs');
            }}
            className="font-heading w-full h-full"
          >
            Sell
          </Button>
        </div>
      </div>
    </div>
  );

  const buildFooter = (buttonClick: () => void) => {
    let buttonTitle = 'Add to cart';
    let topWidget;

    if (readyToCheckout()) {
      if (isSellOrderCart()) {
        buttonTitle = 'Complete listing';
      } else {
        buttonTitle = 'Place Orders';
      }

      const items = [];

      let totalEth = 0;
      let totalNFTs = 0;

      for (const orderInCart of ordersInCart) {
        totalEth = totalEth + orderInCart.orderSpec.endPriceEth;
        totalNFTs = totalNFTs + orderInCart.orderSpec.numItems;
      }

      if (isSellOrderCart()) {
        items.push({
          title: 'Min total sale price',
          value: <EthPrice label={`${totalEth}`} />
        });
        items.push({ title: 'Max NFTs to sell', value: <div>{totalNFTs.toString()}</div> });
      } else {
        items.push({
          title: 'Max budget',
          value: <EthPrice label={numStr(totalEth)} />
        });
        items.push({ title: 'Min NFTs to buy', value: <div>{totalNFTs.toString()}</div> });
      }

      topWidget = <SimpleTable items={items} className="mb-6  px-12" />;
    } else {
      if (isEditingOrder) {
        buttonTitle = 'Update order';
      }
    }
    const showCancel = buttonTitle === 'Complete listing' || buttonTitle === 'Place Orders' ? false : true;

    return (
      <div className="flex flex-col mb-8">
        <Divider className="mb-10" />

        {topWidget}
        <div className="px-12 mb-4 w-full flex space-x-2">
          {showCancel === true ? (
            <>
              {isEditingOrder ? (
                <Button variant="outline" size="large" className="font-heading w-1/2" onClick={buttonClick}>
                  Back to cart
                </Button>
              ) : (
                <Button variant="outline" size="large" className="font-heading w-1/2" onClick={() => cancelOrder()}>
                  Cancel
                </Button>
              )}
            </>
          ) : null}

          <>
            {/* {showCancel === false ? (
              <Button
                size="large"
                variant="outline"
                onClick={() => {
                  setOrderDrawerOpen(false);
                }}
              >
                Continue shopping
              </Button>
            ) : null} */}
            <Button size="large" className={`font-heading ${showCancel ? 'w-1/2' : 'w-full'}`} onClick={buttonClick}>
              {buttonTitle}
            </Button>
          </>
        </div>
      </div>
    );
  };

  let contents;
  let title = 'Create order';
  let subtitle = '';
  let footer;
  let tooltip: TooltipSpec | undefined;

  if (isOrderStateEmpty()) {
    contents = emptyCart;
  } else if (readyToCheckout()) {
    // ready to checkout, we have an order
    title = 'Cart';
    tooltip = { title: '', content: '' }; // todo: (tooltip goes here)
    footer = buildFooter(async () => {
      if (await executeOrder()) {
        setShowSuccessModal(true);
      }
    });

    contents = (
      <>
        <div className="flex flex-col px-12 space-y-2">
          <OrderSummary />
        </div>

        <Spacer />

        {footer}
      </>
    );
  } else if (!isOrderBuilderEmpty()) {
    // an order is being built, so let them finish it

    let content = '';
    if (isSellOrderCart()) {
      title = 'Sell order';

      if (isCollectionsCart()) {
        content = ''; // not supported
      } else {
        // content = 'Selected NFT(s) will be automatically sold when there’s a matching buy order';

        if (cartItems.length > 1) {
          content = "We'll sell one of these for the min price listed";
          subtitle = content;
        } else {
          content = "We'll sell this NFT for the min price listed";
          // subtitle = content;
        }
      }
    } else {
      title = isCollectionsCart() ? 'Collection Offer' : 'Buy order';

      if (isCollectionsCart()) {
        content =
          'Any NFT(s) from selected collections will be automatically bought when there’s a matching sell order';
      } else {
        if (cartItems.length > 1) {
          content = "We'll buy the first one that becomes available for sale within your budget";
          subtitle = content;
        } else {
          content = "We'll by the NFT when it becomes available for sale within your budget";
          // subtitle = content;
        }
      }
    }

    // tooltip = { title: title, content: content };

    footer = buildFooter(() => {
      addOrderToCart();
    });

    contents = (
      <>
        <div className="flex flex-col px-12 space-y-2">
          <OrderBuilder />
        </div>

        <Spacer />

        {footer}
      </>
    );
  }

  return (
    <>
      {showSuccessModal && (
        <Modal
          wide={false}
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          cancelButton="" // hides cancel
          okButton="Done"
          title={
            <div className="w-full flex justify-center">
              <AiOutlineCheckCircle className="h-12 w-12" />
            </div>
          }
        >
          <div className="flex flex-col text-center">
            <div className="font-bold text-xlg">Thank you,</div>
            <div className="font-bold mb-6 text-xlg">Order(s) submitted</div>
          </div>
        </Modal>
      )}

      <Drawer
        open={open}
        onClose={onClose}
        subtitle={subtitle}
        title={
          <div className="flex items-center">
            <span>{title}</span>
            {ordersInCart.length > 0 || cartItems.length > 0 ? (
              <>
                <span className="ml-2 font-normal text-sm w-8 h-8 flex items-center justify-center rounded-full bg-theme-gray-100">
                  {cartItems.length > 0 ? cartItems.length : ordersInCart.length}
                </span>
                <Dropdown
                  label="Dropdown"
                  toggler={<span className="ml-2 font-normal text-sm underline cursor-pointer">Clear</span>}
                  items={[
                    {
                      label: 'Confirm',
                      onClick: () => {
                        removeAllOrders();
                      }
                    },
                    { label: 'Cancel', onClick: console.log }
                  ]}
                  className="text-sm"
                  itemListClassName="flex"
                  itemClassName="px-0 justify-center"
                />
              </>
            ) : null}
          </div>
        }
        tooltip={tooltip?.content ? tooltip : undefined}
      >
        {contents}
      </Drawer>

      {/* todo: this doesn't work (conflicted: Modal & Drawer?)
      {showConfirmClear ? (
        <Modal
          isOpen={showConfirmClear}
          onClose={() => setShowConfirmClear(false)}
          okButton="Confirm"
          onOKButton={() => removeAllOrders()}
        >
          Clear all orders?
        </Modal>
      ) : null} */}
    </>
  );
};

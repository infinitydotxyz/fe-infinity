import { EthPrice, Button, SimpleTable, SimpleTableItem, Spacer, SVG } from 'src/components/common';
import { shortDate } from 'src/utils';
import { OrderInCart, useOrderContext } from 'src/utils/context/OrderContext';
import { TitleAndSubtitle } from './order-list-item';
import { collectionIconHeight, collectionIconStyle, collectionIconWidthInPx, iconButtonStyle } from './ui-constants';

export const OrderSummary = () => {
  const { ordersInCart } = useOrderContext();

  const orderDivs = [];

  for (const orderInCart of ordersInCart) {
    orderDivs.push(<OrderSummaryItem key={orderInCart.id} orderInCart={orderInCart} />);
  }

  return <div className="space-y-6">{orderDivs}</div>;
};

// =======================================================================

interface Props {
  orderInCart: OrderInCart;
}

export const OrderSummaryItem = ({ orderInCart }: Props) => {
  const { isSellOrderCart, editOrderFromCart } = useOrderContext();

  const collectionStackForOrder = () => {
    let leftOffset = 0;

    const iconStack = orderInCart.cartItems.map((item, index) => {
      const whiteBoxLeft = leftOffset;
      const iconLeft = leftOffset + (index === 0 ? 0 : 2);

      leftOffset = iconLeft + 4;

      let image = item.tokenImage;
      if (!image) {
        image = item.collectionImage;
      }

      return (
        <div key={item.collectionAddress + '-icons'}>
          <div className={`absolute ${collectionIconStyle} bg-white`} style={{ left: whiteBoxLeft }} />
          <img className={`absolute ${collectionIconStyle}`} src={image} alt="" style={{ left: iconLeft }} />
        </div>
      );
    });

    return iconStack;
  };

  const tokenStackForOrder = () => {
    if (orderInCart.cartItems.length > 0) {
      const item = orderInCart.cartItems[0];

      let image = item.collectionImage;
      if (!image) {
        image = item.tokenImage;
      }

      return (
        <div className={'relative '}>
          <img className={`absolute ${collectionIconStyle}`} src={image} alt="" />
          <div className="absolute -top-1 right-0 z-50 text-center shadow-lg rounded-full h-6 w-6 bg-white">
            {orderInCart.cartItems.length}
          </div>
        </div>
      );
    }

    return null;
  };

  const collectionIconsForOrder = () => {
    const numCollectionsSuffix = orderInCart.cartItems.length > 1 ? 'Collections' : 'Collection';
    const iconWidth = collectionIconWidthInPx();

    const collectionsOrder = false;

    let icon;
    let info;

    if (collectionsOrder) {
      icon = collectionStackForOrder();
      info = <div className="ml-4 font-bold">{`${orderInCart.cartItems.length} ${numCollectionsSuffix}`}</div>;
    } else {
      icon = tokenStackForOrder();

      if (orderInCart.cartItems.length > 0) {
        const item = orderInCart.cartItems[0];

        info = <TitleAndSubtitle title={item.tokenName ?? ''} subtitle={'@' + item.collectionName} />;
      }
    }

    return (
      <div className={`relative ${collectionIconHeight} mb-4 w-full flex items-center`}>
        <div
          className={`${collectionIconHeight}`}
          style={{ width: `${iconWidth + (orderInCart.cartItems.length - 1) * 4}px` }}
        >
          {icon}
        </div>

        {info}

        <Spacer />

        <Button variant="ghost" size="small" onClick={() => editOrderFromCart(orderInCart.id)}>
          <SVG.editCircle className={iconButtonStyle} />
        </Button>
      </div>
    );
  };

  const tableItemsForOrder = (orderInCart: OrderInCart): SimpleTableItem[] => {
    const items: SimpleTableItem[] = [];

    if (isSellOrderCart()) {
      items.push({
        title: 'Max budget',
        value: <EthPrice label={orderInCart.orderSpec.endPriceEth.toString()} />
      });
      items.push({ title: 'Min NFTs to buy', value: <div>{orderInCart.orderSpec.numItems.toString()}</div> });
      items.push({
        title: 'Expiration Date',
        value: <div>{shortDate(new Date(orderInCart.orderSpec.endTimeMs))}</div>
      });
    } else {
      items.push({
        title: 'Max budget',
        value: <EthPrice label={orderInCart.orderSpec.endPriceEth.toString()} />
      });
      items.push({ title: 'Min NFTs to buy', value: <div>{orderInCart.orderSpec.numItems.toString()}</div> });
      items.push({
        title: 'Expiration Date',
        value: <div>{shortDate(new Date(orderInCart.orderSpec.endTimeMs ?? 0))}</div>
      });
    }

    return items;
  };

  return (
    <>
      {collectionIconsForOrder()}
      <SimpleTable items={tableItemsForOrder(orderInCart)} />
    </>
  );
};

import { RiEditCircleFill } from 'react-icons/ri';
import { EthPrice, Button, SimpleTable, SimpleTableItem, Spacer } from 'src/components/common';
import { shortDate } from 'src/utils';
import { OrderInCart, useOrderContext } from 'src/utils/context/OrderContext';
import { collectionIconHeight, collectionIconStyle, collectionIconWidthInPx, iconButtonStyle } from './ui-constants';

export function OrderSummary() {
  const { isSellOrderCart, ordersInCart, editOrderFromCart } = useOrderContext();

  const iconStackForOrder = (orderInCart: OrderInCart) => {
    let leftOffset = 0;
    const iconStack = orderInCart.cartItems.map((item, index) => {
      const whiteBoxLeft = leftOffset;
      const iconLeft = leftOffset + (index === 0 ? 0 : 2);

      leftOffset = iconLeft + 4;

      // a collection or a token image
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

  const collectionIconsForOrder = (orderInCart: OrderInCart) => {
    const numCollectionsSuffix = orderInCart.cartItems.length > 1 ? 'Collections' : 'Collection';
    const iconWidth = collectionIconWidthInPx();

    return (
      <div className={`relative ${collectionIconHeight} mb-4 w-full flex items-center`}>
        <div
          className={`${collectionIconHeight}`}
          style={{ width: `${iconWidth + (orderInCart.cartItems.length - 1) * 4}px` }}
        >
          {iconStackForOrder(orderInCart)}
        </div>

        <div className="ml-4 font-bold">{`${orderInCart.cartItems.length} ${numCollectionsSuffix}`}</div>

        <Spacer />

        <Button variant="ghost" size="small" onClick={() => editOrderFromCart(orderInCart.id)}>
          <RiEditCircleFill className={iconButtonStyle} />
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

  const orderDivs = [];

  for (const orderInCart of ordersInCart) {
    orderDivs.push(
      <div key={orderInCart.id}>
        {collectionIconsForOrder(orderInCart)}
        <SimpleTable items={tableItemsForOrder(orderInCart)} />
        <div className="h-6" />
      </div>
    );
  }

  return <>{orderDivs}</>;
}

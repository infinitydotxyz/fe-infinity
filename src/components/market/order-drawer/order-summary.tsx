import { formatEther } from 'ethers/lib/utils';
import { RiEditCircleFill } from 'react-icons/ri';
import { Button, SimpleTable, SimpleTableItem, Spacer } from 'src/components/common';
import { EthPrice } from 'src/components/common/eth-price';
import { shortDate } from 'src/utils';
import { OrderInCart, useOrderContext } from 'src/utils/context/OrderContext';
import { bigNumToDate } from 'src/utils/marketUtils';
import { collectionIconHeight, collectionIconStyle, collectionIconWidthInPx, iconButtonStyle } from './ui-constants';

export function OrderSummary() {
  const { isSellOrderCart, ordersInCart, editOrderFromCart } = useOrderContext();

  const iconStackForOrder = (orderInCart: OrderInCart) => {
    let leftOffset = 0;
    const iconStack = orderInCart.cartItems.map((item, index) => {
      const whiteBoxLeft = leftOffset;
      const iconLeft = leftOffset + (index === 0 ? 0 : 2);

      leftOffset = iconLeft + 4;

      return (
        <div key={item.collectionAddress + '-icons'}>
          <div className={`absolute ${collectionIconStyle} bg-white`} style={{ left: whiteBoxLeft }} />
          <img className={`absolute ${collectionIconStyle}`} src={item.imageUrl} alt="" style={{ left: iconLeft }} />
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
        value: <EthPrice label={formatEther(orderInCart.order.endPrice ?? 0)} />
      });
      items.push({ title: 'Min NFTs to buy', value: <div>{orderInCart.order.numItems}</div> });
      items.push({ title: 'Expiration Date', value: <div>{shortDate(bigNumToDate(orderInCart.order.endTime))}</div> });
    } else {
      items.push({
        title: 'Max budget',
        value: <EthPrice label={formatEther(orderInCart.order.endPrice ?? 0)} />
      });
      items.push({ title: 'Min NFTs to buy', value: <div>{orderInCart.order.numItems}</div> });
      items.push({
        title: 'Expiration Date',
        value: <div>{shortDate(bigNumToDate(orderInCart.order.endTime ?? 0))}</div>
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

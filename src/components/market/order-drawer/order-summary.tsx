import { EthPrice, Button, SimpleTable, SimpleTableItem, Spacer, SVG, NftImage, EZImage } from 'src/components/common';
import { shortDate } from 'src/utils';
import { OrderInCart, useOrderContext } from 'src/utils/context/OrderContext';
import { TitleAndSubtitle } from './order-list-item';
import {
  collectionIconHeight,
  collectionIconStyle,
  collectionIconWidthInPx,
  iconButtonStyle
} from 'src/utils/ui-constants';
import { useAppContext } from 'src/utils/context/AppContext';
// import { TiDeleteOutline } from 'react-icons/ti';

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
  const { chainId } = useAppContext();
  const { isSellOrderCart, editOrderFromCart } = useOrderContext();

  const collectionStackForOrder = () => {
    let leftOffset = 0;

    const iconStack = orderInCart.cartItems.map((item, index) => {
      const whiteBoxLeft = leftOffset;
      const iconLeft = leftOffset + (index === 0 ? 0 : 2);

      leftOffset = iconLeft + 4;

      let imageSrc = item.tokenImage;
      if (!imageSrc) {
        imageSrc = item.collectionImage;
      }

      return (
        <div key={item.collectionAddress + '-icons'}>
          <div className={`absolute  ${collectionIconStyle} bg-white`} style={{ left: whiteBoxLeft }} />
          <img className={`absolute ${collectionIconStyle}`} src={imageSrc} alt="" style={{ left: iconLeft }} />
        </div>
      );
    });

    return iconStack;
  };

  const tokenStackForOrder = () => {
    if (orderInCart.cartItems.length > 0) {
      const item = orderInCart.cartItems[0];
      const showNum = orderInCart.cartItems.length > 1;

      let imageEl = <NftImage chainId={chainId} collectionAddress={item.collectionAddress} className="rounded-2xl" />;
      if (!showNum) {
        imageEl = <EZImage className={collectionIconStyle} src={item.tokenImage} />;
      }

      return (
        <div className="relative">
          {imageEl}

          {showNum && (
            <div className="absolute top-0 right-0 z-50 text-center shadow-lg rounded-full h-6 w-6 bg-white">
              {orderInCart.cartItems.length}
            </div>
          )}

          {/* <div
            className="absolute bottom-0 right-0 z-50 text-center shadow-lg rounded-full cursor-pointer hover:bg-gray-100 bg-white"
            title="Remove order"
            onClick={() => {
              removeOrder(orderInCart);
            }}
          >
            <TiDeleteOutline />
          </div> */}
        </div>
      );
    }

    return null;
  };

  const isCollectionsOrder = () => {
    for (const x of orderInCart.cartItems) {
      if (!x.tokenId) {
        return true;
      }
    }

    return false;
  };

  const collectionIconsForOrder = () => {
    const numCollectionsSuffix = orderInCart.cartItems.length > 1 ? 'Collections' : 'Collection';
    const iconWidth = collectionIconWidthInPx();

    const collectionsOrder = isCollectionsOrder();

    let icon;
    let info;

    if (collectionsOrder) {
      icon = collectionStackForOrder();
      info = <div className="ml-4 font-bold">{`${orderInCart.cartItems.length} ${numCollectionsSuffix}`}</div>;
    } else {
      icon = tokenStackForOrder();

      if (orderInCart.cartItems.length > 0) {
        const item = orderInCart.cartItems[0];
        const tokenId = orderInCart.cartItems.length === 1 ? item.tokenId : '';

        info = <TitleAndSubtitle title={item.collectionName} subtitle={tokenId} />;
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

        <Button variant="round" size="plain" onClick={() => editOrderFromCart(orderInCart.id)}>
          <SVG.editCircle className={iconButtonStyle} />
        </Button>
      </div>
    );
  };

  const tableItemsForOrder = (orderInCart: OrderInCart): SimpleTableItem[] => {
    const items: SimpleTableItem[] = [];

    if (isSellOrderCart()) {
      items.push({
        title: 'Min list price',
        value: <EthPrice label={orderInCart.orderSpec.endPriceEth.toString()} />
      });
      items.push({
        title: 'Expiration date',
        value: <div>{shortDate(new Date(orderInCart.orderSpec.endTimeMs))}</div>
      });
    } else {
      items.push({
        title: 'Max budget',
        value: <EthPrice label={orderInCart.orderSpec.endPriceEth.toString()} />
      });
      if (isCollectionsOrder()) {
        items.push({ title: 'Min NFTs to buy', value: <div>{orderInCart.orderSpec.numItems.toString()}</div> });
      }
      items.push({
        title: 'Expiration date',
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

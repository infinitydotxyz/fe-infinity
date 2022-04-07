import { formatEther } from 'ethers/lib/utils';
import { RiEditCircleFill } from 'react-icons/ri';
import { Button, SimpleTable, SimpleTableItem, Spacer } from 'src/components/common';
import { EthPrice } from 'src/components/common/eth-price';
import { shortDate } from 'src/utils';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { bigNumToDate } from 'src/utils/marketUtils';
import { collectionIconHeight, collectionIconStyle, collectionIconWidthInPx, iconButtonStyle } from './ui-constants';

export function OrderSummary() {
  const { isSellOrderCart, cartItems, setOrder, order } = useOrderContext();

  let leftOffset = 0;
  const iconStack = cartItems.map((item, index) => {
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

  const numCollectionsSuffix = cartItems.length > 1 ? 'Collections' : 'Collection';
  const iconWidth = collectionIconWidthInPx();

  const collectionIcons = (
    <div className={`relative ${collectionIconHeight} mb-4 w-full flex items-center`}>
      <div className={`${collectionIconHeight}`} style={{ width: `${iconWidth + (cartItems.length - 1) * 4}px` }}>
        {iconStack}
      </div>

      <div className="ml-4 font-bold">{`${cartItems.length} ${numCollectionsSuffix}`}</div>

      <Spacer />

      <Button variant="ghost" size="small" onClick={() => setOrder(undefined)}>
        <RiEditCircleFill className={iconButtonStyle} />
      </Button>
    </div>
  );

  const items: SimpleTableItem[] = [];

  if (isSellOrderCart()) {
    items.push({
      title: 'Max spending',
      value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
    });
    items.push({ title: 'Min NFTs to buy', value: <div>{order?.numItems}</div> });
    // items.push({ title: 'Start Date', value: <div>{bigNumToDate(order?.startTime ?? 0).toLocaleString()}</div> });
    items.push({ title: 'Expiration Date', value: <div>{shortDate(bigNumToDate(order?.endTime ?? 0))}</div> });
  } else {
    items.push({
      title: 'Max spending',
      value: <EthPrice label={formatEther(order?.endPrice ?? 0)} />
    });
    items.push({ title: 'Min NFTs to buy', value: <div>{order?.numItems}</div> });
    // items.push({ title: 'Start Date', value: <div>{bigNumToDate(order?.startTime ?? 0).toLocaleString()}</div> });
    items.push({ title: 'Expiration Date', value: <div>{shortDate(bigNumToDate(order?.endTime ?? 0))}</div> });
  }

  return (
    <>
      {collectionIcons}
      <SimpleTable items={items} />
    </>
  );
}

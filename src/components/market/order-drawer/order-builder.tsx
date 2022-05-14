import { TextInputBox, Spacer, DatePickerBox } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderListItem } from './order-list-item';

export const OrderBuilder = () => {
  const {
    cartItems,
    isCollectionsCart,
    isSellOrderCart,
    price,
    setPrice,
    expirationDate,
    setExpirationDate,
    numItems,
    setNumItems
  } = useOrderContext();

  const list = (
    <div className="overflow-y-auto flex flex-col space-y-3 mb-8">
      {cartItems.map((item) => (
        <OrderListItem
          key={`${item.tokenName} ${item.collectionAddress} ${item.tokenId}`}
          cartItem={item}
          allowDelete={true}
        />
      ))}
    </div>
  );

  const numItemsField = () => {
    let label = 'Min NFTs to buy';
    let tooltip = {
      title: label,
      content: 'The min number you want to buy from the collections listed in the order'
    };

    if (isSellOrderCart()) {
      label = 'Max NFTs to sell';

      tooltip = {
        title: label,
        content: 'The max number you want to sell from the collections listed in the order'
      };
    }

    return (
      <TextInputBox
        type="number"
        placeholder="4"
        label={label}
        value={numItems.toString()}
        onChange={(value) => setNumItems(parseInt(value))}
        tooltip={tooltip}
      />
    );
  };

  const priceField = () => {
    const multiple = cartItems.length > 1;

    let label = multiple ? 'Max budget' : 'Max budget';
    let tooltip = {
      title: label,
      content: '' // todo: tooltip goes here
    };

    if (isSellOrderCart()) {
      label = multiple ? 'Min combined price' : 'Min price';

      tooltip = {
        title: label,
        content: '' // todo: tooltip goes here
      };
    }

    return (
      <TextInputBox
        type="number"
        value={price.toString()}
        placeholder="2.33"
        addEthSymbol={true}
        label={label}
        onChange={(value) => setPrice(parseFloat(value))}
        tooltip={tooltip}
      />
    );
  };

  const expirationDateField = () => {
    return (
      <DatePickerBox
        label="Expiration Date"
        value={new Date(parseInt(expirationDate.toString()))}
        onChange={(date) => {
          setExpirationDate(date.getTime() / 1000);
        }}
      />
    );
  };

  let contents;
  let footer;

  if (isSellOrderCart()) {
    contents = (
      <>
        {list}
        <div className="flex flex-col space-y-3">
          {priceField()}
          {expirationDateField()}
        </div>

        <Spacer />

        {footer}
      </>
    );
  } else {
    contents = (
      <>
        {list}
        <div className="flex flex-col space-y-3">
          {priceField()}
          {isCollectionsCart() && numItemsField()}
          {expirationDateField()}
        </div>

        <Spacer />

        {footer}
      </>
    );
  }

  return contents;
};

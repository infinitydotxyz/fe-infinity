import { TextInputBox, Spacer, DatePickerBox } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderListItem } from './order-list-item';

export function OrderBuilder() {
  const { cartItems, isSellOrderCart, price, setPrice, expirationDate, setExpirationDate, numItems, setNumItems } =
    useOrderContext();

  const list = (
    <div className="overflow-y-auto">
      {cartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={true} />
      ))}
    </div>
  );

  const numItemsField = () => {
    let label = 'Min NFTs to buy';
    if (isSellOrderCart()) {
      label = 'Max NFTs to sell';
    }

    return (
      <TextInputBox
        type="number"
        placeholder="4"
        label={label}
        value={numItems.toString()}
        onChange={(value) => setNumItems(parseInt(value))}
        tooltip={{
          title: 'Min nuber to buy',
          content: 'The min number you want to buy from the collections listed in the order'
        }}
      />
    );
  };

  const priceField = () => {
    return (
      <TextInputBox
        type="number"
        value={price.toString()}
        placeholder="2.33"
        addEthSymbol={true}
        label="Start Price"
        onChange={(value) => setPrice(parseFloat(value))}
        tooltip={{
          title: 'Tooltip title',
          content: 'tooltip goes here'
        }}
      />
    );
  };

  const expirationDateField = () => {
    return (
      <DatePickerBox
        label="End Time"
        value={new Date(parseInt(expirationDate.toString()) * 1000)}
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
        <div className="flex flex-col space-y-2">
          {numItemsField()}
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
        <div className="flex flex-col space-y-2">
          {numItemsField()}
          {priceField()}
          {expirationDateField()}
        </div>

        <Spacer />

        {footer}
      </>
    );
  }

  return contents;
}

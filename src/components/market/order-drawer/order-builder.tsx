import { TextInputBox, Spacer, DatePickerBox } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderListItem } from './order-list-item';

export function OrderBuilder() {
  const {
    cartItems,
    isSellOrderCart,
    startPrice,
    setStartPrice,
    endPrice,
    setEndPrice,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    numItems,
    setNumItems
  } = useOrderContext();

  const list = (
    <div className="overflow-y-auto">
      {cartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={true} />
      ))}
    </div>
  );

  const numItemsField = (
    <TextInputBox
      type="number"
      placeholder="4"
      label="Num Items"
      value={numItems.toString()}
      onChange={(value) => setNumItems(parseInt(value))}
    />
  );

  const startPriceField = (
    <TextInputBox
      type="number"
      value={startPrice.toString()}
      placeholder="2.33"
      addEthSymbol={true}
      label="Start Price"
      onChange={(value) => setStartPrice(parseFloat(value))}
    />
  );

  const endPriceField = (
    <TextInputBox
      type="number"
      value={endPrice.toString()}
      placeholder="2.33"
      addEthSymbol={true}
      label="End Price"
      onChange={(value) => setEndPrice(parseFloat(value))}
    />
  );

  const startTimeField = (
    <DatePickerBox
      label="Start Time"
      value={new Date(parseInt(startTime.toString()) * 1000)}
      onChange={(date) => {
        setStartTime(date.getTime() / 1000);
      }}
    />
  );

  const endTimeField = (
    <DatePickerBox
      label="End Time"
      value={new Date(parseInt(endTime.toString()) * 1000)}
      onChange={(date) => {
        setEndTime(date.getTime() / 1000);
      }}
    />
  );

  let contents;
  let footer;

  if (isSellOrderCart()) {
    contents = (
      <>
        {list}
        <div className="flex flex-col space-y-2">
          {numItemsField}
          {startPriceField}
          {endPriceField}
          {startTimeField}
          {endTimeField}
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
          {numItemsField}
          {startPriceField}
          {endPriceField}
          {startTimeField}
          {endTimeField}
        </div>

        <Spacer />

        {footer}
      </>
    );
  }

  return contents;
}

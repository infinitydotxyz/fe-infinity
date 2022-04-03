import { TextInputBox, Spacer, DatePickerBox } from 'src/components/common';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { OrderListItem } from './order-list-item';

export function OrderBuilder() {
  const {
    buyCartItems,
    sellCartItems,
    isSellOrder,
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
    <ul role="list" className="  divide-y divide-gray-200 overflow-y-auto">
      {buyCartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={true} />
      ))}

      {sellCartItems.map((item) => (
        <OrderListItem key={item.tokenName} cartItem={item} allowDelete={true} />
      ))}
    </ul>
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

  if (isSellOrder()) {
    contents = (
      <>
        {list}
        <div className="flex flex-col px-6 space-y-2">
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
        <div className="flex flex-col px-6 space-y-2">
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

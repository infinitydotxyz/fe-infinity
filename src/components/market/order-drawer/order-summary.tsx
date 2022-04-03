import { useOrderContext } from 'src/utils/context/OrderContext';

interface Props {
  open?: boolean;
}

export function OrderSummary({ open }: Props) {
  let contents;

  console.log(open);

  const { isSellOrder } = useOrderContext();

  if (isSellOrder()) {
    contents = (
      <div>
        <div>Max spending</div>
        <div>Min NFTs to buy</div>
        <div>Expiration Date</div>
      </div>
    );
  } else {
    contents = (
      <div>
        <div>Max spending</div>
        <div>Min NFTs to buy</div>
        <div>Expiration Date</div>
      </div>
    );
  }

  return contents;
}

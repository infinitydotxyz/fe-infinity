import { Button, SVG } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { collectionIconStyle, iconButtonStyle } from './ui-constants';

interface Props {
  cartItem: OrderCartItem;
  allowDelete: boolean;
}

export function OrderListItem({ cartItem, allowDelete }: Props) {
  const { removeCartItem } = useOrderContext();

  let deleteButton = <></>;

  if (allowDelete) {
    deleteButton = (
      <Button
        variant="ghost"
        size="small"
        onClick={() => {
          removeCartItem(cartItem);
        }}
      >
        <SVG.grayDelete className={iconButtonStyle} />
      </Button>
    );
  }

  let image = cartItem.tokenImage;
  if (!image) {
    image = cartItem.collectionImage;
  }

  return (
    <div className="flex items-center">
      <div className="flex min-w-0 flex-1 items-center">
        <span className="inline-block flex-shrink-0">
          <img className={`${collectionIconStyle}`} src={image} alt="" />
        </span>

        <div className="ml-4 truncate">
          <p className="truncate text-md font-bold text-gray-900">{cartItem.tokenName}</p>
          <p className="truncate text-sm text-gray-500">{'@' + cartItem.collectionName}</p>
        </div>
      </div>
      {deleteButton}
    </div>
  );
}

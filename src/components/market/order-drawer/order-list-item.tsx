import { MinusCircleIcon } from '@heroicons/react/solid';
import { Button } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { collectionIconStyle } from './ui-constants';

interface Props {
  cartItem: OrderCartItem;
  allowDelete: boolean;
}

export function OrderListItem({ cartItem, allowDelete }: Props) {
  const { removeBuyCartItem } = useOrderContext();

  let deleteButton = <></>;

  if (allowDelete) {
    deleteButton = (
      <Button
        variant="ghost"
        size="small"
        onClick={() => {
          removeBuyCartItem(cartItem);
        }}
      >
        <MinusCircleIcon className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <div key={cartItem.tokenName} className="mb-4">
      <div className="flex items-center">
        <div className="flex min-w-0 flex-1 items-center">
          <span className="inline-block flex-shrink-0">
            <img className={`${collectionIconStyle}`} src={cartItem.imageUrl} alt="" />
          </span>
          <div className="ml-4 truncate">
            <p className="truncate text-md font-bold text-gray-900">{cartItem.tokenName}</p>
            <p className="truncate text-sm text-gray-500">{'@' + cartItem.collectionName}</p>
          </div>
        </div>
        {deleteButton}
      </div>
    </div>
  );
}

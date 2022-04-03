import { MinusCircleIcon } from '@heroicons/react/solid';
import { Button } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';

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
    <li key={cartItem.tokenName}>
      <div className="group  relative">
        <div className="flex items-center py-6 px-5 group-hover:bg-theme-light-300">
          <div className="relative flex min-w-0 flex-1 items-center">
            <span className="relative inline-block flex-shrink-0">
              <img className="h-10 w-10 rounded-2xl" src={cartItem.imageUrl} alt="" />
            </span>
            <div className="ml-4 truncate">
              <p className="truncate text-sm font-medium text-gray-900">{cartItem.tokenName}</p>
              <p className="truncate text-sm text-gray-500">{'@' + cartItem.collectionName}</p>
            </div>
          </div>
          {deleteButton}
        </div>
      </div>
    </li>
  );
}

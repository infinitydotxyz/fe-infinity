import { ReactNode } from 'react';
import { Button, SVG } from 'src/components/common';
import { OrderCartItem, useOrderContext } from 'src/utils/context/OrderContext';
import { collectionIconStyle, iconButtonStyle } from './ui-constants';

interface Props {
  cartItem: OrderCartItem;
  allowDelete: boolean;
}

export function OrderListItem({ cartItem, allowDelete }: Props) {
  const { removeCartItem } = useOrderContext();

  let onDelete;
  if (allowDelete) {
    onDelete = () => removeCartItem(cartItem);
  }

  let image = cartItem.tokenImage;
  if (!image) {
    image = cartItem.collectionImage;
  }

  return (
    <div
    // Steve: debugging (will remove when done)
    // onClick={(e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   console.log(JSON.stringify(cartItem, null, '  '));
    // }}
    >
      <ImageAndText
        image={<img className={`${collectionIconStyle}`} src={image} alt="" />}
        title={cartItem.tokenName}
        subtitle={cartItem.collectionName}
        onClick={onDelete}
        buttonIcon={<SVG.grayDelete className={iconButtonStyle} />}
      />
    </div>
  );
}

// ===========================================================================

interface Props2 {
  image: ReactNode;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  buttonIcon?: ReactNode;
}

export function ImageAndText({ title, subtitle, image, buttonIcon, onClick }: Props2) {
  let deleteButton;

  if (onClick && buttonIcon) {
    deleteButton = (
      <Button variant="round" size="plain" onClick={onClick}>
        {buttonIcon}
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      <div className="flex min-w-0 flex-1 items-center">
        <span className="inline-block flex-shrink-0">{image}</span>

        <TitleAndSubtitle title={title} subtitle={subtitle} />
      </div>
      {deleteButton}
    </div>
  );
}

// ===========================================================================

interface Props3 {
  title?: string;
  subtitle?: string;
}

export function TitleAndSubtitle({ title, subtitle }: Props3) {
  const titleStyle = 'truncate text-md font-bold text-gray-900';
  let subtitleStyle = 'truncate text-sm text-gray-500';

  if (!title) {
    subtitleStyle = titleStyle;
  }

  return (
    <div className="ml-4 truncate">
      {title && <div className={titleStyle}>{title}</div>}
      {subtitle && <div className={subtitleStyle}>{subtitle}</div>}
    </div>
  );
}

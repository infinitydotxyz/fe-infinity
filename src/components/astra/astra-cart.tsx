import { CardData } from '@infinityxyz/lib/types/core';
import { BGImage, Button, Spacer } from 'src/components/common';
import { iconButtonStyle, largeIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { XIcon } from '@heroicons/react/outline';

interface Props {
  tokens: CardData[];
  onRemove: (token: CardData) => void;
  onCheckout: () => void;
}

export const AstraCart = ({ tokens, onRemove, onCheckout }: Props) => {
  return (
    <div className="w-48 h-full grid grid-rows-[1fr_auto]  grid-cols-[1fr]">
      <div className="row-span-1 col-span-1 flex flex-col space-y-2 items-start flex-1">
        {tokens.map((token, i) => {
          return <AstraCartItem key={token.id} token={token} index={i} onRemove={onRemove} />;
        })}
      </div>

      <div className="row-span-1 col-span-2 flex flex-col">
        <Button onClick={onCheckout}>Checkout</Button>
      </div>
    </div>
  );
};

// ====================================================================

interface Props2 {
  token: CardData;
  index: number;
  onRemove: (token: CardData) => void;
}

export const AstraCartItem = ({ token, index, onRemove }: Props2) => {
  return (
    <div key={token.id} className="flex items-center w-full">
      <div className="w-4 mr-2 text-right">{index + 1}.</div>
      <BGImage className={twMerge(largeIconButtonStyle, 'rounded-lg')} url={token.image} />
      <div className="ml-2">{token.tokenId}</div>

      <Spacer />
      <Button
        size="plain"
        variant="round"
        onClick={() => {
          onRemove(token);
        }}
      >
        <XIcon className={iconButtonStyle} />
      </Button>
    </div>
  );
};

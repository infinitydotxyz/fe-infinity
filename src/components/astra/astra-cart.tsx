import { EZImage, Spacer } from 'src/components/common';
import { AButton, ARoundButton, ATextButton } from 'src/components/astra';
import { smallIconButtonStyle } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ReactNode } from 'react';
import { MdClose } from 'react-icons/md';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { ERC721CardData } from '@infinityxyz/lib-frontend/types/core';

interface Props {
  tokens: ERC721CardData[];
  onRemove: (token?: ERC721CardData) => void;
  onCheckout: () => void;
}

export const AstraCart = ({ tokens, onRemove, onCheckout }: Props) => {
  const map = new Map<string, ERC721CardData[]>();
  const { user, chainId } = useOnboardContext();

  for (const token of tokens) {
    const tkns = map.get(token.tokenAddress ?? '') ?? [];
    tkns.push(token);
    map.set(token.tokenAddress ?? '', tkns);
  }

  let clearButton = <></>;

  if (tokens.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{tokens.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  let listComponent;

  if (map.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    map.forEach((tokenArray) => {
      const first = tokenArray[0];

      divList.push(
        <div className="w-full rounded-md px-4 font-bold truncate" key={`header-${first.id}`}>
          {first.collectionName}
        </div>
      );

      for (const t of tokenArray) {
        divList.push(<AstraCartItem key={t.id} token={t} index={index++} onRemove={onRemove} />);
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className="min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 dark:text-dark-body text-light-body overflow-y-auto">
        {divList}
      </div>
    );
  } else {
    listComponent = (
      <div
        key={Math.random()}
        className="flex items-center justify-center dark:text-dark-body text-light-body uppercase flex-1"
      >
        <div>Cart empty</div>
      </div>
    );
  }

  return (
    // setting to  w-72 so it doen't shrink and expand while animating
    <div className="h-full flex flex-col w-72">
      <div className=" m-4 flex items-center">
        <div className="text-4xl lg:text-3xl font-bold dark:text-dark-body text-light-body mr-3">Cart</div>
        {clearButton}
      </div>

      {listComponent}

      <div className="m-4 flex flex-col">
        <AButton disabled={!user || chainId !== '1' || tokens.length === 0} onClick={onCheckout}>
          Buy Now
        </AButton>
      </div>
    </div>
  );
};

// ====================================================================

interface Props2 {
  token: ERC721CardData;
  index: number;
  onRemove: (token: ERC721CardData) => void;
}

export const AstraCartItem = ({ token, index, onRemove }: Props2) => {
  return (
    <div key={token.id} className="flex items-center w-full">
      <div className="w-4 mr-2 text-right pr-2 text-sm">{index + 1}</div>
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={token.image} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-gray-500">{token.collectionName}</div>
        <div className="leading-5 text-lg font-bold">{token.tokenId}</div>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(token);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

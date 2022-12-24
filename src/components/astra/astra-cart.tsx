import { ERC721CardData, Erc721Collection } from '@infinityxyz/lib-frontend/types/core';
import { ReactNode } from 'react';
import { MdClose } from 'react-icons/md';
import { AButton, ARoundButton, ATextButton } from 'src/components/astra';
import { EZImage, Spacer } from 'src/components/common';
import { getCollectionId } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { infoBoxBGClr, smallIconButtonStyle, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';

interface Props {
  collections: Erc721Collection[];
  tokens: ERC721CardData[];
  onCollsRemove: (coll?: Erc721Collection) => void;
  onTokensRemove: (token?: ERC721CardData) => void;
  onCheckout: () => void;
}

export const AstraCart = ({ tokens, collections, onTokensRemove, onCollsRemove, onCheckout }: Props) => {
  const tokenMap = new Map<string, ERC721CardData[]>();
  const collMap = new Map<string, Erc721Collection[]>();
  const { user, chainId } = useOnboardContext();

  for (const token of tokens) {
    const tkns = tokenMap.get(token.tokenAddress ?? '') ?? [];
    tkns.push(token);
    tokenMap.set(token.tokenAddress ?? '', tkns);
  }

  for (const coll of collections) {
    const colls = collMap.get(getCollectionId(coll) ?? '') ?? [];
    colls.push(coll);
    collMap.set(getCollectionId(coll) ?? '', colls);
  }

  let clearButton = <></>;

  if (tokens.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{tokens.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onTokensRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  if (collections.length > 0) {
    clearButton = (
      <div className="flex items-center">
        <div className="bg-gray-300 rounded-full h-6 w-6 text-center mr-1 ">{collections.length}</div>
        <ATextButton
          className="px-2 rounded-lg text-gray-500 text-sm"
          onClick={() => {
            onCollsRemove();
          }}
        >
          Clear
        </ATextButton>
      </div>
    );
  }

  let listComponent;

  if (tokenMap.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    tokenMap.forEach((tokenArray) => {
      const first = tokenArray[0];

      divList.push(
        <div className="w-full rounded-md px-4 font-bold truncate" key={`header-${first.id}`}>
          {first.collectionName}
        </div>
      );

      for (const t of tokenArray) {
        divList.push(<AstraTokenCartItem key={t.id} token={t} index={index++} onRemove={onTokensRemove} />);
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className={twMerge(textClr, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {divList}
      </div>
    );
  } else if (collMap.size > 0) {
    const divList: ReactNode[] = [];
    let index = 0;
    collMap.forEach((collArray) => {
      const first = collArray[0];
      const collId = getCollectionId(first);

      for (const t of collArray) {
        divList.push(<AstraCollectionCartItem key={collId} collection={t} index={index++} onRemove={onCollsRemove} />);
      }

      divList.push(<div key={Math.random()} className="h-1" />);
    });

    // min-w-0 is important. otherwise text doesn't truncate
    listComponent = (
      <div className={twMerge(textClr, 'min-w-0 flex px-6 flex-col space-y-2 items-start flex-1 overflow-y-auto')}>
        {divList}
      </div>
    );
  } else {
    listComponent = (
      <div key={Math.random()} className={twMerge(textClr, 'flex items-center justify-center   uppercase flex-1')}>
        <div>Cart empty</div>
      </div>
    );
  }

  return (
    // setting to  w-72 so it doen't shrink and expand while animating
    <div className={twMerge(infoBoxBGClr, 'h-full flex flex-col w-72')}>
      <div className=" m-4 flex items-center">
        <div className={twMerge(textClr, 'text-4xl lg:text-3xl font-bold mr-3')}>Cart</div>
        {clearButton}
      </div>

      {listComponent}

      <div className="m-6 flex flex-col">
        <AButton primary={true} disabled={!user || chainId !== '1' || tokens.length === 0} onClick={onCheckout}>
          Place orders
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

export const AstraTokenCartItem = ({ token, index, onRemove }: Props2) => {
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

interface Props3 {
  collection: Erc721Collection;
  index: number;
  onRemove: (coll: Erc721Collection) => void;
}

export const AstraCollectionCartItem = ({ collection, index, onRemove }: Props3) => {
  return (
    <div key={getCollectionId(collection)} className="flex items-center w-full">
      <div className="w-4 mr-2 text-right pr-2 text-sm">{index + 1}</div>
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={collection.metadata.profileImage} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-gray-500">{collection.metadata.name}</div>
      </div>

      <Spacer />
      <ARoundButton
        onClick={() => {
          onRemove(collection);
        }}
      >
        <MdClose className={twMerge(smallIconButtonStyle, '   ')} />
      </ARoundButton>
    </div>
  );
};

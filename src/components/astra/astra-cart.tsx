import { ReactNode, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { AButton, ARoundButton, ATextButton } from 'src/components/astra';
import { EZImage, Spacer, TextInputBox } from 'src/components/common';
import { getCollectionKeyId, getDefaultOrderExpiryTime, getTokenKeyId } from 'src/utils';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { infoBoxBGClr, smallIconButtonStyle, textClr } from 'src/utils/ui-constants';
import { twMerge } from 'tailwind-merge';
import { ADropdown } from './astra-dropdown';
import { Erc721CollectionOffer, Erc721TokenOffer, ORDER_EXPIRY_TIME } from './types';

interface Props {
  collections: Erc721CollectionOffer[];
  tokens: Erc721TokenOffer[];
  onCollsRemove: (coll?: Erc721CollectionOffer) => void;
  onTokensRemove: (token?: Erc721TokenOffer) => void;
  onCheckout: () => void;
}

export const AstraCart = ({ tokens, collections, onTokensRemove, onCollsRemove, onCheckout }: Props) => {
  const tokenMap = new Map<string, Erc721TokenOffer[]>();
  const collMap = new Map<string, Erc721CollectionOffer[]>();
  const { user, chainId } = useOnboardContext();

  for (const token of tokens) {
    const tkns = tokenMap.get(token.tokenAddress ?? '') ?? [];
    tkns.push(token);
    tokenMap.set(token.tokenAddress ?? '', tkns);
  }

  for (const coll of collections) {
    const colls = collMap.get(getCollectionKeyId(coll) ?? '') ?? [];
    colls.push(coll);
    collMap.set(getCollectionKeyId(coll) ?? '', colls);
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
        <div className="w-full rounded-md font-bold truncate" key={`header-${first.id}`}>
          {first.collectionName}
        </div>
      );

      for (const t of tokenArray) {
        divList.push(<AstraTokenCartItem key={getTokenKeyId(t)} token={t} index={index++} onRemove={onTokensRemove} />);
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
      const collId = getCollectionKeyId(first);

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
        <AButton
          primary={true}
          disabled={!user || chainId !== '1' || (tokens.length === 0 && collections.length === 0)}
          onClick={onCheckout}
        >
          Place orders
        </AButton>
      </div>
    </div>
  );
};

// ====================================================================

interface Props2 {
  token: Erc721TokenOffer;
  index: number;
  onRemove: (token: Erc721TokenOffer) => void;
}

export const AstraTokenCartItem = ({ token, onRemove }: Props2) => {
  return (
    <div key={getTokenKeyId(token)} className="flex items-center w-full">
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={token.image} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-lg font-bold">{token.tokenId}</div>
        <PriceAndExpiry token={token}></PriceAndExpiry>
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
  collection: Erc721CollectionOffer;
  index: number;
  onRemove: (coll: Erc721CollectionOffer) => void;
}

export const AstraCollectionCartItem = ({ collection, onRemove }: Props3) => {
  return (
    <div key={getCollectionKeyId(collection)} className="flex items-center w-full">
      <EZImage className={twMerge('h-12 w-12 rounded-lg overflow-clip')} src={collection.metadata.profileImage} />

      <div className="ml-3 flex flex-col w-full">
        <div className="leading-5 text-gray-500">{collection.metadata.name}</div>
        <PriceAndExpiry collection={collection}></PriceAndExpiry>
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

interface Props4 {
  token?: Erc721TokenOffer;
  collection?: Erc721CollectionOffer;
}

const PriceAndExpiry = ({ token, collection }: Props4) => {
  const [price, setPrice] = useState('');
  const [expiry, setExpiry] = useState(getDefaultOrderExpiryTime());
  return (
    <div className="flex flex-row space-x-4">
      <TextInputBox
        autoFocus={true}
        addEthSymbol={true}
        type="number"
        value={price}
        label="Price"
        placeholder="0"
        onChange={(value) => {
          setPrice(value);
          if (token) {
            token.ethPrice = parseFloat(value);
          } else if (collection) {
            collection.ethPrice = parseFloat(value);
          }
        }}
      />
      <div>
        <div className="text-md mb-2">Expiry</div>
        <ADropdown
          hasBorder={true}
          label={expiry}
          items={[
            {
              label: ORDER_EXPIRY_TIME.HOUR,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.HOUR);
                if (token) {
                  token.expiry = ORDER_EXPIRY_TIME.HOUR;
                } else if (collection) {
                  collection.expiry = ORDER_EXPIRY_TIME.HOUR;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.DAY,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.DAY);
                if (token) {
                  token.expiry = ORDER_EXPIRY_TIME.DAY;
                } else if (collection) {
                  collection.expiry = ORDER_EXPIRY_TIME.DAY;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.WEEK,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.WEEK);
                if (token) {
                  token.expiry = ORDER_EXPIRY_TIME.WEEK;
                } else if (collection) {
                  collection.expiry = ORDER_EXPIRY_TIME.WEEK;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.MONTH,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.MONTH);
                if (token) {
                  token.expiry = ORDER_EXPIRY_TIME.MONTH;
                } else if (collection) {
                  collection.expiry = ORDER_EXPIRY_TIME.MONTH;
                }
              }
            },
            {
              label: ORDER_EXPIRY_TIME.YEAR,
              onClick: () => {
                setExpiry(ORDER_EXPIRY_TIME.YEAR);
                if (token) {
                  token.expiry = ORDER_EXPIRY_TIME.YEAR;
                } else if (collection) {
                  collection.expiry = ORDER_EXPIRY_TIME.YEAR;
                }
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

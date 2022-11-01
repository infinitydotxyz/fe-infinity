import { BaseCollection, ChainId, ERC721CardData } from '@infinityxyz/lib-frontend/types/core';
import { useEffect, useState } from 'react';
import { ErrorOrLoading, EthPrice } from 'src/components/common';
import { twMerge } from 'tailwind-merge';
import { useResizeDetector } from 'react-resize-detector';
import { CardGrid } from './card-grid';
import { ReservoirProvider, useReservoir } from './reservoir-context';
import { CardProps } from './card';
import { useOrderContext } from 'src/utils/context/OrderContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { useFetchSignedOBOrder } from 'src/hooks/api/useFetchSignedOBOrder';
import { useDrawerContext } from 'src/utils/context/DrawerContext';

interface Props {
  collection: BaseCollection;
  className?: string;
}

export const ReservoirCards = ({ collection, className = '' }: Props) => {
  const { addCartItem, removeCartItem, ordersInCart, cartItems, updateOrders } = useOrderContext();
  const { checkSignedIn } = useOnboardContext();
  const { fetchSignedOBOrder } = useFetchSignedOBOrder();
  const { fulfillDrawerParams } = useDrawerContext();

  // find & remove this item in cartItems & all orders' cartItems:
  const findAndRemove = (data: ERC721CardData | undefined) => {
    const foundItemIdx = cartItems.findIndex(
      (item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId
    );
    removeCartItem(cartItems[foundItemIdx]);
    ordersInCart.forEach((order) => {
      order.cartItems = order.cartItems.filter(
        (item) => !(item.collectionAddress === data?.address && item.tokenId === data?.tokenId)
      );
    });
    updateOrders(ordersInCart.filter((order) => order.cartItems.length > 0));
  };

  const isAlreadyAdded = (data: ERC721CardData | undefined) => {
    // check if this item was already added to cartItems or order.
    const found1 =
      cartItems.find((item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId) !==
      undefined;
    let found2 = false;
    for (const order of ordersInCart) {
      const foundInOrder = order.cartItems.find(
        (item) => item.collectionAddress === data?.address && item.tokenId === data?.tokenId
      );
      if (foundInOrder) {
        found2 = true;
        break;
      }
    }
    return found1 || found2;
  };

  const galleryOnClick = async (
    ev: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
    data?: ERC721CardData
  ) => {
    if (!checkSignedIn()) {
      return;
    }
    if (isAlreadyAdded(data)) {
      findAndRemove(data);
      return;
    }
    const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? 0;
    // setPrice(`${price}`);
    // addCartItem...
    if (price) {
      // Buy a listing
      // setIsBuyClicked(true); // to add to cart as a Buy order. (see: useEffect)
      const signedOBOrder = await fetchSignedOBOrder(data?.orderSnippet?.listing?.orderItem?.id ?? '');
      if (signedOBOrder) {
        fulfillDrawerParams.addOrder(signedOBOrder);
        fulfillDrawerParams.setShowDrawer(true);
      }
    } else {
      // Add a Buy order to cart (Make offer)
      addCartItem({
        chainId: data?.chainId as ChainId,
        collectionName: data?.collectionName ?? '',
        collectionAddress: data?.tokenAddress ?? '',
        collectionImage: data?.cardImage ?? data?.image ?? '',
        collectionSlug: data?.collectionSlug ?? '',
        tokenImage: data?.image ?? '',
        tokenName: data?.name ?? '',
        tokenId: data?.tokenId ?? '-1',
        isSellOrder: false,
        attributes: data?.attributes ?? []
      });
    }
  };

  return (
    <ReservoirProvider collection={collection} limit={50}>
      <ReservoirCardGrid
        collection={collection}
        cardProps={{
          cardActions: [
            {
              label: (data) => {
                const price = data?.orderSnippet?.listing?.orderItem?.startPriceEth ?? '';
                if (price) {
                  return (
                    <div className="flex justify-center">
                      <span className="mr-4 font-normal">Buy</span>
                      <EthPrice label={`${price}`} />
                    </div>
                  );
                }
                // if (isAlreadyAdded(data)) {
                //   return <div className="font-normal">✓ Added</div>;
                // }
                return <div className="font-normal">Add to order</div>;
              },
              onClick: galleryOnClick
            }
          ]
        }}
        className={className}
      />
    </ReservoirProvider>
  );
};

interface Props2 {
  collection: BaseCollection;
  cardProps?: CardProps;
  className?: string;
}

const ReservoirCardGrid = ({ className = '', cardProps }: Props2) => {
  const [error, setError] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const { cardData, fetchOrders, hasNoData } = useReservoir();

  const [gridWidth, setGridWidth] = useState(0);

  const { width, ref } = useResizeDetector();
  // const isMounted = useIsMounted();

  useEffect(() => {
    setHasNextPage(false);
    setError(false);
    setLoading(true);
    handleFetch(false);
  }, []);

  useEffect(() => {
    setGridWidth(ref.current ? ref.current.offsetWidth : 0);
  }, [width]);

  const handleFetch = (loadMore: boolean) => {
    fetchOrders(loadMore);

    setLoading(false);
  };

  let contents;

  if (error || loading || hasNoData) {
    contents = <ErrorOrLoading error={error} noData={hasNoData} />;
  } else {
    let width = 0;

    if (gridWidth > 0) {
      width = gridWidth;
    }

    contents = (
      <CardGrid
        cardData={cardData}
        handleFetch={handleFetch}
        hasNextPage={hasNextPage}
        width={width}
        cardProps={cardProps}
      />
    );
  }

  return (
    <div ref={ref} className={twMerge(className, 'flex flex-col')}>
      <div className={twMerge(className, 'flex items-start mt-[60px]')}>{contents}</div>
    </div>
  );
};

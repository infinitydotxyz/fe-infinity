import { GridHeader, GridHeaderProps } from './grid-header';
import { useScrollInfo } from './useScrollHook';
import { apiGet } from 'src/utils';
import { BaseCollection, ChainId } from '@infinityxyz/lib-frontend/types/core';
import NotFound404Page from 'pages/not-found-404';
import { NftDto, UserProfileDto } from '@infinityxyz/lib-frontend/types/dto';
import { OrderbookProvider } from 'src/components/orderbook/OrderbookContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useEffect } from 'react';
import { ProfileLayout } from './profile-layout';

// TODO: Upgrade to Next.js 13 to use layouts natively?
interface BaseDashboardProps {
  kind: 'collection' | 'profile' | 'token';
  error?: Error;
}

interface ProfileDashboardProps extends BaseDashboardProps {
  kind: 'profile';
  asset: {
    user: UserProfileDto;
    orderSide: Queries.Side;
  };
}

interface CollectionDashboardProps extends BaseDashboardProps {
  kind: 'collection';
  asset: {
    collection: BaseCollection;
  };
}

interface TokenDashboardProps extends BaseDashboardProps {
  kind: 'token';
  asset: {
    token: NftDto;
    collection: BaseCollection;
  };
}

export type DashboardProps = ProfileDashboardProps | CollectionDashboardProps | TokenDashboardProps;

export const DashboardLayout: React.FC<DashboardProps> = ({ children, error, ...props }) => {
  const { chainId } = useOnboardContext();
  const { setCollection } = useDashboardContext();
  const { setRef, scrollTop } = useScrollInfo();

  useEffect(() => {
    if (props.kind === 'collection' || props.kind === 'token') {
      setCollection(props.asset.collection);
    } else if (props.kind === 'profile') {
      setCollection(undefined);
    }
  }, [props.kind, props.asset]);

  if (error) {
    if (props.kind === 'profile') {
      console.error('Failed to find profile', error);
    } else if (props.kind === 'collection') {
      // failed to load collection (collection not indexed?)
      return (
        <NotFound404Page
          collectionSlug={props.asset.collection?.metadata.name.toString()}
          collectionAddress={props.asset.collection?.address}
          chainId={props.asset.collection?.chainId}
        />
      );
    } else if (props.kind === 'token') {
      // failed to load collection (collection not indexed?)
      return (
        <NotFound404Page
          collectionSlug={props.asset.token?.metadata.name.toString()}
          collectionAddress={props.asset.token?.collectionAddress}
          chainId={props.asset.token?.chainId}
        />
      );
    }
  }

  switch (props.kind) {
    case 'profile': {
      return (
        // This is added just for the ASortButton, so remove if we change how this works
        <OrderbookProvider
          limit={50}
          kind={'user'}
          context={{ chainId: chainId as ChainId, userAddress: props.asset.user.address, side: props.asset.orderSide }}
        >
          <ProfileLayout>{children}</ProfileLayout>
        </OrderbookProvider>
      );
    }

    case 'collection': {
      const headerProps: GridHeaderProps = {
        expanded: scrollTop < 100,
        avatarUrl: props.asset.collection.metadata.profileImage || props.asset.collection.metadata.bannerImage,
        title: props.asset.collection.metadata.name,
        description: props.asset.collection.metadata.description,
        hasBlueCheck: props.asset.collection.hasBlueCheck
      };

      const gridChildren = (
        <div className="flex flex-col items-end">
          <div className="text-lg whitespace-nowrap ml-3">{props.asset.collection.numNfts} Nfts</div>
        </div>
      );
      return (
        // This is added just for the ASortButton, so remove if we change how this works
        <OrderbookProvider
          limit={50}
          kind={'collection'}
          context={{ collectionAddress: props.asset.collection.address }}
        >
          <div className="flex flex-col h-full w-full">
            <GridHeader {...headerProps}>{gridChildren}</GridHeader>
            <div ref={setRef} className="overflow-y-auto">
              {children}
            </div>
          </div>
        </OrderbookProvider>
      );
    }

    case 'token': {
      const headerProps: GridHeaderProps = {
        expanded: scrollTop < 100,
        avatarUrl: props.asset.collection.metadata.profileImage || props.asset.collection.metadata.bannerImage,
        title: props.asset.collection.metadata.name,
        description: props.asset.collection.metadata.description,
        hasBlueCheck: props.asset.collection.hasBlueCheck
      };

      const gridChildren = (
        <div className="flex flex-col items-end">
          <div className="text-lg whitespace-nowrap ml-3">{props.asset.collection.numNfts} Nfts</div>
        </div>
      );
      return (
        // This is added just for the ASortButton, so remove if we change how this works
        <OrderbookProvider
          limit={50}
          kind={'token'}
          context={{ collectionAddress: props.asset.collection.address, tokenId: props.asset.token.tokenId }}
        >
          <div className="flex flex-col h-full w-full">
            <GridHeader {...headerProps}>{gridChildren}</GridHeader>
            <div ref={setRef} className="overflow-y-auto">
              {children}
            </div>
          </div>
        </OrderbookProvider>
      );
    }
  }
};

export async function getServerSideProps(
  kind: CollectionDashboardProps['kind'],
  collection: string
): Promise<{ props: CollectionDashboardProps }>;
export async function getServerSideProps(
  kind: TokenDashboardProps['kind'],
  collection: string,
  tokenId: string
): Promise<{ props: TokenDashboardProps }>;
export async function getServerSideProps(
  kind: ProfileDashboardProps['kind'],
  user: string,
  orderSide: Queries.Side
): Promise<{ props: ProfileDashboardProps }>;
export async function getServerSideProps(
  kind: DashboardProps['kind'],
  id: string,
  tokenIdOrdOrderSide?: string
): Promise<{ props: DashboardProps }> {
  switch (kind) {
    case 'collection': {
      const res = await apiGet(`/collections/${id}`);
      return {
        props: {
          asset: {
            collection: res.result ?? null
          },
          error: res.error ?? null,
          // undefined fails, must pass null
          kind: 'collection'
        }
      };
    }
    case 'profile': {
      const res = await apiGet(`/user/${id}`, { requiresAuth: false });
      return {
        props: {
          asset: {
            user: res.result ?? null,
            orderSide: tokenIdOrdOrderSide as Queries.Side
          },
          error: res.error ?? null,
          kind: 'profile'
        }
      };
    }
    case 'token': {
      const collectionResPromise = apiGet(`/collections/${id}`);
      const tokenResPromise = apiGet(`collections/${id}/nfts/${tokenIdOrdOrderSide}`);

      const [collectionRes, tokenRes] = await Promise.all([collectionResPromise, tokenResPromise]);

      return {
        props: {
          asset: {
            collection: collectionRes.result ?? null,
            token: tokenRes.result ?? null
          },
          error: collectionRes.error ?? tokenRes.error ?? null,
          kind: 'token'
        }
      };
    }
  }
}

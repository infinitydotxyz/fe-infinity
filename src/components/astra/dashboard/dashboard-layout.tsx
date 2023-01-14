import { ChainId } from '@infinityxyz/lib-frontend/types/core';
import { UserProfileDto } from '@infinityxyz/lib-frontend/types/dto';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { useEffect } from 'react';
import { OrderbookContextProvider } from 'src/components/orderbook/OrderbookContext';
import { apiGet } from 'src/utils';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { ProfileLayout } from './profile-layout';

// TODO: Upgrade to Next.js 13 to use layouts natively?
interface BaseDashboardProps {
  kind: 'collection' | 'profile' | 'token';
  error?: Error;
}

export interface ProfileDashboardProps extends BaseDashboardProps {
  kind: 'profile';
  asset: {
    user: UserProfileDto;
    orderSide: Queries.Side;
  };
}

export type DashboardProps = ProfileDashboardProps;

export const DashboardLayout: React.FC<DashboardProps> = ({ children, error, ...props }) => {
  const { chainId } = useOnboardContext();
  const { setCollection } = useDashboardContext();

  useEffect(() => {
    if (props.kind === 'profile') {
      setCollection(undefined);
    }
  }, [props.kind, props.asset]);

  if (error) {
    if (props.kind === 'profile') {
      console.error('Failed to find profile', error);
    }
  }

  switch (props.kind) {
    case 'profile': {
      return (
        <OrderbookContextProvider
          limit={50}
          kind={'profile'}
          context={{ chainId: chainId as ChainId, userAddress: props.asset.user.address, side: props.asset.orderSide }}
        >
          <ProfileLayout>{children}</ProfileLayout>
        </OrderbookContextProvider>
      );
    }
  }
};

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
  }
}

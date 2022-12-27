import { useRouter } from 'next/router';
import { PleaseConnectMsg } from 'src/utils';

import { useOnboardContext } from 'src/utils/OnboardContext/OnboardContext';
import { APageBox } from 'src/components/astra/astra-page-box';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { GetServerSidePropsContext } from 'next/types';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

const ProfilePage = (props: DashboardProps) => {
  const router = useRouter();
  const {
    query: { address }
  } = router;
  const { user } = useOnboardContext();

  if (!address) {
    return null;
  }
  const isMyProfile = address === 'me';
  if (isMyProfile && !user) {
    return (
      <APageBox title="Account" className="mb-12">
        <PleaseConnectMsg />
      </APageBox>
    );
  }

  return (
    <DashboardLayout {...props}>
      <OrderbookGraph />
    </DashboardLayout>
  );
};

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.name as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params
}

export default ProfilePage;

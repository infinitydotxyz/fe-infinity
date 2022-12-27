import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';

import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

export default function ProfileOrdersPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <OrderbookGraph />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.name as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

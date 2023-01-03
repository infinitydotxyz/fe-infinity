import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

export default function OrdersPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <OrderbookGraph />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}

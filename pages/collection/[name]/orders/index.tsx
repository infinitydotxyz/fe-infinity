import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { OrderbookCharts } from 'src/components/orderbook/charts/orderbook-charts';

export default function OrdersPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <OrderbookCharts />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}

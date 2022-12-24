import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashBoardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { OrderbookGraph } from 'src/components/orderbook/graph/orderbook-graph';

export default function OrdersPage(props: DashBoardProps) {
  return (
    <DashboardLayout {...props}>
      <OrderbookGraph />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return getDashboardServerSideProps(context);
}

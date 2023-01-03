import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  ProfileDashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';

import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { UserPageOrderList } from 'src/components/feed/user-page-order-list';

export default function ProfileOrdersPage(props: ProfileDashboardProps) {
  return (
    <DashboardLayout {...props}>
      <UserPageOrderList userInfo={props?.asset.user} />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.address as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

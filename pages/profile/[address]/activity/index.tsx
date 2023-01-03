import {
  DashboardLayout,
  ProfileDashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { GetServerSidePropsContext } from 'next';
import { minEventTypes } from 'src/components/astra/astra-filter-popdown';
import { UserActivityList } from 'src/components/profile/user-activity-list';

export default function ProfileActivityPage(props: ProfileDashboardProps) {
  return (
    <DashboardLayout {...props}>
      <UserActivityList types={minEventTypes} userAddress={props?.asset.user.address} forUserActivity={true} />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.address as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  ProfileDashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';

import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { UserOrderList } from 'src/components/profile/user-order-list';

export default function ProfileOrdersPage(props: ProfileDashboardProps) {
  const { isOrderSelected, toggleOrderSelection } = useDashboardContext();
  return (
    <DashboardLayout {...props}>
      <UserOrderList
        userInfo={props?.asset.user}
        isOrderSelected={isOrderSelected}
        toggleOrderSelection={toggleOrderSelection}
      />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.address as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

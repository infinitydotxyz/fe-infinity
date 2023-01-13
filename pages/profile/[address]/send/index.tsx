import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  getServerSideProps as getDashboardServerSideProps,
  ProfileDashboardProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { UserNFTs } from 'src/components/profile/user-nfts';

export default function ProfileSendPage(props: ProfileDashboardProps) {
  return (
    <DashboardLayout {...props}>
      <UserNFTs />
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.address as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

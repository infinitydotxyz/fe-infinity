import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CenteredContent } from 'src/components/common';
import * as Queries from '@infinityxyz/lib-frontend/types/dto/orders/orders-queries.dto';
import { GetServerSidePropsContext } from 'next';

export default function ProfileSendPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <CenteredContent>send goes here</CenteredContent>
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const address = context.query.name as string;
  return getDashboardServerSideProps('profile', address, Queries.Side.Maker); // TODO get this from the query params or refactor to use a filter
}

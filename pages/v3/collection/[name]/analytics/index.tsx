import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CenteredContent } from 'src/components/common';

export default function AnalyticsPage(props: DashboardProps) {
  return (
    <DashboardLayout {...props}>
      <CenteredContent>analytics go here</CenteredContent>
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}

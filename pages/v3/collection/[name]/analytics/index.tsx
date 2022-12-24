import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashBoardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CenteredContent } from 'src/components/common';

export default function AnalyticsPage(props: DashBoardProps) {
  return (
    <DashboardLayout {...props}>
      <CenteredContent>analytics go here</CenteredContent>
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return getDashboardServerSideProps(context);
}

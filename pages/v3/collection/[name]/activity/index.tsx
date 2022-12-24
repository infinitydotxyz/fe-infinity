import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashBoardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CenteredContent } from 'src/components/common';

export default function ActivityPage(props: DashBoardProps) {
  return (
    <DashboardLayout {...props}>
      <CenteredContent>activity goes here</CenteredContent>
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  return getDashboardServerSideProps(context);
}

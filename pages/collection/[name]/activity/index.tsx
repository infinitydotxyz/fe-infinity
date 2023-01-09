import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { CommunityFeed } from 'src/components/feed/community-feed';
import { useDashboardContext } from 'src/utils/context/DashboardContext';
import { textColor } from 'src/utils/ui-constants';

export default function ActivityPage(props: DashboardProps) {
  const { collection } = useDashboardContext();
  return (
    <DashboardLayout {...props}>
      {collection && <CommunityFeed collection={collection} className={textColor}></CommunityFeed>}
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}

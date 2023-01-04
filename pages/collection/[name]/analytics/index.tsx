import { GetServerSidePropsContext } from 'next';
import {
  DashboardLayout,
  DashboardProps,
  getServerSideProps as getDashboardServerSideProps
} from 'src/components/astra/dashboard/dashboard-layout';
import { TopHolderList } from 'src/components/feed/top-holder-list';
import { TwitterSupporterList } from 'src/components/feed/twitter-supporter-list';
import { useDashboardContext } from 'src/utils/context/DashboardContext';

export default function AnalyticsPage(props: DashboardProps) {
  const { collection } = useDashboardContext();
  return (
    <DashboardLayout {...props}>
      <div className="flex space-x-10 px-10 py-10">
        <div className="flex-1">{collection && <TopHolderList collection={collection}></TopHolderList>}</div>
        <div className="flex-1">
          {collection && <TwitterSupporterList collection={collection}></TwitterSupporterList>}
        </div>
      </div>
    </DashboardLayout>
  );
}

export function getServerSideProps(context: GetServerSidePropsContext) {
  const slug = context.query.name as string;
  return getDashboardServerSideProps('collection', slug);
}

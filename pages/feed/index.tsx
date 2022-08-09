import { PageBox } from 'src/components/common';
import { GlobalFeed } from 'src/components/feed-list/global-feed';

export default function Curation() {
  return (
    <PageBox title="Feed" showTitle={false}>
      <GlobalFeed />
    </PageBox>
  );
}

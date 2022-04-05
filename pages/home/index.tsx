import React from 'react';
import { useRouter } from 'next/router';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { PageBox } from 'src/components/common';

export function HomePage() {
  const {
    query: { name }
  } = useRouter();

  // name not used lint error fix
  console.log(name);

  return (
    <PageBox title={'Homepage'} center={false}>
      <div className="text-3xl mb-6">Feed</div>

      <CollectionFeed collectionAddress={''} />
    </PageBox>
  );
}

export default HomePage;

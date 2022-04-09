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
    <PageBox title={'Homepage'}>
      <div className="flex">
        <CollectionFeed header="Feed" />
        <div className="w-1/3 ml-4">
          <div className="text-3xl mb-6">Trending</div>
          <div>Trending Component</div>
        </div>
      </div>
    </PageBox>
  );
}

export default HomePage;

import React from 'react';
import { useRouter } from 'next/router';
import { CollectionFeed } from 'src/components/feed/collection-feed';
import { Layout } from 'src/components/common/layout';

export function HomePage() {
  const {
    query: { name }
  } = useRouter();

  // name not used lint error fix
  console.log(name);

  return (
    <Layout title="Home" className="w-full h-full grid place-items-center">
      <div className="flex md:w-[1024px] sm:w-full">
        <CollectionFeed header="Feed" className="w-2/3 sm:w-full" />

        <div className="ml-4 w-1/3 sm:w-full">
          <div className="text-3xl mb-6">Trending</div>
          <div>Trending Component</div>
        </div>
      </div>
    </Layout>
  );
}

export default HomePage;

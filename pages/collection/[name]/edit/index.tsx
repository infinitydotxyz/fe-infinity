import { BaseCollection } from '@infinityxyz/lib/types/core';
import { useRouter } from 'next/router';
import React from 'react';
import { AvatarImage } from 'src/components/collection/avatar-image';
import { Button } from 'src/components/common';
import logo from 'src/images/logo-mini-new.svg';
import { useFetch } from 'src/utils';

export default function EditCollectionPage() {
  const router = useRouter();
  const { result: collection } = useFetch<BaseCollection>(
    router.query.name ? `/collections/${router.query.name}` : '',
    { chainId: '1' }
  );

  return (
    <div className="transition w-[100vw] h-[100vh] overflow-y-auto">
      <header className="flex justify-between p-5">
        <img alt="logo" src={logo.src} width={logo.width} />
        <div className="flex flex-row space-x-2">
          <Button variant="outline" onClick={router.back}>
            Cancel
          </Button>
          <Button>Save</Button>
        </div>
      </header>
      <main className="flex flex-col my-0 mx-auto w-144">
        <section className="flex flex-row items-center">
          <AvatarImage url={collection?.metadata.profileImage} size="large" />
          <div className="flex flex-col space-y-2 ml-2">
            <Button>Upload</Button>
            <Button variant="outline">Delete</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
